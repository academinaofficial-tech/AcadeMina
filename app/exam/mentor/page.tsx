import { prisma } from "@/lib/prisma";
import MentorApplyClient from "./MentorApplyClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "大学院受験メンター相談・研究計画書添削｜現役院生にオンラインで相談｜AcadeMina",
    description: "大学院受験に向けた面談相談・研究計画書添削サービス。志望校選び、研究室へのアプローチ、研究計画書の添削まで、現役院生がオンラインでサポート。完了後払いで安心してご利用いただけます。",
};

export default async function MentorPage() {
    const prices = await prisma.servicePrice.findMany();
    const reviewPrice = prices.find((p) => p.type === "REVIEW")?.price ?? 2980;

    return (
        <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50">
            <MentorApplyClient reviewPrice={reviewPrice} />
        </main>
    );
}
