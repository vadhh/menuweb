'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Minus, Plus, ShoppingBag, Loader2, AlertTriangle } from 'lucide-react'; // Added icons

// Redux imports
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { addToCart, decreaseQuantity, removeFromCart } from '@/lib/redux/cartSlice';

// Define a type for your product data
interface Product {
  _id: string; // Changed from 'id' to '_id' to match MongoDB's default ID field
  name: string;
  price: number; // <<-- CHANGE THIS TO number
  imageUrl: string;
  description?: string;
  category: string; // Assuming category is a string ID or name
}

// Function to fetch product data from API
async function fetchProductDetails(productId: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/${productId}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Product not found
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // data.price from API is already a number (e.g., 18000)

    // The 'price' field (data.price) is already a number.
    // No need for the previous parsing block if the API guarantees a number.

    // You can add a check if you want to be extra safe:
    if (typeof data.price !== 'number') {
      console.error("API Warning: Price was expected as a number, but received:", data.price, typeof data.price);
      // You might want to attempt a conversion here if this case is possible,
      // or assign a default, or ensure the API contract is firm.
      // For now, assuming the API sends a number as per the schema.
    }

    return data as Product; // data.price is now a number, matching the updated interface
  } catch (error) {
    console.error('Error fetching product details from API:', error);
    return null;
  }
}

// Helper function (can be in the same file or a utils file)
function formatCurrency(amount: number, locale: string = 'id-ID', currency: string = 'IDR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0, // To avoid ".00" if prices are whole numbers
    maximumFractionDigits: 0  // To avoid ".00"
  }).format(amount);
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redux state and dispatch
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Get current quantity of this product in cart
  const productInCart = cartItems.find(item => item.id === productId);
  const currentQuantityInCart = productInCart ? productInCart.quantity : 0;

  useEffect(() => {
    async function loadProduct() {
      if (!productId) {
        setError('Product ID is missing.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const productData = await fetchProductDetails(productId);
        if (productData) {
          setProduct(productData);
        } else {
          setError('Produk tidak ditemukan.');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Gagal memuat detail produk.');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        id: product._id,
        name: product.name,
        price: product.price, // Use product.price directly, it's already a number
        quantity: 1,
        imageUrl: product.imageUrl // Optional: if your cart slice stores it
      }));
    }
  };

  const handleIncreaseQuantity = () => {
    if (product) {
      // addToCart reducer typically handles incrementing quantity if item exists
      dispatch(addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1, // Dispatching with quantity 1, reducer should sum up
        imageUrl: product.imageUrl
      }));
    }
  };

  const handleDecreaseQuantity = () => {
    if (product && currentQuantityInCart > 0) {
      if (currentQuantityInCart === 1) {
        dispatch(removeFromCart(product._id));
      } else {
        dispatch(decreaseQuantity(product._id));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-muted-foreground bg-background p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading Produk...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-destructive bg-background p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Oops! Terjadi Kesalahan</h2>
        <p className="text-destructive/80">{error}</p>
        <Button
            variant="outline"
            onClick={() => router.back()}
            className="mt-6 border-destructive text-destructive hover:bg-destructive/10"
        >
            <ChevronLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-muted-foreground bg-background p-4">
         <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg">Detail produk tidak tersedia.</p>
         <Button variant="link" onClick={() => router.back()} className="mt-4 text-primary">
            Kembali ke menu
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-2xl p-0 sm:p-4">
        <div className="bg-card rounded-none sm:rounded-xl shadow-xl overflow-hidden animate-fade-in">
          {/* Back Button and Header Area */}
          <div className="relative">
            <img
              className="w-full h-64 md:h-80 object-cover"
              src={product.imageUrl}
              alt={product.name}
              onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/600x400/E0E0E0/999999?text=Image+Not+Available')}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="absolute top-4 left-4 bg-card/70 hover:bg-card text-foreground hover:text-primary rounded-full w-10 h-10"
              aria-label="Kembali"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary mb-4">{formatCurrency(product.price)}</p>

            {product.description && (
              <p className="text-muted-foreground text-base mb-6 leading-relaxed">{product.description}</p>
            )}

            {/* Cart Interaction Section */}
            <div className="mt-auto pt-6 border-t border-border">
              {currentQuantityInCart === 0 ? (
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg py-3 text-base font-semibold transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  onClick={handleAddToCart}
                  size="lg"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Tambah ke Keranjang
                </Button>
              ) : (
                <div className="flex flex-col items-center gap-4">
                    <p className="text-sm text-muted-foreground">Atur jumlah pesanan:</p>
                    <div className="flex items-center justify-center space-x-3 p-2 bg-muted rounded-xl w-fit">
                        <Button
                            variant="outline" // Or your themed variant for such buttons
                            size="icon"
                            onClick={handleDecreaseQuantity}
                            className="border-destructive text-destructive hover:bg-destructive/10 rounded-full w-10 h-10"
                            aria-label="Kurangi jumlah"
                        >
                            <Minus className="h-5 w-5" />
                        </Button>
                        <span className="text-2xl font-semibold text-foreground min-w-[40px] text-center">{currentQuantityInCart}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleIncreaseQuantity}
                            className="border-accent text-accent hover:bg-accent/10 rounded-full w-10 h-10"
                            aria-label="Tambah jumlah"
                        >
                            <Plus className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}