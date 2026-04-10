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
    <div className="w-full py-4 text-center bg-gray-100 text-gray-500 font-bold text-sm tracking-widest rounded-sm">
      カートに追加済み
    </div>
  ) : (
    <button
      onClick={handleClick}
      className="w-full py-4 bg-black text-white font-bold text-sm tracking-[0.15em] hover:bg-gray-800 transition-colors rounded-sm"
    >
      カートに追加
    </button>
  );
}
