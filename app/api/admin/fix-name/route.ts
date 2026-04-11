import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 一時的なエンドポイント：自分のプロフィール名をClerkの名前に同期する
export async function POST() {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = (user.publicMetadata as any)?.role;
    if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const firstName = user.firstName || "";
    const lastName = user.lastName || "";

    const updated = await prisma.profile.update({
        where: { id: user.id },
        data: { firstName, lastName },
    });

    return NextResponse.json({
        success: true,
        id: updated.id,
        firstName: updated.firstName,
        lastName: updated.lastName,
    });
}
