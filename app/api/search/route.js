import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ creators: [] });
    }

    await connectDB();

    // Escape regex special characters to prevent regex injection
    const escapedQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const regex = new RegExp(escapedQuery, "i");

    // Search users by name, username, or bio
    const creators = await User.find({
      $or: [{ name: regex }, { username: regex }, { bio: regex }],
    })
      .select("name username profilePic image bio")
      .limit(6)
      .lean();

    return NextResponse.json({ creators });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Failed to search creators" },
      { status: 500 }
    );
  }
}