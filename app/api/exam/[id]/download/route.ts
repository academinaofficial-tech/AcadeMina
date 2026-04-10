import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { s3Client, BUCKET_NAME } from "@/lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: examId } = await params;

    // ユーザーのProfileを取得
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile missing" }, { status: 404 });
    }

    // このユーザーが該当教材を購入しているかチェック
    const hasPurchase = await prisma.purchase.findFirst({
      where: {
        profileId: profile.id,
        examId: examId,
      },
    });

    if (!hasPurchase) {
      return NextResponse.json({ error: "購入履歴が見つかりません。" }, { status: 403 });
    }

    // 教材からpdfKeyを取得
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam || !exam.pdfKey) {
      return NextResponse.json({ error: "PDFが登録されていません。" }, { status: 404 });
    }

    // Presigned URLの発行 (5分間有効)
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: exam.pdfKey,
    });

    // 日本語ファイル名などをダウンロードさせるなら
    // command.input.ResponseContentDisposition = `attachment; filename="download.pdf"`;

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    return NextResponse.json({ url: signedUrl });

  } catch (error: any) {
    console.error("Presign error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
