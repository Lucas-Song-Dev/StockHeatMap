"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a1b20] text-[#61697a] text-xs py-6 px-4 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center space-x-3 mb-3">
          <Link href="#" className="hover:text-white">
            affiliate
          </Link>
          <span>|</span>
          <Link href="#" className="hover:text-white">
            advertise
          </Link>
          <span>|</span>
          <Link href="#" className="hover:text-white">
            toggle light mode
          </Link>
          <span>|</span>
          <Link href="#" className="hover:text-white">
            contact
          </Link>
          <span>|</span>
          <span>|</span>
          <Link href="#" className="hover:text-white">
            privacy
          </Link>
          <span>|</span>
          <Link href="#" className="hover:text-white">
            do not sell my data
          </Link>
        </div>

        <div className="text-center">
          <p>Quotes delayed 15 minutes for NASDAQ, NYSE and AMEX.</p>
          <p>Copyright © 2007-2025 Stk-market.com. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
