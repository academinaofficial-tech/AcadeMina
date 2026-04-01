import { prisma } from "@/lib/prisma";
import MentorApplyClient from "./MentorApplyClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "面談・研究計画書添削｜AcadeMina",
    description: "大学院受験に向けた面談相談・研究計画書添削サービス。完了後払いで安心してご利用いただけます。",
};

export default async function MentorPage() {
    const prices = await prisma.servicePrice.findMany();
    const consultationPrice = prices.find((p) => p.type === "CONSULTATION")?.price ?? 0;
    const reviewPrice = prices.find((p) => p.type === "REVIEW")?.price ?? 0;

    return (
        <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50">
            <MentorApplyClient
                consultationPrice={consultationPrice}
                reviewPrice={reviewPrice}
            />
        </main>
    );
}
