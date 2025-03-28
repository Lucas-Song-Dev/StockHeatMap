"use client";

import Link from 'next/link';
import { useState } from 'react';

const filters = [
  { name: 'S&P 500', path: '?t=sec' },
  { name: 'World', path: '?t=geo' },
  { name: 'Full', path: '?t=sec_all', active: true },
  { name: 'Exchange Traded Funds', path: '?t=etf' },
];

const periodFilters = [
  { name: '1-Day Performance', value: '1d' },
  { name: '1-Week Performance', value: '1w' },
  { name: '1-Month Performance', value: '1m' },
  { name: '3-Month Performance', value: '3m' },
  { name: '6-Month Performance', value: '6m' },
  { name: '1-Year Performance', value: '1y' },
  { name: 'Year to Date', value: 'ytd' },
];

export default function MapFilter() {
  const [activeFilter, setActiveFilter] = useState('Full');
  const [activePeriod, setActivePeriod] = useState('1d');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-4">
      {/* Search box */}
      <div className="bg-[#242632] p-4 rounded">
        <div className="relative">
          <input
            type="text"
            placeholder="Quick search ticker"
            className="w-full bg-[#1e1e1e] border border-[#38394a] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#5147dc]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-[#61697a]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Search results would appear here */}
        {searchQuery && (
          <div className="mt-2 bg-[#1e1e1e] border border-[#38394a] rounded p-2 text-xs">
            <div className="text-[#61697a]">Type at least 2 characters to search</div>
          </div>
        )}
      </div>

      {/* View type */}
      <div className="bg-[#242632] p-4 rounded">
        <div className="mb-2">
          <div className="text-xs uppercase font-bold text-white mb-2">View</div>
          <div className="flex space-x-2 mb-4">
            <div className="text-white text-sm font-bold border-b-2 border-white pb-1">Map</div>
            <div className="text-white/50 text-sm cursor-pointer hover:text-white pb-1">Bubbles</div>
          </div>
          <div className="text-[#61697a] text-xs mb-6">
            All stocks listed on US stock exchanges, categorized by sectors and industries. Size represents market cap.
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs uppercase font-bold text-white mb-2">Map Filter</div>
          <ul className="space-y-1">
            {filters.map((filter) => (
              <li key={filter.name}>
                <Link
                  href={filter.path}
                  className={`block text-sm ${filter.name === activeFilter ? 'text-white' : 'text-[#61697a] hover:text-white'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveFilter(filter.name);
                  }}
                >
                  {filter.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Period filter */}
        <div className="mb-4">
          <div className="text-xs uppercase font-bold text-white mb-2">Period</div>
          <select
            className="w-full bg-[#1e1e1e] border border-[#38394a] text-white px-3 py-2 rounded text-sm appearance-none cursor-pointer"
            value={activePeriod}
            onChange={(e) => setActivePeriod(e.target.value)}
          >
            {periodFilters.map((period) => (
              <option key={period.value} value={period.value}>
                {period.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-[#61697a] text-xs">
          <p className="mb-1">Use mouse wheel to zoom in and out. Drag zoomed map to pan it.</p>
          <p className="mb-1">Double-click a ticker to display detailed information in a new window.</p>
          <p>Hover mouse cursor over a ticker to see its main competitors in a stacked view with a 3-month history graph.</p>
        </div>
      </div>

      {/* Elite banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-3 rounded text-center">
        <div className="text-white text-xs mb-2">
          <p className="font-bold">Beat the market</p>
          <p>with Real-time Stock Quotes</p>
        </div>
        <button className="bg-yellow-400 text-black text-xs font-bold py-1 px-3 rounded">
          SUBSCRIBE
        </button>
      </div>
    </div>
  );
}
