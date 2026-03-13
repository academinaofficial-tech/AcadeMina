import { prisma } from "@/lib/prisma";
import CheckoutClient from "./CheckoutClient";
import { currentUser } from "@clerk/nextjs/server";

export const metadata = {
  title: "決済 | AcadeMina",
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
