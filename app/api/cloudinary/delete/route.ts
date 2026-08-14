import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const { publicIds } = await request.json();

  if (!Array.isArray(publicIds) || publicIds.length === 0) {
    return NextResponse.json({ deleted: {} });
  }

  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return NextResponse.json(result);
  } catch (error) {
    console.log("Error deleting from Cloudinary:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
