import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminExamNewClient from "./AdminExamNewClient";

export const metadata = {
  title: "教材登録 | Admin | AcadeMina",
};

export default async function AdminExamNewPage() {
  const user = await currentUser();
  const role = (user?.publicMetadata as any)?.role;
  if (role !== "admin") redirect("/");

  const universities = await prisma.university.findMany({
    include: {
      faculties: {
        include: {
          departments: true,
        },
      },
    },
  });

  return (
    <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50/50 py-12 px-5">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-text">新しい教材を登録</h1>
        <AdminExamNewClient hierarchy={universities} />
      </div>
    </main>
  );
}
