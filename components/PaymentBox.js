"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function PaymentBox({ username, recipientName }) {
  const [cookieCount, setCookieCount] = useState(1);
  const [supporterName, setSupporterName] = useState("");
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const COOKIE_PRICE = 5;
  const totalAmount = cookieCount * COOKIE_PRICE;

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;

    // Verify session ID with the backend
    const verifyPayment = async () => {
      try {
        const res = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();
        if (res.ok && data.verified) {
          setVerifiedSuccess(true);
          router.replace(pathname, { scroll: false });
          setTimeout(() => setVerifiedSuccess(false), 7000);
          router.refresh(); // Refresh page to populate new supporter in feed
        }
      } catch (err) {
        console.error("Verification failed:", err);
      }
    };

    verifyPayment();
  }, [searchParams, router, pathname]);

  const handlePay = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          cookieCount,
          supporterName,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initialize payment");

      window.location.href = data.url;
    } catch (err) {
      setErrorMsg(err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <section className="rounded-3xl p-6 sm:p-7 backdrop-blur-xl bg-neutral-900/40 border border-white/10 shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          Buy {recipientName} a Cookie <span className="animate-bounce">🍪</span>
        </h2>
        <p className="text-xs text-neutral-400 mb-6">
          Fuel their next project with direct creative support.
        </p>

        {verifiedSuccess && (
          <div className="p-4 mb-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-start gap-3 shadow-lg shadow-emerald-500/10 animate-fade-in">
            <span className="text-xl">🎉</span>
            <div className="text-xs space-y-0.5">
              <p className="font-bold text-emerald-300">Payment Verified & Saved!</p>
              <p className="text-neutral-300">
                Thank you for backing @{username}! Your cookies have been registered.
              </p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-400 mb-2">
              Select cookies ($5 each)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCookieCount(num)}
                  className={`py-2.5 rounded-xl border text-sm font-bold transition cursor-pointer ${
                    cookieCount === num
                      ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/30"
                      : "bg-neutral-800/40 border-white/10 text-white hover:bg-neutral-800/80 hover:border-white/20"
                  }`}
                >
                  🍪 {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1.5">
              Your Name or @handle
            </label>
            <input
              type="text"
              placeholder="Anonymous or @twitter"
              value={supporterName}
              onChange={(e) => setSupporterName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm text-white rounded-xl bg-neutral-800/40 border border-white/10 backdrop-blur-md placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1.5">
              Say something nice <span className="text-neutral-500 font-normal">({message.length}/300)</span>
            </label>
            <textarea
              rows={3}
              maxLength={300}
              placeholder="Thank you for your work!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm text-white rounded-xl bg-neutral-800/40 border border-white/10 backdrop-blur-md placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 hover:from-yellow-300 hover:to-orange-400 text-neutral-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 active:scale-[0.99] disabled:opacity-50 transition cursor-pointer"
          >
            {isProcessing ? "Connecting to Stripe..." : `Send Cookie • $${totalAmount}.00`}
          </button>
        </form>
      </section>
    </div>
  );
}