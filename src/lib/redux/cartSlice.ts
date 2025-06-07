import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the type for a cart item
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string; // Add this line
}

// Define the initial state for the cart
interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Action to add an item or increase quantity
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    // Action to decrease item quantity
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const existingItem = state.items.find(item => item.id === action.payload);
      if (existingItem) {
        if (existingItem.quantity === 1) {
          // Remove item if quantity becomes 0
          state.items = state.items.filter(item => item.id !== action.payload);
        } else {
          existingItem.quantity--;
        }
      }
    },
    // Action to remove an item completely
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    // Action to clear the entire cart
    clearCart: (state) => {
      state.items = [];
    },
    // Action to set initial quantity (useful for product detail page)
    setInitialQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
        const existingItem = state.items.find(item => item.id === action.payload.id);
        if (existingItem) {
            existingItem.quantity = action.payload.quantity;
        } else if (action.payload.quantity > 0) {
             // If item doesn't exist but quantity is > 0, this might indicate an issue
             // or a need to fetch product details here. For now, we'll just log.
             console.warn(`Attempted to set initial quantity for non-existent item: ${action.payload.id}`);
        }
    }
  },
});

export const { addToCart, decreaseQuantity, removeFromCart, clearCart, setInitialQuantity } = cartSlice.actions;

export default cartSlice.reducer;