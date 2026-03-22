import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { s3 } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const dynamic = "force-dynamic";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const examId = params.id;

        // 1. 購入履歴の確認
        const purchase = await prisma.purchase.findFirst({
            where: {
                profileId: userId,
                examId: examId,
            },
            include: {
                exam: true,
            }
        });

        if (!purchase) {
            return NextResponse.json({ error: "Purchase not found" }, { status: 403 });
        }

        const { exam } = purchase;

        // 2. PDFキーの確認
        if (!exam.pdfKey) {
            return NextResponse.json({ error: "PDF URL is not available yet" }, { status: 404 });
        }

        // 3. 環境変数の確認
        const bucketName = process.env.AWS_S3_BUCKET_NAME;
        if (!bucketName) {
            console.error("Missing AWS_S3_BUCKET_NAME environment variable");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        // 4. Presigned URLの生成 (有効期限: 5分 = 300秒)
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: exam.pdfKey,
            ResponseContentDisposition: `attachment; filename="${encodeURIComponent(exam.title)}.pdf"`, // ダウンロード時のファイル名指定（任意）
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

        // JSONでURLを返す
        return NextResponse.json({ url: signedUrl });
        
    } catch (err: any) {
        console.error("Presigned URL Generation Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
