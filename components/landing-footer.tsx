import Image from "next/image";
import React from "react";

const LandingFooter = () => {
  return (
    <footer className=" rounded-lg shadow-sm  m-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <div className="relative h-8 w-8 mr-4">
              <Image fill alt="Logo" src="/logo.png" />
            </div>
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              CreatiLab
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <a
                href="/terms-and-conditions"
                target="_blank"
                className="hover:underline me-4 md:me-6"
              >
                Terms And Conditions
              </a>
            </li>
            <li>
              <a
                href="/privacy-policy"
                className="hover:underline me-4 md:me-6"
                target="_blank"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/refund-policy"
                target="_blank"
                className="hover:underline me-4 md:me-6"
              >
                Refund Policy
              </a>
            </li>
            <li>
              <a
                href="mailto:mosininamdar18@gmail.com"
                className="hover:underline"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2023{" "}
          <a href="/" className="hover:underline">
            CreatiLab™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default LandingFooter;
