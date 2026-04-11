import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await currentUser();
    const role = (user?.publicMetadata as any)?.role;
    if (role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, price, category, deptId, description, contents, pdfKey, image } = body;

    const exam = await prisma.exam.update({
        where: { id: params.id },
        data: {
            ...(title !== undefined && { title }),
            ...(price !== undefined && { price: Number(price) }),
            ...(category !== undefined && { category }),
            ...(deptId !== undefined && { deptId: deptId || null }),
            ...(description !== undefined && { description }),
            ...(contents !== undefined && { contents }),
            ...(pdfKey !== undefined && { pdfKey }),
            ...(image !== undefined && { image }),
        },
    });

    return NextResponse.json(exam);
}
