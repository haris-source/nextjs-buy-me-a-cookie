"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { data: session } = useSession();

  const dropdownRef = useRef(null);

  // Reset image error status whenever user updates photo
  useEffect(() => {
    setImgError(false);
  }, [session?.user?.image]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userHandle = session?.user?.email
    ? session.user.email.split("@")[0]
    : "profile";

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : session?.user?.email
    ? session.user.email.charAt(0).toUpperCase()
    : "U";

  const hasValidImage = session?.user?.image && !imgError;

  return (
    <nav className="backdrop-blur-xl bg-slate-950 text-white sticky top-0 z-50 border-b border-white/10 shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold flex items-center gap-2 shrink-0">
          <span className="inline-block animate-bounce">🍪</span>
          <span className="hover:text-amber-400 transition duration-300">
            Get Me A Cookie
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/" className="px-3 py-2 text-sm font-medium hover:text-amber-400 transition">
            Home
          </Link>
          <Link href="/about" className="px-3 py-2 text-sm font-medium hover:text-amber-400 transition">
            About
          </Link>
          <Link href="/contact" className="px-3 py-2 text-sm font-medium hover:text-amber-400 transition">
            Contact
          </Link>
           <Link href="/blogs" className="px-3 py-2 text-sm font-medium hover:text-amber-400 transition">
            Blogs
          </Link>

          {session ? (
            <div className="flex items-center gap-3 ml-2">
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-neutral-800/80 hover:bg-neutral-800 border border-white/10 hover:border-amber-400/40 text-sm font-medium transition cursor-pointer"
                  aria-expanded={isDropdownOpen}
                >
                  {/* Navbar Avatar (Image vs Initial) */}
                  {hasValidImage ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User Avatar"}
                      onError={() => setImgError(true)}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-amber-400/70"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-neutral-950 font-bold text-xs flex items-center justify-center ring-2 ring-amber-400/60 shadow-sm">
                      {userInitial}
                    </div>
                  )}

                  <span className="max-w-[120px] truncate text-neutral-200">
                    {session.user?.name || session.user?.email}
                  </span>

                  <svg
                    className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180 text-amber-400" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 z-20 backdrop-blur-2xl bg-neutral-900/95 border border-white/10 rounded-2xl shadow-2xl w-[min(18rem,calc(100vw-2rem))] overflow-hidden">
                    {/* User Identity Header */}
                    <div className="p-3.5 border-b border-white/5 bg-white/[0.02]">
                      <div className="flex items-center gap-3">
                        {hasValidImage ? (
                          <img
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400 shrink-0"
                            src={session.user.image}
                            alt={session.user.name || "User profile"}
                            onError={() => setImgError(true)}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-neutral-950 font-bold text-sm flex items-center justify-center ring-2 ring-amber-400 shrink-0">
                            {userInitial}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-white truncate text-sm">
                            {session.user?.name || "User"}
                          </p>
                          <p className="truncate text-xs text-neutral-400">
                            {session.user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <ul className="p-2 text-sm text-neutral-300 font-medium space-y-1">
                      <li>
                        <Link
                          href={`/${userHandle}`}
                          onClick={() => setIsDropdownOpen(false)}
                          className="inline-flex items-center justify-between w-full p-2 hover:bg-neutral-800/80 hover:text-amber-400 rounded-xl transition"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="truncate font-semibold text-white">
                              {session.user?.name || "My Page"}
                            </span>
                          </div>
                          <span className="text-[10px] uppercase font-bold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-full">
                            Public
                          </span>
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="inline-flex items-center w-full p-2 hover:bg-neutral-800/80 hover:text-amber-400 rounded-xl transition"
                        >
                          <svg className="w-4 h-4 me-2.5 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                          </svg>
                          Creator Studio
                        </Link>
                      </li>

                      <li className="border-t border-white/10 pt-1 mt-1">
                        <button
                          type="button"
                          onClick={() => signOut({ callbackUrl: "/login" })}
                          className="inline-flex items-center w-full p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition cursor-pointer"
                        >
                          <svg className="w-4 h-4 me-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/signup"
                className="ml-2 px-4 py-2 text-sm font-semibold rounded-xl bg-amber-500 text-neutral-950 hover:bg-amber-400 transition whitespace-nowrap"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-amber-500/60 text-amber-400 hover:bg-amber-500 hover:text-neutral-950 transition whitespace-nowrap"
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-neutral-300 hover:text-white p-2 rounded-xl focus:outline-none"
            aria-label="Toggle navigation"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden backdrop-blur-2xl bg-neutral-900/95 px-4 pt-3 pb-6 space-y-3 border-t border-white/10">
          <Link href="/" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium hover:text-amber-400 transition">
            Home
          </Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium hover:text-amber-400 transition">
            About
          </Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium hover:text-amber-400 transition">
            Contact
          </Link>

          <div className="pt-2 flex flex-col gap-2">
            {session ? (
              <>
                <Link
                  href={`/${userHandle}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-2xl border border-white/10"
                >
                  {hasValidImage ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "Avatar"}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-neutral-950 font-bold flex items-center justify-center ring-2 ring-amber-400 shrink-0">
                      {userInitial}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">
                      {session.user?.name || "User"}
                    </p>
                    <p className="text-xs text-amber-400 truncate">@{userHandle}</p>
                  </div>
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold rounded-xl bg-amber-500 text-neutral-950 transition"
                >
                  Creator Studio
                </Link>

                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full text-center py-2.5 text-sm font-semibold rounded-xl bg-red-600/80 hover:bg-red-600 text-white transition cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full text-center py-2.5 text-sm font-semibold rounded-xl bg-amber-500 text-neutral-950 transition">
                  Sign Up
                </Link>
                <Link href="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-2.5 text-sm font-semibold rounded-xl border border-amber-500 text-amber-400 transition">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;