import { S3Client } from "@aws-sdk/client-s3";

const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsRegion = process.env.AWS_REGION || "ap-northeast-1";
const r2AccountId = process.env.R2_ACCOUNT_ID;

// Use R2 endpoint if R2_ACCOUNT_ID is set, otherwise use standard S3 endpoint logic
const endpoint = r2AccountId 
  ? `https://${r2AccountId}.r2.cloudflarestorage.com` 
  : undefined;

// We export a singleton client to avoid creating multiple instances
export const s3 = new S3Client({
  region: awsRegion,
  endpoint: endpoint,
  // R2 requires path style requests, standard for S3 as well in many SDK cases
  forcePathStyle: !!r2AccountId, 
  credentials: {
    // We use fallback empty strings to prevent build errors if env vars are missing, 
    // though the API will throw on actual usage if invalid requests are made.
    accessKeyId: awsAccessKeyId || "",
    secretAccessKey: awsSecretAccessKey || "",
  },
});
