import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        const role = (user?.publicMetadata as any)?.role;
        if (role !== "admin") {
            return new NextResponse("Forbidden: Admin access required", { status: 403 });
        }

        const body = await req.json();
        const {
            title,
            price,
            category,
            deptId,
            description,
            contents,
            image,
        } = body;

        if (!title || price === undefined || !category) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const exam = await prisma.exam.create({
            data: {
                title,
                price: Number(price),
                category,
                deptId: deptId || null,
                description: description || "",
                contents: contents || [],
                image: image || null,
            },
        });

        return NextResponse.json(exam);
    } catch (error: any) {
        console.error("Exam creation error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
