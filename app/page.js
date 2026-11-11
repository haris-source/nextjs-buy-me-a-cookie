import React from "react";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-87.5 bg-amber-500/10 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-3/4 right-10 w-100 h-75 bg-orange-600/10 blur-[130px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-6 pt-24 pb-20 px-6 text-center max-w-4xl mx-auto">

        {/* Subtle Pill Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs font-semibold backdrop-blur-md">
          <span className="inline-block animate-pulse text-amber-400">●</span>
          <span>The Next-Gen Crowdfunding Platform for Devs</span>
        </div>

        {/* Title */}
        <h1 className="font-extrabold text-4xl sm:text-6xl tracking-tight text-white flex items-center justify-center gap-3">
          Buy me a cookie <span className="inline-block animate-bounce">🍪</span>
        </h1>

        {/* Subtitle */}
        <p className="text-neutral-400 text-base sm:text-xl leading-relaxed max-w-2xl">
          Buy a cookie for your favorite developer and support them to make more amazing projects. No complex subscriptions, just direct creator appreciation.
        </p>
        {/* Place Search Bar here */}
        <div className="mt-8 w-full">
          <SearchBar />
        </div>
        {/* Hero Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          {/* Primary Glowing Action Button */}
          <Link href="/dashboard">
            <button
              type="button"
              className="group relative inline-flex items-center justify-center p-0.5 overflow-hidden rounded-full font-semibold text-sm transition-all duration-300 shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 group-hover:from-yellow-300 group-hover:to-orange-400 transition-all duration-300" />
              <span className="relative flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0a0a0f] text-amber-400 font-bold group-hover:bg-transparent group-hover:text-black transition-all duration-300">
                <span>Start buying me a cookie</span>
                <span className="text-base group-hover:translate-x-1 transition-transform duration-200">
                  &rarr;
                </span>
              </span>
            </button>
          </Link>

          {/* Read More Link */}
          <Link href="/about">
            <button
              type="button"
              className="group relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition backdrop-blur-md cursor-pointer px-6 py-3.5"
            >
              <span>Learn how it works</span>
            </button>
          </Link>
        </div>

        {/* Mini Creator Social Proof */}
        <div className="flex items-center gap-3 pt-4 text-xs text-neutral-400">
          <div className="flex -space-x-2 overflow-hidden">
            <img className="inline-block h-7 w-7 rounded-full ring-2 ring-neutral-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="avatar" />
            <img className="inline-block h-7 w-7 rounded-full ring-2 ring-neutral-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="avatar" />
            <img className="inline-block h-7 w-7 rounded-full ring-2 ring-neutral-900 object-cover" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80" alt="avatar" />
          </div>
          <span>Trusted by <strong>1,200+</strong> developers worldwide</span>
        </div>
      </section>

      {/* Live Community Metric Banner */}
      <section className="max-w-5xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl backdrop-blur-xl bg-neutral-900/40 border border-white/10 shadow-2xl text-center">
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-amber-400">45,000+ 🍪</p>
            <p className="text-xs text-neutral-400 font-medium">Cookies Served</p>
          </div>
          <div className="space-y-1 border-l border-white/5">
            <p className="text-2xl sm:text-3xl font-black text-white">$225K+</p>
            <p className="text-xs text-neutral-400 font-medium">Earned by Creators</p>
          </div>
          <div className="space-y-1 border-l border-white/5">
            <p className="text-2xl sm:text-3xl font-black text-white">100%</p>
            <p className="text-xs text-neutral-400 font-medium">Direct Payouts</p>
          </div>
          <div className="space-y-1 border-l border-white/5">
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">0%</p>
            <p className="text-xs text-neutral-400 font-medium">Platform Lock-in</p>
          </div>
        </div>
      </section>

      <div className="bg-neutral-800/80 h-[1px] max-w-5xl mx-auto"></div>

      {/* Feature Cards Section (Preserved Original Items) */}
      <section className="text-white container mx-auto pb-28 pt-20 px-4">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Your Fans can buy you a Cookie
          </h2>
          <p className="text-neutral-400 text-sm">
            Give your audience a friendly way to say thank you for your open-source projects, videos, and tutorials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Item 1 */}
          <div className="rounded-3xl p-8 backdrop-blur-xl bg-neutral-900/40 border border-white/10 hover:border-amber-400/30 transition flex flex-col items-center text-center shadow-xl group">
            <div className="bg-neutral-800/80 border border-white/10 rounded-full p-2 w-24 h-24 flex items-center justify-center overflow-hidden mb-5 group-hover:scale-105 transition-transform duration-300">
              <Image
                className="rounded-full"
                src="/man.gif"
                width={88}
                height={88}
                alt="Fans want to help"
                unoptimized
                priority
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <p className="font-bold text-lg text-white mb-2">Fans want to help</p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Your community loves what you create and is eager to fuel your work with direct contributions.
            </p>
          </div>

          {/* Item 2 */}
          <div className="rounded-3xl p-8 backdrop-blur-xl bg-neutral-900/40 border border-white/10 hover:border-amber-400/30 transition flex flex-col items-center text-center shadow-xl group">
            <div className="bg-neutral-800/80 border border-white/10 rounded-full p-2 w-24 h-24 flex items-center justify-center overflow-hidden mb-5 group-hover:scale-105 transition-transform duration-300">
              <Image
                className="rounded-full"
                src="/arrow.gif"
                width={88}
                height={88}
                alt="Direct Funding"
                unoptimized
                priority
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <p className="font-bold text-lg text-white mb-2">Direct Support</p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Receive tips directly without platform lock-in. Money routes right into your configured bank account.
            </p>
          </div>

          {/* Item 3 */}
          <div className="rounded-3xl p-8 backdrop-blur-xl bg-neutral-900/40 border border-white/10 hover:border-amber-400/30 transition flex flex-col items-center text-center shadow-xl group">
            <div className="bg-neutral-800/80 border border-white/10 rounded-full p-2 w-24 h-24 flex items-center justify-center overflow-hidden mb-5 group-hover:scale-105 transition-transform duration-300">
              <Image
                className="rounded-full"
                src="/group.gif"
                width={88}
                height={88}
                alt="Community support"
                unoptimized
                priority
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <p className="font-bold text-lg text-white mb-2">Grow Together</p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Keep your backers updated on your latest releases, blog posts, and open-source contributions.
            </p>
          </div>
        </div>
      </section>

      {/* 3-Step "How It Works" Section */}
      <section className="container mx-auto px-4 pb-28 max-w-5xl">
        <div className="text-center mb-14 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Effortless Setup</p>
          <h2 className="text-3xl font-extrabold text-white">How Get Me A Cookie Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl backdrop-blur-xl bg-neutral-900/30 border border-white/5 space-y-3">
            <span className="text-3xl font-black text-amber-400">01</span>
            <h3 className="text-lg font-bold text-white">Claim Your Handle</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Sign up in 30 seconds and secure your personal cookie page at <code className="text-amber-400">/yourname</code>.
            </p>
          </div>

          <div className="p-6 rounded-3xl backdrop-blur-xl bg-neutral-900/30 border border-white/5 space-y-3">
            <span className="text-3xl font-black text-amber-400">02</span>
            <h3 className="text-lg font-bold text-white">Connect Razorpay</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Add your payment keys to receive direct deposits without intermediary holding periods.
            </p>
          </div>

          <div className="p-6 rounded-3xl backdrop-blur-xl bg-neutral-900/30 border border-white/5 space-y-3">
            <span className="text-3xl font-black text-amber-400">03</span>
            <h3 className="text-lg font-bold text-white">Share Everywhere</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Embed your cookie button in GitHub READMEs, YouTube descriptions, or your personal portfolio.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-neutral-800/80 h-px max-w-5xl mx-auto"></div>

      {/* Video Demonstration Section (Preserved Original) */}
      <section className="text-white container mx-auto pb-28 pt-20 px-4">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Learn more about this project
          </h2>
          <p className="text-neutral-400 text-sm">
            Watch this video to learn more about the project and how to get involved with the community.
          </p>
        </div>

        <div className="flex justify-center items-center w-full my-8">
          <div className="p-2 sm:p-3 rounded-3xl backdrop-blur-xl bg-neutral-900/40 border border-white/10 shadow-2xl">
            <iframe
              width="680"
              height="380"
              src="https://www.youtube.com/embed/a7c1ERsGUwU?si=nXHkucPYRop34KFY"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="rounded-2xl max-w-full shadow-inner aspect-video"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-5xl mx-auto px-4 pb-28">
        <div className="relative rounded-3xl p-8 sm:p-14 backdrop-blur-xl bg-gradient-to-r from-amber-500/10 via-neutral-900/60 to-orange-500/10 border border-amber-500/20 shadow-2xl text-center space-y-6 overflow-hidden">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to start baking cookies? 🍪
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Create your creator studio profile and start accepting supporter contributions in less than 2 minutes.
            </p>
          </div>

          <Link href="/signup">
            <button
              type="button"
              className="px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              Get Started for Free &rarr;
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}

export const metadata = {
  title: 'Home | Get Me A Cookie',
}