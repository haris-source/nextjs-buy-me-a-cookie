import React from "react";


const blogs = () => {
  return (
    <main className="min-h-screen text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            My Blogs
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore the ideas, technologies, and development journey behind
            my projects.
          </p>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Blog 1 */}
          <article className="rounded-xl border border-gray-800 bg-gray-800/40 backdrop-blur-sm p-6 shadow-xl hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-300">
            <span className="text-sm text-amber-400 font-medium">
              Project • Next.js
            </span>

            <h2 className="text-xl font-bold text-white mt-3 mb-3">
              Why I Built Buy Me a Cookie
            </h2>

            <p className="text-gray-300 leading-relaxed">
              Buy Me a Cookie is a creator-support platform inspired by the
              simple idea of letting people support creators through small
              contributions. Instead of building a complicated donation
              system, I wanted to create something simple, friendly, and easy
              to understand.
            </p>

            <p className="text-gray-400 leading-relaxed mt-4">
              The project gave me an opportunity to work with authentication,
              databases, payment processing, protected routes, and a modern
              responsive interface while keeping the user experience simple.
            </p>
          </article>

          {/* Blog 2 */}
          <article className="rounded-xl border border-gray-800 bg-gray-800/40 backdrop-blur-sm p-6 shadow-xl hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-300">
            <span className="text-sm text-amber-400 font-medium">
              Development • Full Stack
            </span>

            <h2 className="text-xl font-bold text-white mt-3 mb-3">
              Building the Creator Support System
            </h2>

            <p className="text-gray-300 leading-relaxed">
              One of the interesting parts of Buy Me a Cookie was connecting
              the frontend with the backend and database. Users can create
              accounts, manage their profiles, and interact with the platform
              through authenticated features.
            </p>

            <p className="text-gray-400 leading-relaxed mt-4">
              I used Next.js for the application, MongoDB for data storage,
              authentication for secure user access, and API routes to connect
              different parts of the application. This helped me understand
              how a real full-stack application works beyond just building UI.
            </p>
          </article>

          {/* Blog 3 */}
          <article className="rounded-xl border border-gray-800 bg-gray-800/40 backdrop-blur-sm p-6 shadow-xl hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-300">
            <span className="text-sm text-amber-400 font-medium">
              Payments • Learning
            </span>

            <h2 className="text-xl font-bold text-white mt-3 mb-3">
              What Buy Me a Cookie Taught Me
            </h2>

            <p className="text-gray-300 leading-relaxed">
              This project was more than another portfolio application. It
              helped me understand how different systems work together in a
              production-style application. Authentication, user data,
              payments, validation, and frontend state all have to communicate
              correctly.
            </p>

            <p className="text-gray-400 leading-relaxed mt-4">
              The biggest lesson was that building a full-stack product is not
              only about writing code. It is also about designing a smooth
              experience, handling errors properly, protecting user data, and
              making every part of the application work together reliably.
            </p>
          </article>

        </div>
      </div>
    </main>
  );
};

export default blogs;

export const metadata = {
  title: 'My Blogs | Get Me A Cookie',
}