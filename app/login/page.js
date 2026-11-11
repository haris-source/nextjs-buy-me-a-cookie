"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
    useEffect(() => {
      document.title = "Login | Get Me A Cookie";
    }, []);
  
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
        callbackUrl: "/dashboard",
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else if (res?.ok) {
        router.push(res.url || "/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error("Login submission error:", err);
      setError("An unexpected network error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="md:min-h-[calc(100vh-73px)] flex items-center justify-center py-6 px-4 md:px-8">
      {/* Dark Glassmorphism Card Container */}
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden backdrop-blur-xl bg-neutral-900/40 border border-white/10 shadow-2xl">
        <div className="grid items-stretch w-full gap-0 md:grid-cols-2">

          {/* Left Hero Image */}
          <div className="md:aspect-8/10 bg-gray-50 relative before:absolute before:inset-0 before:bg-black/40 overflow-hidden w-full h-full min-h-105">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
              className="w-full h-full object-cover"
              alt="Developer coding setup"
            />
            <div className="absolute inset-0 flex items-end justify-center">
              <div className="w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent absolute bottom-0 p-8 max-md:hidden">
                <h2 className="text-white text-2xl font-bold">Welcome Back</h2>
                <p className="text-slate-200 text-sm font-medium mt-3 leading-relaxed">
                  Join our private network to discover job opportunities and connect with professionals.
                </p>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="py-8 px-6 lg:px-10 max-md:-order-1 flex items-center">
            <div className="max-w-md mx-auto w-full">
              <h1 className="text-white text-3xl font-bold mb-8">
                Log in
              </h1>

              {error && (
                <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleLogin}>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 text-slate-200 font-medium text-sm inline-block"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                    className="px-3.5 py-2.5 text-sm text-white rounded-xl bg-neutral-800/40 w-full border border-white/10 backdrop-blur-md placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 text-slate-200 font-medium text-sm inline-block"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="px-3.5 py-2.5 pr-10 text-sm text-white rounded-xl bg-neutral-800/40 w-full border border-white/10 backdrop-blur-md placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      aria-label="Toggle password visibility"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-5 fill-current" viewBox="0 0 128 128">
                        <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" />
                        {!show && (
                          <path id="eyeStrike" d="M10.586 10.586l106.828 106.828" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center cursor-pointer select-none">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className="w-4 h-4 rounded border-white/20 bg-neutral-800 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2.5 text-sm text-slate-300">
                      Remember me
                    </span>
                  </label>

                  <a href="#" className="text-sm font-medium text-blue-400 hover:underline">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 text-sm rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-600/20 active:scale-[0.99] transition duration-150 cursor-pointer"
                >
                  {loading ? "Logging in..." : "Log in"}
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <hr className="w-full border-white/10" />
                <p className="text-xs uppercase tracking-wider text-slate-400">or</p>
                <hr className="w-full border-white/10" />
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  aria-label="Sign in with Google"
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  className="flex items-center justify-center py-2.5 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md shadow-sm transition cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 512 512">
                    <path fill="#fbbd00" d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z" />
                    <path fill="#0f9d58" d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z" />
                    <path fill="#31aa52" d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z" />
                    <path fill="#3c79e6" d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z" />
                    <path fill="#cf2d48" d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z" />
                    <path fill="#eb4132" d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z" />
                  </svg>
                </button>

                <button
                  type="button"
                  aria-label="Sign in with GitHub"
                  onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                  className="flex items-center justify-center py-2.5 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md shadow-sm transition cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5 fill-white" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </button>

                <button
                  type="button"
                  aria-label="Sign in with Facebook"
                  onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
                  className="flex items-center justify-center py-2.5 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md shadow-sm transition cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 text-slate-300 text-sm text-center">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-400 hover:underline font-semibold">
                  Sign up
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;