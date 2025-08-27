import { create } from 'zustand';
import type { Product } from '../components/ProductCard';

export type CartItem = { product: Product; quantity: number };

type CartState = {
  items: CartItem[];
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  add: (product, quantity = 1) => {
    const existing = get().items.find((i) => i.product.id === product.id);
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        ),
      });
    } else {
      set({ items: [...get().items, { product, quantity }] });
    }
  },
  remove: (productId) => set({ items: get().items.filter((i) => i.product.id !== productId) }),
  clear: () => set({ items: [] }),
}));

