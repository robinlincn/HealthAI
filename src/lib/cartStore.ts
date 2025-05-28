
import { create } from 'zustand';
import { persist, createJSONStorage, type PersistOptions } from 'zustand/middleware';
import type { CartItem, SaasProduct } from './types';
// Removed: import { useToast } from '@/hooks/use-toast'; // CRITICAL: Cannot call hooks in store

interface CartState {
  items: CartItem[];
  addItem: (product: SaasProduct, quantity?: number) => void;
  removeItem: (productId: string) => { name: string | undefined }; // Return name for toast in component
  updateItemQuantity: (productId: string, quantity: number) => { name: string | undefined, oldQuantity: number | undefined, newQuantity: number }; // Return info for toast
  clearCart: () => void;
  getTotalItems: () => number;
  getCartTotal: () => number;
  isCartInitialized: boolean;
  setCartInitialized: (isInitialized: boolean) => void;
}

type CartPersist = (
  config: (set: any, get: any, api: any) => CartState,
  options: PersistOptions<CartState>
) => (set: any, get: any, api: any) => CartState;


export const useCartStore = create<CartState>(
  (persist as CartPersist)(
    (set, get) => ({
      items: [],
      isCartInitialized: false,
      setCartInitialized: (isInitialized: boolean) => set({ isCartInitialized: isInitialized }),
      addItem: (product, quantity = 1) => {
        // DO NOT call useToast() or toast() here
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          let newItems;
          if (existingItem) {
            newItems = state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            const displayPrice = product.isOnSale && typeof product.discountPrice === 'number' 
              ? product.discountPrice 
              : product.price;
            newItems = [
              ...state.items,
              { 
                id: product.id, 
                name: product.name, 
                price: displayPrice, 
                quantity, 
                image: product.images && product.images.length > 0 ? product.images[0] : undefined,
                dataAiHint: product.dataAiHint 
              },
            ];
          }
          return { items: newItems };
        });
      },
      removeItem: (productId) => {
        // DO NOT call useToast() or toast() here
        const itemToRemove = get().items.find(item => item.id === productId);
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
        return { name: itemToRemove?.name };
      },
      updateItemQuantity: (productId, quantity) => {
        // DO NOT call useToast() or toast() here
        const itemToUpdate = get().items.find(item => item.id === productId);
        const oldQuantity = itemToUpdate?.quantity;
        let newQuantity = quantity;

        set((state) => {
          if (quantity <= 0) {
            newQuantity = 0; // For return value consistency
            return { items: state.items.filter((item) => item.id !== productId) };
          }
          newQuantity = quantity;
          return {
            items: state.items.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            ),
          };
        });
        return { name: itemToUpdate?.name, oldQuantity, newQuantity };
      },
      clearCart: () => {
        // DO NOT call useToast() or toast() here
        set({ items: [] });
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'shopping-cart-storage', 
      storage: createJSONStorage(() => localStorage), 
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setCartInitialized(true);
        }
      },
    }
  )
);

// Call this in your main App component or a top-level layout component once
// to ensure the store is hydrated and isCartInitialized is set.
export const initializeCart = () => {
  // This line might be problematic if called outside React component lifecycle
  // It's better to ensure `setCartInitialized` is called from a component useEffect
  // useCartStore.getState().setCartInitialized(true); 
};
