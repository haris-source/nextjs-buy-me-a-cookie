import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
    }

    await connectDB();

    // 1. Check if already verified and saved (Idempotency)
    const existingPayment = await Payment.findOne({ stripeSessionId: sessionId });
    if (existingPayment) {
      return NextResponse.json({
        verified: true,
        alreadyProcessed: true,
        payment: existingPayment,
      });
    }

    // 2. Fetch session from Stripe (First attempt with platform secret key)
    let stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    let session;

    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (err) {
      // If not found under platform key, look up creator's custom key
      const usernameFromSession = req.headers.get("x-creator-username");
      if (usernameFromSession) {
        const creator = await User.findOne({ username: usernameFromSession.toLowerCase() });
        if (creator?.stripeSecretKey) {
          stripe = new Stripe(creator.stripeSecretKey);
          session = await stripe.checkout.sessions.retrieve(sessionId);
        }
      }
      if (!session) throw err;
    }

    // 3. Cryptographic and status verification
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment has not been completed" }, { status: 400 });
    }

    const { to_username, supporterName, message, cookieCount } = session.metadata || {};

    if (!to_username) {
      return NextResponse.json({ error: "Invalid payment metadata" }, { status: 400 });
    }

    // 4. Securely write payment to database
    const newPayment = await Payment.create({
      to_username: to_username.toLowerCase(),
      supporterName: supporterName || "Anonymous",
      message: message || "",
      amount: (session.amount_total || 0) / 100,
      cookieCount: Number(cookieCount) || 1,
      stripeSessionId: session.id,
      status: "completed",
    });

    return NextResponse.json({ verified: true, payment: newPayment });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
  }
}