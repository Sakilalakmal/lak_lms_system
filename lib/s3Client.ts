import "server-only";

import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

export const S3 = new S3Client({
  region: env.AWS_REGION, // AWS region (us-east-1)
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  // No endpoint needed for AWS S3 (uses default)
  // No forcePathStyle needed for AWS S3 (uses virtual-hosted style)
});
