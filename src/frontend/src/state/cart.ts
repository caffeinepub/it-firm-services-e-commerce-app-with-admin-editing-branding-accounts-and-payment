import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../backend';

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) =>
                set((state) => {
                    const existingItem = state.items.find((item) => Number(item.product.id) === Number(product.id));
                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                Number(item.product.id) === Number(product.id)
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            )
                        };
                    }
                    return { items: [...state.items, { product, quantity: 1 }] };
                }),
            removeItem: (productId) =>
                set((state) => ({
                    items: state.items.filter((item) => Number(item.product.id) !== productId)
                })),
            updateQuantity: (productId, quantity) =>
                set((state) => ({
                    items:
                        quantity <= 0
                            ? state.items.filter((item) => Number(item.product.id) !== productId)
                            : state.items.map((item) =>
                                  Number(item.product.id) === productId ? { ...item, quantity } : item
                              )
                })),
            clearCart: () => set({ items: [] }),
            getTotal: () => {
                const state = get();
                return state.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
            }
        }),
        {
            name: 'cart-storage'
        }
    )
);
