"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
    const pathname = usePathname() || "";
    const [cartCount, setCartCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            try {
                const cart = JSON.parse(localStorage.getItem('am_cart') || '[]');
                setCartCount(cart.length);
            } catch (e) {
                console.error(e);
            }
        };

        handleStorageChange();
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('cart_updated', handleStorageChange as EventListener);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('cart_updated', handleStorageChange as EventListener);
        };
    }, []);

    const isActive = (navPath: string) => {
        return pathname.includes(navPath) && pathname !== "/" ? "nav-active" : "";
    };

    return (
        <header className="fixed top-0 left-0 w-full z-[1000] shadow-sm">
            {/* Upper Tier: Main Utility Bar (White) */}
            <div className="h-20 bg-white flex justify-between items-center px-5 md:px-10 border-b border-gray-100">
                <Link href="/" className="flex items-center transition-opacity duration-300 hover:opacity-70">
                    <img src="/images/logo.png" alt="AcadeMina" className="h-[80px] md:h-[90px] w-auto" />
                </Link>

                <div className="flex items-center gap-4 md:gap-7">
                    <Link href="/cart" className="flex items-center text-[0.85rem] text-text transition-colors duration-200 hover:text-accent relative" title="カート">
                        <svg viewBox="0 0 24 24" width="20" height="20" className="fill-current">
                            <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.16 14.26l.04-.12.94-1.7h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0020.01 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25z" />
                        </svg>
                        {cartCount > 0 && <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[0.6rem] w-[14px] h-[14px] rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
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

                    <div className="flex flex-col gap-[5px] cursor-pointer z-[1200] md:hidden group" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
                    <Link href="/lab" className={`h-full flex items-center px-12 text-[0.9rem] font-bold tracking-wider hover:bg-white/10 transition-colors ${isActive("/lab") ? "text-gray-300" : ""}`}>研究室検索</Link>
                    <span className="text-white/20 font-light mx-4">|</span>
                    <Link href="/exam" className={`h-full flex items-center px-12 text-[0.9rem] font-bold tracking-wider hover:bg-white/10 transition-colors ${isActive("/exam") ? "text-gray-300" : ""}`}>院試サポート</Link>
                    <span className="text-white/20 font-light mx-4">|</span>
                    <Link href="/column" className={`h-full flex items-center px-12 text-[0.9rem] font-bold tracking-wider hover:bg-white/10 transition-colors ${isActive("/column") ? "text-gray-300" : ""}`}>コラム</Link>
                    <span className="text-white/20 font-light mx-4">|</span>
                    {/* PC版: コラムとAbout Usの間にNewsを追加 */}
                    <Link href="/news" className={`h-full flex items-center px-12 text-[0.9rem] font-bold tracking-wider hover:bg-white/10 transition-colors ${isActive("/news") ? "text-gray-300" : ""}`}>News</Link>
                    <span className="text-white/20 font-light mx-4">|</span>
                    <Link href="/about" className={`h-full flex items-center px-12 text-[0.9rem] font-bold tracking-wider hover:bg-white/10 transition-colors ${isActive("/about") ? "text-gray-300" : ""}`}>About Us</Link>
                    <span className="text-white/20 font-light mx-4">|</span>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-text z-[1100] pt-28 px-10">
                    <nav className="flex flex-col gap-10 text-white">
                        <Link href="/lab" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">研究室検索</Link>
                        <Link href="/exam" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">院試サポート</Link>
                        <Link href="/column" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">コラム</Link>
                        {/* スマホ版: ここにもNewsを追加 */}
                        <Link href="/news" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">News</Link>
                        <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">About Us</Link>

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