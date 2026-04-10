import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { s3Client, BUCKET_NAME } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const role = (user?.publicMetadata as any)?.role;
    if (role !== "admin") {
      return new NextResponse("Forbidden: Admin access required", { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 一意なファイル名を付与
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const pdfKey = `exams/${uniqueSuffix}-${sanitizedName}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: pdfKey,
        Body: buffer,
        ContentType: file.type || "application/pdf",
      })
    );

    return NextResponse.json({ pdfKey });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
