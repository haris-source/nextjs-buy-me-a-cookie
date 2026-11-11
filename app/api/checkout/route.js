import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { username, cookieCount, supporterName, message } = await req.json();

    const cleanCount = Math.floor(Number(cookieCount));
    if (!username || !cleanCount || cleanCount < 1) {
      return NextResponse.json({ error: "Invalid payment parameters" }, { status: 400 });
    }

    await connectDB();
    const cleanUsername = String(username).trim().toLowerCase();

    const creator = await User.findOne({
      $or: [
        { username: cleanUsername },
        { email: { $regex: new RegExp(`^${cleanUsername}@`, "i") } },
      ],
    });

    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    // Platform key fallback
    const secretKey = creator.stripeSecretKey || process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "Stripe key is not configured on platform or creator profile" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);
    const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const targetUsername = (creator.username || cleanUsername).toLowerCase();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Cookie for @${targetUsername}`,
              description: message?.trim() || "Creative project tip",
            },
            unit_amount: 500, // $5.00
          },
          quantity: cleanCount,
        },
      ],
      mode: "payment",
      metadata: {
        to_username: targetUsername,
        supporterName: (supporterName || "Anonymous").trim().slice(0, 50),
        message: (message || "").trim().slice(0, 300),
        cookieCount: String(cleanCount),
      },
      success_url: `${origin}/${targetUsername}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${targetUsername}?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Session Error:", err);
    return NextResponse.json({ error: err.message || "Failed to create checkout session" }, { status: 500 });
  }
}