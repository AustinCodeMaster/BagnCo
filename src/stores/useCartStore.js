import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { products } from '../data/products.js';

const productIds = new Set(products.map((product) => product.id));

function sanitizeItems(items) {
  if (!Array.isArray(items)) return [];

  const quantities = new Map();
  for (const item of items) {
    if (!item || !productIds.has(item.productId) ||
      !Number.isSafeInteger(item.quantity) || item.quantity < 1) continue;

    const quantity = (quantities.get(item.productId) ?? 0) + item.quantity;
    if (Number.isSafeInteger(quantity)) quantities.set(item.productId, quantity);
  }

  return Array.from(quantities, ([productId, quantity]) => ({ productId, quantity }));
}

const useCartStore = create(persist((set) => ({
  items: [],

  addItem(productId) {
    if (!productIds.has(productId)) return;

    set((state) => ({
      items: state.items.some((item) => item.productId === productId)
        ? state.items.map((item) => item.productId === productId
          ? { ...item, quantity: Math.min(Number.MAX_SAFE_INTEGER, item.quantity + 1) }
          : item)
        : [...state.items, { productId, quantity: 1 }],
    }));
  },

  changeQuantity(productId, delta) {
    if (!productIds.has(productId) || !Number.isSafeInteger(delta)) return;

    set((state) => ({
      items: state.items.map((item) => item.productId === productId
        ? { ...item, quantity: Math.max(1, Math.min(Number.MAX_SAFE_INTEGER, item.quantity + delta)) }
        : item),
    }));
  },

  removeItem(productId) {
    set((state) => ({ items: state.items.filter((item) => item.productId !== productId) }));
  },
}), {
  name: 'bag-and-co-cart',
  version: 1,
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({ items: state.items }),
  merge: (persistedState, currentState) => ({
    ...currentState,
    items: sanitizeItems(persistedState?.items),
  }),
}));

export default useCartStore;
