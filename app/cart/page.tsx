import type { Metadata } from "next";
import CartClient from "./CartClient";

export const metadata: Metadata = {
    title: "カート｜選択中の大学院受験教材を確認・購入手続きへ",
    description: "カートに追加した大学院受験教材の内容と合計金額を確認できるページです。クーポンを適用してお得に購入できます。",
};

export default function CartPage() {
    return (
        <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50/30">
            <CartClient />
        </main>
    );
}
