import { prisma } from "@/lib/prisma";
import CheckoutClient from "./CheckoutClient";
import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "購入手続き｜大学院受験教材の決済・情報入力ページ",
  description:
    "選択した大学院受験教材の購入手続きを行うページです。必要情報の入力と決済を完了し、過去問や対策教材をすぐに利用できる状態に進めます。",
};

export default async function Page() {
  const user = await currentUser();
  const exams = await prisma.exam.findMany();

  let profile = null;
  if (user) {
    profile = await prisma.profile.findUnique({
      where: { id: user.id },
    });
  }

  return (
    <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50/50">
      <CheckoutClient allExams={exams} initialProfile={profile} />
    </main>
  );
}
