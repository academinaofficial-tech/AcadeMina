import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID || "";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.warn("R2 credentials missing in environment variables.");
}

export const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "academina-exampdfs";
