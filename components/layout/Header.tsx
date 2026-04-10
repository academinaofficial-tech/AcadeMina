"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { MAIN_NAV_LINKS } from "@/lib/navigation";

export default function Header() {
    const pathname = usePathname() || "";
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                <div className="md:hidden fixed inset-0 bg-text z-[1100] pt-28 px-10">
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