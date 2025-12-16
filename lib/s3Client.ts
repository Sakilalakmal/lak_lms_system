import "server-only";

import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

// Lazy-loaded S3 client to avoid initialization during build
let s3Instance: S3Client | null = null;

export const S3 = new Proxy({} as S3Client, {
  get(_target, prop) {
    if (!s3Instance) {
      s3Instance = new S3Client({
        region: env.AWS_REGION,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
      });
    }
    return s3Instance[prop as keyof S3Client];
  },
});
