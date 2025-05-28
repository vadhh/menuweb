import React from 'react';
import { DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react'; // Import the delete icon
import { AppDispatch } from '@/lib/redux/store'; // Import AppDispatch type
import { removeFromCart } from '@/lib/redux/cartSlice'; // Import the action

// Define a simple type for cart items (you'll expand this later)
interface CartItem {
  id: string;
  name: string;
  price: number; // Store price as number for calculations
  quantity: number;
}

interface CartDrawerContentProps {
  cartItems: CartItem[]; // Pass cart items as a prop
  dispatch: AppDispatch; // Add dispatch function as a prop
}

const CartDrawerContent: React.FC<CartDrawerContentProps> = ({ cartItems, dispatch }) => {
  // Calculate total price (example)
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Function to handle removing an item
  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>Your Basket</DrawerTitle>
        <DrawerDescription>Review your selected items.</DrawerDescription>
      </DrawerHeader>
      <div className="p-4 overflow-y-auto flex-grow"> {/* Added flex-grow and overflow */}
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your basket is empty.</p>
        ) : (
          <ul>
            {cartItems.map(item => (
              <li key={item.id} className="flex justify-between items-center border-b py-2">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="flex items-center gap-2"> {/* Flex container for price and delete button */}
                  <p className="font-semibold">Rp. {(item.price * item.quantity).toLocaleString('id-ID')}</p> {/* Format price */}
                  {/* Add buttons to increase/decrease quantity or remove item */}
                  <Button
                    variant="ghost" // Use ghost variant for a subtle button
                    size="icon" // Use icon size
                    onClick={() => handleRemoveItem(item.id)} // Add click handler
                    className="text-red-500 hover:bg-red-100" // Style the button
                  >
                    <Trash2 className="h-4 w-4" /> {/* Delete icon */}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <DrawerFooter>
        <div className="flex justify-between items-center font-bold text-lg mb-2">
            <span>Total:</span>
            <span>Rp. {total.toLocaleString('id-ID')}</span> {/* Format total price */}
        </div>
        <Button className="w-full bg-red-500 text-white rounded-md">Proceed to Checkout</Button>
        <DrawerClose asChild>
          <Button variant="outline">Close</Button>
        </DrawerClose>
      </DrawerFooter>
    </>
  );
};

export default CartDrawerContent;