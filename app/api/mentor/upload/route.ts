import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const requestId = formData.get("requestId") as string;
    const role = formData.get("role") as string; // "student" | "admin"

    if (!file || !requestId) {
        return NextResponse.json({ error: "Missing file or requestId" }, { status: 400 });
    }

    const request = await prisma.mentorRequest.findUnique({ where: { id: requestId } });
    if (!request) {
        return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // 学生は自分の申込にのみアップロード可能
    if (role === "student" && request.profileId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const filename = `mentor/${requestId}/${role === "admin" ? "reviewed" : "document"}-${Date.now()}-${file.name}`;
    const blob = await put(filename, file, { access: "public" });

    if (role === "admin") {
        await prisma.mentorRequest.update({
            where: { id: requestId },
            data: { reviewedDocUrl: blob.url },
        });
    } else {
        await prisma.mentorRequest.update({
            where: { id: requestId },
            data: { documentUrl: blob.url },
        });
    }

    return NextResponse.json({ url: blob.url });
}
