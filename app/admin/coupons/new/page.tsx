import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CouponNewClient from "./CouponNewClient";

export const metadata = { title: "クーポン発行 | Admin | AcadeMina" };

export default async function AdminCouponNewPage() {
    const user = await currentUser();
    if ((user?.publicMetadata as any)?.role !== "admin") redirect("/");

    return (
        <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50/50 py-12 px-5">
            <div className="max-w-xl mx-auto">
                <h1 className="text-3xl font-extrabold mb-8 text-text">クーポン発行</h1>
                <CouponNewClient />
            </div>
        </main>
    );
}
