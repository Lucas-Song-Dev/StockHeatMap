"use client";

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1a1b20] text-[#61697a] text-xs py-6 px-4 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center space-x-3 mb-3">
          <Link href="#" className="hover:text-white">affiliate</Link>
          <span>|</span>
          <Link href="#" className="hover:text-white">advertise</Link>
          <span>|</span>
          <Link href="#" className="hover:text-white">toggle light mode</Link>
          <span>|</span>
          <Link href="#" className="hover:text-white">contact</Link>
          <span>|</span>
          <Link href="#" className="hover:text-white">help</Link>
          <span>|</span>
          <Link href="#" className="hover:text-white">privacy</Link>
          <span>|</span>
          <Link href="#" className="hover:text-white">do not sell my data</Link>
        </div>

        <div className="text-center">
          <p>Quotes delayed 15 minutes for NASDAQ, NYSE and AMEX.</p>
          <p>Copyright © 2007-2025 FINVIZ.com. All Rights Reserved.</p>
        </div>

        <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-500 p-4 rounded text-white text-center">
          <h3 className="text-sm font-bold mb-2">Upgrade your FINVIZ experience</h3>
          <p className="text-xs mb-2">Join thousands of traders who make more informed decisions with our premium features. Real-time quotes, advanced visualizations, backtesting, and much more.</p>
          <Link href="#" className="inline-block bg-yellow-400 text-black font-bold px-4 py-1 rounded text-xs mt-2">
            SUBSCRIBE from $24.96/mo
          </Link>
        </div>
      </div>
    </footer>
  );
}
