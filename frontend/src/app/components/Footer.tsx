import React from "react";

type Props = {};

function Footer({}: Props) {
  return (
    <footer className="bg-gray-50 py-4 px-6 pt-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        {/* Left Text */}
        <p className="text-sm text-gray-600 text-center sm:text-left">
          Copyright © 2025{" "}
          <a
            href="https://futurenodes.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-medium hover:underline"
          >
            Future Nodes
          </a>{" "}
          all rights reserved.
        </p>

        {/* Payment Icons */}
        <div className="flex gap-2 mt-3 sm:mt-0">
          <img
            src="https://berry.reactbd.com/_next/static/media/payment.4409afc0.png"
            alt="Visa"
            className="h-6 w-auto"
          />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
