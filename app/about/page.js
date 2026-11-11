"use client";
import React, { useEffect ,useState } from "react";


const About = () => {  
   useEffect(() => {
    document.title = "About | Get Me A Cookie";
  }, []);

  const [openIndex, setOpenIndex] = useState(0); // first item open by default (or null for all closed)

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            About <span className="text-yellow-400">Get Me A Cookie</span> 🍪
          </h1>
          <p className="text-gray-400 text-base max-w-2xl mx-auto">
            Everything you need to know about how the platform works, funding creators, and getting started.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="rounded-xl border border-gray-800 bg-gray-800/40 backdrop-blur-sm overflow-hidden shadow-xl divide-y divide-gray-800">
          {/* Item 1 */}
          <div>
            <h2>
              <button
                type="button"
                onClick={() => toggleAccordion(0)}
                aria-expanded={openIndex === 0}
                className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-200 hover:text-yellow-400 hover:bg-gray-800/60 transition gap-3 cursor-pointer"
              >
                <span className="text-base sm:text-lg">What is Get Me A Cookie?</span>
                <svg
                  className={`w-5 h-5 shrink-0 text-yellow-400 transition-transform duration-200 ${
                    openIndex === 0 ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 9-7 7-7-7"
                  />
                </svg>
              </button>
            </h2>
            {openIndex === 0 && (
              <div className="p-5 text-gray-300 bg-gray-900/40 border-t border-gray-800 text-sm sm:text-base leading-relaxed space-y-2">
                <p>
                  Get Me A Cookie is a creator-support platform designed to help makers, developers, and artists receive direct support and tips from their fans and communities.
                </p>
                <p>
                  Instead of complex subscription models, supporters can simply fund their favorite creators by buying them "cookies" with zero hassle.
                </p>
              </div>
            )}
          </div>

          {/* Item 2 */}
          <div>
            <h2>
              <button
                type="button"
                onClick={() => toggleAccordion(1)}
                aria-expanded={openIndex === 1}
                className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-200 hover:text-yellow-400 hover:bg-gray-800/60 transition gap-3 cursor-pointer"
              >
                <span className="text-base sm:text-lg">How do creators get paid?</span>
                <svg
                  className={`w-5 h-5 shrink-0 text-yellow-400 transition-transform duration-200 ${
                    openIndex === 1 ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 9-7 7-7-7"
                  />
                </svg>
              </button>
            </h2>
            {openIndex === 1 && (
              <div className="p-5 text-gray-300 bg-gray-900/40 border-t border-gray-800 text-sm sm:text-base leading-relaxed space-y-2">
                <p>
                  Contributions go directly to the creator's connected payout method. Supporters can pay securely using standard debit/credit cards or supported online payment gateways.
                </p>
                <p>
                  Creators maintain full control over their earnings and can view real-time statistics from their dashboard.
                </p>
              </div>
            )}
          </div>

          {/* Item 3 */}
          <div>
            <h2>
              <button
                type="button"
                onClick={() => toggleAccordion(2)}
                aria-expanded={openIndex === 2}
                className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-200 hover:text-yellow-400 hover:bg-gray-800/60 transition gap-3 cursor-pointer"
              >
                <span className="text-base sm:text-lg">Is there any fee to create an account?</span>
                <svg
                  className={`w-5 h-5 shrink-0 text-yellow-400 transition-transform duration-200 ${
                    openIndex === 2 ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 9-7 7-7-7"
                  />
                </svg>
              </button>
            </h2>
            {openIndex === 2 && (
              <div className="p-5 text-gray-300 bg-gray-900/40 border-t border-gray-800 text-sm sm:text-base leading-relaxed space-y-2">
                <p>
                  Signing up and creating your page is 100% free. We believe in empowering creators first, so there are no monthly platform fees to get started.
                </p>
                <ul className="list-disc ps-5 space-y-1 text-gray-400">
                  <li>Instant profile setup and customized slug</li>
                  <li>Real-time supporter activity log</li>
                  <li>Direct creator payouts</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;

