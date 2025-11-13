import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { error } from "console";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/s3Client";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { requireAdmin } from "@/app/data/admin/require-admin";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "File name is required" }),
  contentType: z.string().min(1, { message: "Content type is required" }),
  size: z.number().min(1, { message: "File size is required" }),
  isImage: z.boolean(),
});

const aj = arcjet

  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );

export async function POST(request: Request) {
  const session = await requireAdmin();
  try {
    const decision = await aj.protect(request, {
      fingerprint: session?.user?.id!,
    });

    if (decision.isDenied()) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();

    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { fileName, contentType, size, isImage } = validation.data;

    const unique = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_NAME_IMGES,
      Key: unique,
      ContentType: contentType, // AWS S3 needs ContentType
      // No ACL needed for private buckets with public access
    });

    console.log("🚀 AWS S3 Upload - Generating presigned URL");
    console.log("📦 Bucket:", env.NEXT_PUBLIC_S3_NAME_IMGES);
    console.log("🔑 Key:", unique);
    console.log("📄 ContentType:", contentType);
    console.log("🌍 Region:", env.AWS_REGION);
    console.log(
      "🔐 Access Key:",
      env.AWS_ACCESS_KEY_ID?.substring(0, 10) + "..."
    );
    console.log("📁 File Size:", size, "bytes");

    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 900, // 15 minutes (AWS best practice)
    });

    console.log("✅ AWS S3 Presigned URL generated successfully!");
    console.log("🔗 URL:", presignedUrl);
    console.log("⏰ Expires in: 15 minutes");

    const response = {
      presignedUrl: presignedUrl,
      Key: unique,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
