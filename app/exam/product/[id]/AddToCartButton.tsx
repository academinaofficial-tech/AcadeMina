"use client";

import { useState, useEffect } from "react";

export default function AddToCartButton({ examId }: { examId: string }) {
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    const cart: string[] = JSON.parse(localStorage.getItem("am_cart") || "[]");
    setInCart(cart.includes(examId));
  }, [examId]);

  const handleClick = () => {
    const cart: string[] = JSON.parse(localStorage.getItem("am_cart") || "[]");
    if (!cart.includes(examId)) {
      const newCart = [...cart, examId];
      localStorage.setItem("am_cart", JSON.stringify(newCart));
      window.dispatchEvent(new Event("cart_updated"));
      setInCart(true);
    }
  };

  return inCart ? (
    <span className="px-6 py-3 bg-gray-100 text-gray-500 rounded-full font-bold text-sm">カート追加済み</span>
  ) : (
    <button
      onClick={handleClick}
      className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-accent transition-colors"
    >
      カートに追加
    </button>
  );
}
