"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="bg-[#242632] border-b border-[#38394a] py-2 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">Stk-market</span>
              <span className="text-xs text-[#61697a] ml-1 uppercase tracking-widest"></span>
            </div>
          </Link>

          {/* Main Navigation Links */}
          <div className="hidden md:flex space-x-4 text-sm">
            <Link href="/" className="text-white hover:text-gray-300">
              Home
            </Link>
            <Link href="#" className="text-white hover:text-gray-300">
              News
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-sm">
          <Link href="#" className="text-white hover:text-gray-300">
            Contact
          </Link>
          <Link href="#" className="text-white hover:text-gray-300">
            Login
          </Link>
          <Link href="#" className="text-white hover:text-gray-300">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
