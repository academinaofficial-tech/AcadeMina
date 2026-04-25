"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { MAIN_NAV_LINKS } from "@/lib/navigation";
import { useCartStore } from "@/lib/cartStore";

export default function Header() {
    const pathname = usePathname() || "";
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const cartCount = useCartStore((s) => s.items.length);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const isActive = (navPath: string) => {
        return pathname.includes(navPath) && pathname !== "/" ? "nav-active" : "";
    };

    return (
        <header className="fixed top-0 left-0 w-full z-header shadow-sm">
            {/* Upper Tier: Main Utility Bar (White) */}
            <div className="h-20 bg-white flex justify-between items-center px-5 md:px-10 border-b border-gray-100">
                <Link href="/" className="flex items-center transition-opacity duration-300 hover:opacity-70">
                    <Image src="/images/icon.png" alt="AcadeMina" width={180} height={48} className="h-[40px] md:h-[48px] w-auto rounded-[10px]" />
                </Link>

                <div className="flex items-center gap-4 md:gap-7">
                    {/* カートボタン */}
                    <Link href="/cart" className="relative p-2 hover:opacity-70 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                                {cartCount > 9 ? "9+" : cartCount}
                            </span>
                        )}
                    </Link>

                    <div className="hidden md:block h-4 w-px bg-gray-200" />

                    <div className="hidden md:flex items-center gap-6">
                        <SignedOut>
                            <Link href="/account/login" className="text-[0.85rem] text-text font-bold hover:text-accent">ログイン</Link>
                            <Link href="/account/signup" className="text-[0.85rem] text-text font-bold hover:text-accent">新規登録</Link>
                        </SignedOut>
                        <SignedIn>
                            <div className="flex items-center gap-5">
                                <Link href="/mypage" className="bg-text text-white px-4 py-2 rounded-full text-[0.85rem] font-bold hover:bg-gray-800 transition-colors whitespace-nowrap">
                                    マイページ
                                </Link>
                                <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
                            </div>
                        </SignedIn>
                    </div>

                    <div className="flex flex-col gap-[5px] cursor-pointer z-menu md:hidden group" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <span className={`block w-6 h-[2.5px] transition-all duration-300 ${isMenuOpen ? "bg-white rotate-45 translate-y-[7.5px]" : "bg-text"}`} />
                        <span className={`block w-6 h-[2.5px] transition-all duration-300 ${isMenuOpen ? "bg-white opacity-0" : "bg-text"}`} />
                        <span className={`block w-6 h-[2.5px] transition-all duration-300 ${isMenuOpen ? "bg-white -rotate-45 -translate-y-[7.5px]" : "bg-text"}`} />
                    </div>
                </div>
            </div>

            {/* Lower Tier: Navigation Bar (Dark/Black) */}
            <div className="hidden md:flex h-[54px] bg-text justify-center items-center px-10 shadow-inner">
                <nav className="flex items-center text-white/95 h-full">
                    <span className="text-white/20 font-light mx-4">|</span>
                    {MAIN_NAV_LINKS.map((link) => (
                        <React.Fragment key={link.href}>
                            <Link href={link.href} className={`h-full flex items-center px-12 text-[0.9rem] font-bold tracking-wider hover:bg-white/10 transition-colors ${isActive(link.href) ? "text-gray-300" : ""}`}>
                                {link.label}
                            </Link>
                            <span className="text-white/20 font-light mx-4">|</span>
                        </React.Fragment>
                    ))}
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-text z-overlay pt-28 px-10">
                    <nav className="flex flex-col gap-10 text-white">
                        {MAIN_NAV_LINKS.map((link) => (
                            <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">
                                {link.label}
                            </Link>
                        ))}

                        <div className="pt-10 border-t border-white/10 flex flex-col gap-8">
                            <SignedOut>
                                <Link href="/account/login" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold">ログイン</Link>
                                <Link href="/account/signup" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold">新規登録</Link>
                            </SignedOut>
                            <SignedIn>
                                <Link href="/mypage" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold">マイページ</Link>
                                <div className="flex items-center gap-3">
                                    <UserButton afterSignOutUrl="/" showName appearance={{ elements: { userButtonAvatarBox: "w-10 h-10", userButtonOuterIdentifier: "text-white font-bold text-lg" } }} />
                                </div>
                            </SignedIn>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}