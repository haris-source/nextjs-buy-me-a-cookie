import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import validator from "validator";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!validator.isLength(name.trim(), { min: 2, max: 50 })) {
      return NextResponse.json(
        { message: "Name must be between 2 and 50 characters" },
        { status: 400 }
      );
    }

    if (!validator.isEmail(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (!validator.isLength(password, { min: 6, max: 100 })) {
      return NextResponse.json(
        { message: "Password must be between 6 and 100 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    // Generate unique initial username
    let baseUsername = normalizedEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
    if (!baseUsername || baseUsername.length < 2) {
      baseUsername = "creator";
    }
    
    let uniqueUsername = baseUsername;
    let count = 1;
    while (await User.findOne({ username: uniqueUsername })) {
      uniqueUsername = `${baseUsername}${count}`;
      count++;
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.create({
      name: name.trim(),
      email: normalizedEmail,
      username: uniqueUsername,
      password: hashedPassword,
      provider: "credentials",
    });

    return NextResponse.json(
      { message: "User registered successfully", username: uniqueUsername },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}