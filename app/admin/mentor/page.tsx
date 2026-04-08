import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminMentorClient from "./AdminMentorClient";

export default async function AdminMentorPage() {
    const { userId, sessionClaims } = await auth();
    if (!userId) redirect("/account/login");

    const role = (sessionClaims?.publicMetadata as any)?.role;
    if (role !== "admin") redirect("/");

    const requests = await prisma.mentorRequest.findMany({
        include: { profile: true },
        orderBy: { createdAt: "desc" },
    });

    const prices = await prisma.servicePrice.findMany();
    const consultationPrice = prices.find((p) => p.type === "CONSULTATION")?.price ?? 0;
    const reviewPrice = prices.find((p) => p.type === "REVIEW")?.price ?? 0;

    return (
        <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50">
            <div className="max-w-[1000px] mx-auto px-5 py-16">
                <h1 className="text-2xl font-extrabold mb-10">管理画面 / メンターサービス</h1>
                <AdminMentorClient
                    requests={requests as any}
                    consultationPrice={consultationPrice}
                    reviewPrice={reviewPrice}
                />
            </div>
        </main>
    );
}
