
import { create } from 'zustand';
import { persist, createJSONStorage, type PersistOptions } from 'zustand/middleware';
import type { CartItem, SaasProduct } from './types';
import { useToast } from '@/hooks/use-toast';

interface CartState {
  items: CartItem[];
  addItem: (product: SaasProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
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
        const { toast } = useToast(); // This might cause issues if useToast relies on React context outside React tree.
                                    // It's generally safer to call toast from components.
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
          // Consider moving toast calls to components where addItem is invoked
          // toast({ title: "已加入购物车", description: `${product.name} 已添加到您的购物车。` });
          return { items: newItems };
        });
      },
      removeItem: (productId) => {
        // const { toast } = useToast(); // Safer to call toast from components
        const itemToRemove = get().items.find(item => item.id === productId);
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
        // if (itemToRemove) {
        //      toast({ title: "商品已移除", description: `${itemToRemove.name} 已从购物车中移除。`, variant: "destructive" });
        // }
      },
      updateItemQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
             const itemToRemove = state.items.find(item => item.id === productId);
            // if (itemToRemove) {
            //     // toast({ title: "商品已移除", description: `${itemToRemove.name} 已从购物车中移除。`});
            // }
            return { items: state.items.filter((item) => item.id !== productId) };
          }
          return {
            items: state.items.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            ),
          };
        });
      },
      clearCart: () => {
        // const { toast } = useToast(); // Safer to call toast from components
        set({ items: [] });
        // toast({ title: "购物车已清空" });
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
  useCartStore.getState().setCartInitialized(true);
};

    