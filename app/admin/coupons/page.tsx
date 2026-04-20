import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CouponListClient from "./CouponListClient";

export const metadata = { title: "クーポン管理 | Admin | AcadeMina" };

export default async function AdminCouponsPage() {
    const user = await currentUser();
    if ((user?.publicMetadata as any)?.role !== "admin") redirect("/");

    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

    return (
        <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50/50 py-12 px-5">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold text-text">クーポン管理</h1>
                    <Link
                        href="/admin/coupons/new"
                        className="bg-accent text-white px-6 py-3 rounded-full font-bold text-sm hover:opacity-80 transition-opacity"
                    >
                        + 新規発行
                    </Link>
                </div>

                <CouponListClient coupons={coupons} />
            </div>
        </main>
    );
}
