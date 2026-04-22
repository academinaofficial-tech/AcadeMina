import React from "react";
import Link from "next/link";
import { UrlObject } from "url";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Url = string | UrlObject;

type ButtonBaseProps = {
    variant?: "outline" | "solid" | "gray";
    className?: string;
    children: React.ReactNode;
};

type ButtonAsButtonProps = ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
};

type ButtonAsLinkProps = ButtonBaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: Url;
};

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export default function Button({
    href,
    variant = "outline",
    className = "",
    children,
    ...props
}: ButtonProps) {
    // 🎨 スタイルのバリエーション定義
    const baseStyle = "inline-flex items-center justify-center gap-2 px-12 py-4 rounded-full font-bold transition-all duration-300 text-center";
    
    const variants = {
        // A案：白枠線 ＆ ホバーで黒反転 (StoryDetail等で使用されていた定番スタイル)
        outline: "border-2 border-black bg-transparent text-black hover:bg-black hover:text-white",
        
        // B案：黒塗り ＆ フワッと浮く (よりリッチなアクセントスタイル)
        solid: "bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-1",

        // C案：グレー ＆ 無効化風 (建設中などの状態に使用)
        gray: "bg-gray-200 text-gray-400 border-2 border-gray-200 cursor-not-allowed shadow-none",
    };

    const combinedClassName = cn(baseStyle, variants[variant], className);

    // href が渡された場合は Next.js の Link としてレンダリングする
    if (href) {
        return (
            <Link href={href} className={combinedClassName} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
                {children}
            </Link>
        );
    }

    // href がない場合は通常の button としてレンダリングする
    return (
        <button className={combinedClassName} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
            {children}
        </button>
    );
}
