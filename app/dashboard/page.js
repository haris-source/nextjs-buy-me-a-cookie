"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Dashboard() {
    useEffect(() => {
      document.title = "Dashboard | Get Me A Cookie";
    }, []);
  
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("profile");
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    bio: "",
    profilePic: "",
    coverPic: "",
    stripePublishableKey: "",
    stripeSecretKey: "",
    newPassword: "",
    currentPassword: "",
  });

  const [showSecret, setShowSecret] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ success: false, error: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmUsernameInput, setConfirmUsernameInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      const fetchUserProfile = async () => {
        try {
          const res = await fetch("/api/user/profile");
          if (res.ok) {
            const data = await res.json();
            const avatar = data.profilePic || data.image || session?.user?.image || "";

            setFormData({
              name: data.name || session?.user?.name || "",
              email: data.email || session?.user?.email || "",
              username: data.username || session?.user?.email?.split("@")[0] || "",
              bio: data.bio || "",
              profilePic: avatar,
              coverPic: data.coverPic || "",
              stripePublishableKey: data.stripePublishableKey || "",
              stripeSecretKey: data.stripeSecretKey || "",
              newPassword: "",
              currentPassword: "",
            });
          }
        } catch (err) {
          console.error("Failed to load user profile:", err);
        } finally {
          setLoadingData(false);
        }
      };

      fetchUserProfile();
    }
  }, [status, session, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert("Image must be smaller than 1.5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus({ success: false, error: "" });

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to update profile.");
      }

      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
        },
      });

      // Clear password inputs and show success message
      setFormData((prev) => ({
        ...prev,
        newPassword: "",
        currentPassword: "",
      }));

      setSaveStatus({ success: true, error: "" });
      setTimeout(() => setSaveStatus({ success: false, error: "" }), 3500);
    } catch (err) {
      setSaveStatus({ success: false, error: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirmUsernameInput !== formData.username) return;
    setIsDeleting(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete account.");
      }

      await signOut({ callbackUrl: "/" });
    } catch (err) {
      alert(err.message);
      setIsDeleting(false);
      setShowDeleteModal(false);
      setConfirmUsernameInput("");
    }
  };

  if (status === "loading" || loadingData) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center text-white">
        <span className="text-4xl animate-bounce mb-3">🍪</span>
        <p className="text-sm font-medium text-neutral-400">Loading creator studio...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-[calc(100vh-73px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-xl bg-neutral-900/40 border border-white/10 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              Creator Studio <span className="text-xl">✨</span>
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">
              Fine-tune your public profile, monitor support, and control payment keys.
            </p>
          </div>

          <Link
            href={`/${formData.username || "profile"}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 text-amber-400 text-sm font-semibold transition backdrop-blur-md"
          >
            <span>View Public Page</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl backdrop-blur-xl bg-neutral-900/40 border border-white/10 shadow-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Total Cookies</p>
            <p className="text-2xl font-black text-amber-400 mt-1">128 🍪</p>
          </div>
          <div className="p-5 rounded-3xl backdrop-blur-xl bg-neutral-900/40 border border-white/10 shadow-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Total Raised</p>
            <p className="text-2xl font-black text-white mt-1">$640.00</p>
          </div>
          <div className="p-5 rounded-3xl backdrop-blur-xl bg-neutral-900/40 border border-white/10 shadow-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Supporters</p>
            <p className="text-2xl font-black text-white mt-1">42</p>
          </div>
          <div className="p-5 rounded-3xl backdrop-blur-xl bg-neutral-900/40 border border-white/10 shadow-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Conversion</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">3.5%</p>
          </div>
        </div>

        {saveStatus.error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            {saveStatus.error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 rounded-3xl backdrop-blur-xl bg-neutral-900/40 border border-white/10 shadow-2xl overflow-hidden">
            <div className="flex border-b border-white/10 bg-neutral-900/60 overflow-x-auto">
              {[
                { id: "profile", label: "Profile", icon: "👤" },
                { id: "payouts", label: "Payouts & API", icon: "💳" },
                { id: "security", label: "Security", icon: "🔒" },
                { id: "danger", label: "Danger Zone", icon: "⚠️" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? "border-b-2 border-amber-400 text-amber-400 bg-amber-400/5"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800/40"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-6 sm:p-8">
              {activeTab === "profile" && (
                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-neutral-400 mb-2">
                      Profile Picture
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-neutral-800/30 border border-white/5 backdrop-blur-md">
                      <div className="relative w-20 h-20 rounded-2xl ring-2 ring-white/10 bg-neutral-800 overflow-hidden shrink-0 flex items-center justify-center">
                        {formData.profilePic ? (
                          <img
                            src={formData.profilePic}
                            alt="Avatar preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-neutral-950 font-black text-2xl flex items-center justify-center">
                            {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 text-center sm:text-left space-y-2 w-full">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                          <label className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md cursor-pointer transition">
                            Upload Photo
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>

                          {formData.profilePic && (
                            <button
                              type="button"
                              onClick={() => setFormData((prev) => ({ ...prev, profilePic: "" }))}
                              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 border border-white/10 text-xs font-semibold transition cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500">
                          Supports PNG, JPG, or GIF up to 1.5MB. Stored directly in MongoDB.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1.5">
                        Display Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-sm text-white rounded-xl bg-neutral-800/40 border border-white/10 backdrop-blur-md placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1.5">
                        Handle (Username)
                      </label>
                      <div className="flex rounded-xl bg-neutral-800/40 border border-white/10 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500/40 transition">
                        <span className="inline-flex items-center px-3 text-xs text-neutral-400 border-r border-white/10">@</span>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full bg-transparent px-3 py-2.5 text-sm text-white focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1.5">
                      Bio / Tagline
                    </label>
                    <textarea
                      rows={2}
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm text-white rounded-xl bg-neutral-800/40 border border-white/10 backdrop-blur-md placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1.5">
                      Cover Banner URL
                    </label>
                    <input
                      type="url"
                      name="coverPic"
                      placeholder="https://example.com/cover.jpg"
                      value={formData.coverPic}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm text-white rounded-xl bg-neutral-800/40 border border-white/10 backdrop-blur-md placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-[0.99] transition cursor-pointer"
                    >
                      {isSaving ? "Saving to Database..." : "Save Profile"}
                    </button>
                    {saveStatus.success && (
                      <span className="text-xs font-semibold text-emerald-400">
                        ✓ Saved to MongoDB successfully!
                      </span>
                    )}
                  </div>
                </form>
              )}

              {activeTab === "payouts" && (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed">
                    Enter your Stripe Test credentials. Supporters' tips will be routed through your Stripe Sandbox.
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1.5">
                      Stripe Publishable Key
                    </label>
                    <input
                      type="text"
                      name="stripePublishableKey"
                      placeholder="pk_test_..."
                      value={formData.stripePublishableKey}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm text-white rounded-xl bg-neutral-800/40 border border-white/10 backdrop-blur-md placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-semibold uppercase text-neutral-400">
                        Stripe Secret Key
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="text-xs text-amber-400 hover:underline cursor-pointer"
                      >
                        {showSecret ? "Hide" : "Reveal"}
                      </button>
                    </div>
                    <input
                      type={showSecret ? "text" : "password"}
                      name="stripeSecretKey"
                      placeholder="sk_test_..."
                      value={formData.stripeSecretKey}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm text-white rounded-xl bg-neutral-800/40 border border-white/10 backdrop-blur-md placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer"
                    >
                      {isSaving ? "Updating Keys..." : "Update Keys"}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "security" && (
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1.5">
                      Account Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-3.5 py-2.5 text-sm text-neutral-500 rounded-xl bg-neutral-800/20 border border-white/5 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1.5">
                      New Password (Optional)
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="Minimum 8 characters"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm text-white rounded-xl bg-neutral-800/40 border border-white/10 backdrop-blur-md placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1.5">
                      Previous Password (Required to change)
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      placeholder="Minimum 8 characters"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm text-white rounded-xl bg-neutral-800/40 border border-white/10 backdrop-blur-md placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-50 border border-white/10 text-white font-semibold text-sm transition cursor-pointer"
                    >
                      {isSaving ? "Saving..." : "Save Security Preferences"}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "danger" && (
                <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5 space-y-3">
                  <h3 className="text-sm font-bold text-red-400">Delete Creator Account</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Permanently deletes your public cookie profile, balance ledger, and webhook credentials.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-md shadow-red-600/20 cursor-pointer"
                  >
                    Delete Account
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 rounded-3xl p-6 backdrop-blur-xl bg-neutral-900/40 border border-white/10 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Recent Activity</h2>
              <span className="text-[11px] bg-amber-400/10 text-amber-400 font-semibold px-2 py-0.5 rounded-full border border-amber-400/20">
                Live
              </span>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {[
                { name: "Ali Raza", count: 3, msg: "Keep building awesome tools!", time: "2h ago" },
                { name: "Anonymous", count: 1, msg: "Enjoy the cookie!", time: "5h ago" },
                { name: "Sara Khan", count: 5, msg: "Loved the UI design session.", time: "1d ago" },
              ].map((donor, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-neutral-800/30 border border-white/5 flex flex-col gap-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white truncate">{donor.name}</span>
                    <span className="font-bold text-amber-400">{donor.count} 🍪</span>
                  </div>
                  <p className="text-xs text-neutral-400 italic">"{donor.msg}"</p>
                  <span className="text-[10px] text-neutral-500 text-right">{donor.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="rounded-3xl p-6 max-w-md w-full backdrop-blur-xl bg-neutral-900/90 border border-white/10 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
              <span>⚠️</span> Delete Account
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              This action is permanent. Type your username <strong className="text-amber-400 font-mono">{formData.username}</strong> to verify.
            </p>
            <input
              type="text"
              placeholder={formData.username}
              value={confirmUsernameInput}
              onChange={(e) => setConfirmUsernameInput(e.target.value)}
              className="w-full px-3.5 py-2 text-sm text-white rounded-xl bg-neutral-800/40 border border-white/10 font-mono focus:outline-none focus:ring-2 focus:ring-red-500/40"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmUsernameInput("");
                }}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-300 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmUsernameInput !== formData.username || isDeleting}
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white transition cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}