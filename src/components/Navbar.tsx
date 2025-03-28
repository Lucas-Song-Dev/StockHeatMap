"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="bg-[#242632] border-b border-[#38394a] py-2 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">finviz</span>
              <span className="text-xs text-[#61697a] ml-1 uppercase tracking-widest">FINANCIAL VISUALIZATIONS</span>
            </div>
          </Link>

          {/* Main Navigation Links */}
          <div className="hidden md:flex space-x-4 text-sm">
            <Link href="/" className="text-white hover:text-gray-300">Home</Link>
            <Link href="#" className="text-white hover:text-gray-300">News</Link>
            <Link href="#" className="text-white hover:text-gray-300">Screener</Link>
            <Link href="#" className="text-white hover:text-gray-300 font-bold">Maps</Link>
            <Link href="#" className="text-white hover:text-gray-300">Groups</Link>
            <Link href="#" className="text-white hover:text-gray-300">Portfolio</Link>
            <Link href="#" className="text-white hover:text-gray-300">Insider</Link>
            <Link href="#" className="text-white hover:text-gray-300">Futures</Link>
            <Link href="#" className="text-white hover:text-gray-300">Forex</Link>
            <Link href="#" className="text-white hover:text-gray-300">Crypto</Link>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-sm">
          <span className="text-[#61697a]">Fri MAR 28 2025 3:41 AM ET</span>
          <button onClick={toggleTheme}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={theme === 'dark'
                  ? "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  : "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"}
              />
            </svg>
          </button>
          <Link href="#" className="text-white hover:text-gray-300">Help</Link>
          <Link href="#" className="text-white hover:text-gray-300">Login</Link>
          <Link href="#" className="text-white hover:text-gray-300">Register</Link>
        </div>
      </div>
    </nav>
  );
}
