"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  notes?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;

  // Cart actions
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  // UI actions
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setLoading: (loading: boolean) => void;

  // Computed values
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getItemQuantity: (id: string) => number;
  isItemInCart: (id: string) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: true,

      addItem: (item) => {
        const items = get().items;
        const existingItemIndex = items.findIndex((i) => i.id === item.id);

        if (existingItemIndex > -1) {
          // Item exists, increment quantity
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += 1;
          set({ items: updatedItems });
        } else {
          // New item, add with quantity 1
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        const items = get().items;
        const updatedItems = items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getItemQuantity: (id) => {
        const item = get().items.find((item) => item.id === id);
        return item ? item.quantity : 0;
      },

      isItemInCart: (id) => {
        return get().items.some((item) => item.id === id);
      },
    }),
    {
      name: "kaj-cart-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist cart items, not UI state
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Helper hook for server-side rendering compatibility
export const useCartStoreSSR = () => {
  const store = useCartStore();

  // Return empty state on server-side
  if (typeof window === "undefined") {
    return {
      ...store,
      items: [],
      getTotalPrice: () => 0,
      getTotalItems: () => 0,
      getItemQuantity: () => 0,
      isItemInCart: () => false,
    };
  }

  return store;
};
