import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Payment from "@/models/Payment";
import PaymentBox from "@/components/PaymentBox";

export async function generateMetadata(props) {
  const resolvedParams = await Promise.resolve(props.params);
  const username = resolvedParams?.username;

  await connectDB();
  const cleanUsername = decodeURIComponent(String(username || "")).trim().toLowerCase();

  const dbUser = await User.findOne({
    $or: [
      { username: cleanUsername },
      { email: { $regex: new RegExp(`^${cleanUsername}@`, "i") } },
    ],
  }).lean();

  const displayName = dbUser?.name || cleanUsername;
  return {
    title: `Buy a Cookie for ${displayName} (@${cleanUsername}) | Get Me A Cookie`,
    description: dbUser?.bio || `Support @${cleanUsername}'s creative projects!`,
  };
}

export default async function UserProfilePage(props) {
  const resolvedParams = await Promise.resolve(props.params);
  const rawUsername = resolvedParams?.username;
  const cleanUsername = decodeURIComponent(String(rawUsername || "")).trim().toLowerCase();

  const isValidUsername = /^[a-zA-Z0-9_.-]{2,40}$/.test(cleanUsername);
  if (!isValidUsername) {
    notFound();
  }

  await connectDB();

  const dbUser = await User.findOne({
    $or: [
      { username: cleanUsername },
      { email: { $regex: new RegExp(`^${cleanUsername}@`, "i") } },
    ],
  })
    .select("-password -stripeSecretKey")
    .lean();

  if (!dbUser) {
    notFound();
  }

  const payments = await Payment.find({
    to_username: (dbUser.username || cleanUsername).toLowerCase(),
    status: "completed",
  })
    .sort({ createdAt: -1 })
    .lean();

  const totalCookies = payments.reduce(
    (acc, curr) => acc + (curr.cookieCount || 1),
    0
  );
  const supportersCount = payments.length;

  const user = {
    username: dbUser.username || cleanUsername,
    name: dbUser.name || cleanUsername,
    bio:
      dbUser.bio ||
      "Welcome to my official cookie bakery! Support my work by sending a cookie.",
    coverPic:
      dbUser.coverPic ||
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    avatarPic: dbUser.profilePic || dbUser.image || null,
    supportersCount: supportersCount,
    cookiesReceived: totalCookies,
    recentSupporters: payments.map((p) => ({
      name: p.supporterName || "Anonymous",
      count: p.cookieCount || 1,
      message: p.message || "",
      time: new Date(p.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    })),
  };

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-[calc(100vh-73px)] pb-16">
      {/* Cover Banner */}
      <div className="relative w-full h-56 sm:h-72 lg:h-80 overflow-hidden border-b border-white/10 bg-neutral-900/60">
        {user.coverPic && (
          <img
            src={user.coverPic}
            alt={`${user.name}'s cover`}
            className="w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <div className="relative -mt-20 sm:-mt-24 mb-8 rounded-3xl p-6 sm:p-8 backdrop-blur-xl bg-neutral-900/50 border border-white/10 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl ring-2 ring-white/10 shadow-2xl bg-neutral-800 overflow-hidden shrink-0 flex items-center justify-center">
                {user.avatarPic ? (
                  <img
                    src={user.avatarPic}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-300 text-neutral-950 font-black text-4xl flex items-center justify-center">
                    {userInitial}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center sm:justify-start gap-2">
                  <span>{user.name}</span>
                  <span className="text-amber-400 text-lg">✓</span>
                </h1>
                <p className="text-sm font-medium text-amber-400/90">
                  @{user.username}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-neutral-400 pt-1">
                  <span>
                    <strong className="text-white font-semibold">
                      {user.supportersCount}
                    </strong>{" "}
                    supporters
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-amber-400 font-semibold">
                      {user.cookiesReceived}
                    </strong>{" "}
                    cookies received
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/30 text-xs font-semibold text-neutral-300 hover:text-white transition backdrop-blur-md cursor-pointer"
            >
              Claim your own page →
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 max-w-3xl">
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              {user.bio}
            </p>
          </div>
        </div>

        {/* Support Feed & Payment Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <section className="lg:col-span-7 rounded-3xl p-6 sm:p-7 backdrop-blur-xl bg-neutral-900/40 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Recent Supporters</span>
                <span className="text-xs bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2.5 py-0.5 rounded-full font-semibold">
                  {user.recentSupporters.length}
                </span>
              </h2>
            </div>

            {user.recentSupporters.length === 0 ? (
              <div className="py-12 text-center rounded-2xl bg-neutral-800/20 border border-white/5">
                <span className="text-3xl mb-2 block">🍪</span>
                <p className="text-sm font-semibold text-white">Be the first to support!</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Send a cookie to help kickstart their creative bakery.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {user.recentSupporters.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-neutral-800/30 border border-white/5 hover:border-white/10 hover:bg-neutral-800/50 transition flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-white">
                        {item.name}
                      </span>
                      <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                        bought {item.count} cookie{item.count > 1 ? "s" : ""} 🍪
                      </span>
                    </div>
                    {item.message && (
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic">
                        "{item.message}"
                      </p>
                    )}
                    <span className="text-[11px] text-neutral-500 text-right mt-0.5">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="lg:col-span-5 sticky top-24">
            <PaymentBox username={user.username} recipientName={user.name} />
          </div>
        </div>
      </div>
    </div>
  );
}

