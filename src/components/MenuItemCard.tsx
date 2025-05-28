import React from 'react';
import Link from 'next/link'; // Import Link from Next.js
import { Minus, Plus, ShoppingCart } from 'lucide-react'; // Import necessary icons

// Define the Product interface (ensure this matches across your project)
interface Product {
  _id: string;
  name: string;
  price: number; // Price is now a number
  imageUrl?: string;
  categoryId: string;
  description?: string;
}

interface MenuItemCardProps {
  product: Product;
  altText?: string;
  quantity: number;
  onAddToCart: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  product,
  altText,
  quantity,
  onAddToCart,
  onIncrease,
  onDecrease,
}) => {
  console.log('MenuItemCard product._id:', product._id); // Add this line
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden flex flex-col h-full
                    transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-0.5">
      <Link
      href={`/products/${product._id}`}
      className="block cursor-pointer" >
      {/* Image Section - Adjusted aspect ratio */}
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={product.imageUrl || 'https://via.placeholder.com/320x240/E0E0E0/B0B0B0?text=Menu'}
          alt={altText || product.name}
          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/320x240/E0E0E0/B0B0B0?text=Error')}
        />
      </div>

      {/* Content Section - Reduced padding and font size for name */}
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold text-foreground mb-1 truncate" title={product.name}>
          {product.name}
        </h3>
        {/* Price color changed to text-foreground with font-semibold */}
        <p className="text-sm text-foreground font-semibold mb-2.5">
          {formattedPrice}
        </p>
      </div>
      </Link>

      {/* Cart Interaction Buttons - Aligned to bottom */}
      <div className="p-3 pt-0"> {/* Adjusted padding to avoid double padding with Link's content area */}
        <div className="mt-auto">
          {quantity === 0 ? (
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(); }} // Prevent Link navigation when clicking add to cart
              // Adjusted button padding
              className="w-full flex items-center justify-center gap-1.5 bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-card"
            >
              <ShoppingCart size={16} />
              Tambah
            </button>
          ) : (
            <div className="flex items-center justify-between p-1 bg-muted rounded-lg">
              <button
                onClick={(e) => { e.stopPropagation(); onDecrease(); }} // Prevent Link navigation
                className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-colors duration-150 h-8 w-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-destructive/50 focus:ring-offset-1 focus:ring-offset-muted"
                aria-label="Kurangi jumlah"
              >
                <Minus size={18} />
              </button>
              <span className="text-base font-medium text-foreground min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onIncrease(); }} // Prevent Link navigation
                className="text-green-200 hover:bg-green-300/10 p-1.5 rounded-md transition-colors duration-150 h-8 w-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-300                                                   /50 focus:ring-offset-1 focus:ring-offset-muted"
                aria-label="Tambah jumlah"
              >
                <Plus size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;