import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email.toLowerCase() })
      .select("-password")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET Profile Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    await connectDB();

    const pic = data.profilePic || data.image || "";
    const cleanUsername = data.username ? data.username.trim().toLowerCase() : "";

    // Check if username is being taken by another user
    if (cleanUsername) {
      const usernameExists = await User.findOne({
        username: cleanUsername,
        email: { $ne: session.user.email.toLowerCase() },
      });
      if (usernameExists) {
        return NextResponse.json(
          { error: "This username is already taken by another creator." },
          { status: 400 }
        );
      }
    }

    const updateFields = {
      name: data.name,
      username: cleanUsername,
      bio: data.bio || "",
      profilePic: pic,
      image: pic,
      coverPic: data.coverPic || "",
      stripePublishableKey: data.stripePublishableKey || "",
      stripeSecretKey: data.stripeSecretKey || "",
    };

    // Password Update & Verification
    if (data.newPassword && data.newPassword.trim().length > 0) {
      if (!data.currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password." },
          { status: 400 }
        );
      }

      const existingUser = await User.findOne({
        email: session.user.email.toLowerCase(),
      }).select("+password");

      if (!existingUser || !existingUser.password) {
        return NextResponse.json(
          { error: "Password cannot be changed on OAuth accounts." },
          { status: 400 }
        );
      }

      const isCurrentValid = await bcrypt.compare(
        data.currentPassword,
        existingUser.password
      );

      if (!isCurrentValid) {
        return NextResponse.json(
          { error: "Incorrect previous password." },
          { status: 400 }
        );
      }

      if (data.newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters long." },
          { status: 400 }
        );
      }

      updateFields.password = await bcrypt.hash(data.newPassword, 12);
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email.toLowerCase() },
      { $set: updateFields },
      { returnDocument: "after" }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("PUT Profile Error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const deletedUser = await User.findOneAndDelete({
      email: session.user.email.toLowerCase(),
    });

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Account deleted" });
  } catch (error) {
    console.error("DELETE Account Error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}