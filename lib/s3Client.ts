import "server-only";

import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

// Lazy-loaded S3 client to avoid initialization during build
let s3Instance: S3Client | null = null;

function getS3Instance() {
  if (!s3Instance) {
    s3Instance = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Instance;
}

export const S3 = new Proxy({} as S3Client, {
  get(_target, prop) {
    const instance = getS3Instance();
    const value = instance[prop as keyof S3Client];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});
