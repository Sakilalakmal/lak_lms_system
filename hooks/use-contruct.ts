import { env } from "@/lib/env";

export function useConstructUrl(key: string): string {
  return `https://${env.NEXT_PUBLIC_S3_NAME_IMGES}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
}
