import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (sessionClaims?.publicMetadata as any)?.role;
    if (role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { requestId, status } = await req.json();
    if (!requestId || !status) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const updated = await prisma.mentorRequest.update({
        where: { id: requestId },
        data: { status },
    });

    return NextResponse.json(updated);
}
