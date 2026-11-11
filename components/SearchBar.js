"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.creators || []);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Search query error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Navigate to first matching creator or user profile on submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim().replace(/^@/, "");
    if (!trimmed) return;

    setIsOpen(false);
    if (results.length > 0) {
      router.push(`/${results[0].username}`);
    } else {
      router.push(`/${trimmed}`);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl mx-auto z-30">
      <form
        onSubmit={handleSearchSubmit}
        className="relative flex items-center bg-neutral-900/80 border border-white/10 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl focus-within:border-amber-400/50 focus-within:ring-2 focus-within:ring-amber-400/20 transition group"
      >
        {/* Leading Search Icon */}
        <div className="ps-3.5 pe-2 text-neutral-400 group-focus-within:text-amber-400 transition pointer-events-none">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>

        {/* Text Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search creators by name or @username..."
          className="w-full bg-transparent text-white text-sm sm:text-base placeholder-neutral-500 focus:outline-none px-2 py-2"
        />

        {/* Clear Button (if query entered) */}
        {query && !loading && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="p-1.5 text-neutral-500 hover:text-white transition rounded-lg mr-1 cursor-pointer"
          >
            ✕
          </button>
        )}

        {/* Loading Spinner or Embedded Search Action Button */}
        {loading ? (
          <div className="px-4 py-2 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-bold text-xs sm:text-sm shadow-md transition whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          >
            <span>Search</span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
            </svg>
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 p-2 bg-neutral-950/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl max-h-80 overflow-y-auto z-50">
          {results.length > 0 ? (
            <div className="space-y-1">
              {results.map((creator) => {
                const avatar = creator.profilePic || creator.image;
                return (
                  <Link
                    key={creator._id || creator.username}
                    href={`/${creator.username}`}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-white/5 transition text-left"
                  >
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={creator.name}
                        className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-neutral-950 font-bold text-xs flex items-center justify-center shrink-0">
                        {creator.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white truncate">
                        {creator.name}
                      </p>
                      <p className="text-xs text-amber-400 truncate">
                        @{creator.username}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-neutral-400">
              No creators found matching "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}