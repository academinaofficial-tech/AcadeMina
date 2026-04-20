"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
    examId: string;
    title: string;
    price: number;
    image?: string | null;
};

type CartStore = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (examId: string) => void;
    clearCart: () => void;
    isInCart: (examId: string) => boolean;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                if (get().isInCart(item.examId)) return;
                set((state) => ({ items: [...state.items, item] }));
            },
            removeItem: (examId) => {
                set((state) => ({ items: state.items.filter((i) => i.examId !== examId) }));
            },
            clearCart: () => set({ items: [] }),
            isInCart: (examId) => get().items.some((i) => i.examId === examId),
        }),
        { name: "academina-cart" }
    )
);
