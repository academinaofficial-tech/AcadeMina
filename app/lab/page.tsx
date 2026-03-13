import { prisma } from "@/lib/prisma";
import LabInsightClient from "./LabInsightClient";

export const metadata = {
  title: "Lab Insight | AcadeMina",
};

export default async function Page() {
  const labs = await prisma.lab.findMany({
    orderBy: { university: "asc" },
  });

  return (
    <main className="mt-20 md:mt-[134px]">
      <LabInsightClient initialLabs={labs} />
    </main>
  );
}
