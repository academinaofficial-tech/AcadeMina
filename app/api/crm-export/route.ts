import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const auth = req.headers.get("Authorization");
  const secret = process.env.CRM_EXPORT_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const profiles = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(profiles);
}
