"use client";

import { useEffect, useState, useRef } from 'react';

type StockData = {
  ticker: string;
  name?: string;
  price?: number;
  change: number;
  marketCap?: number;
  sector: string;
  industry?: string;
  isLarge?: boolean;
};

interface StockDetailsProps {
  stock: StockData | null;
  onClose: () => void;
}

export default function StockDetails({ stock, onClose }: StockDetailsProps) {
  const detailsRef = useRef<HTMLDivElement>(null);
  const [stockInfo, setStockInfo] = useState({
    price: stock?.price || Math.floor(Math.random() * 1000) / 10 + 50,
    dayHigh: Math.floor(Math.random() * 1000) / 10 + 55,
    dayLow: Math.floor(Math.random() * 1000) / 10 + 45,
    volume: Math.floor(Math.random() * 1000000) + 1000000,
    marketCap: Math.floor(Math.random() * 100000) / 100 + 50,
    peRatio: Math.floor(Math.random() * 500) / 10 + 10,
    dividend: Math.floor(Math.random() * 500) / 100,
  });

  // Format percentage with sign
  const formatPercentage = (value: number): string => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  // Format large numbers with commas
  const formatNumber = (value: number): string => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format market cap in billions
  const formatMarketCap = (value: number): string => {
    return `$${value.toFixed(2)}B`;
  };

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!stock) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={detailsRef}
        className="bg-[#242632] rounded-md shadow-xl w-full max-w-2xl p-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white">{stock.ticker}</h2>
            <p className="text-[#61697a]">{stock.sector}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#61697a] hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#2b2d3c] p-3 rounded">
            <div className="flex justify-between mb-2">
              <span className="text-[#61697a]">Price</span>
              <span className="text-white font-bold">${stockInfo.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-[#61697a]">Change</span>
              <span className={`font-bold ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercentage(stock.change)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-[#61697a]">Day High</span>
              <span className="text-white">${stockInfo.dayHigh.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#61697a]">Day Low</span>
              <span className="text-white">${stockInfo.dayLow.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-[#2b2d3c] p-3 rounded">
            <div className="flex justify-between mb-2">
              <span className="text-[#61697a]">Volume</span>
              <span className="text-white">{formatNumber(stockInfo.volume)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-[#61697a]">Market Cap</span>
              <span className="text-white">{formatMarketCap(stockInfo.marketCap)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-[#61697a]">P/E Ratio</span>
              <span className="text-white">{stockInfo.peRatio.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#61697a]">Dividend</span>
              <span className="text-white">{stockInfo.dividend.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-[#2b2d3c] p-3 rounded">
          <h3 className="text-white font-bold mb-2">Performance Chart</h3>
          <div className="h-40 bg-[#1e1e1e] rounded flex items-center justify-center">
            <p className="text-[#61697a]">Chart Placeholder - Premium Feature</p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button className="bg-[#38394a] hover:bg-[#45465a] text-white py-2 px-4 rounded">
            View More Details
          </button>
        </div>
      </div>
    </div>
  );
}
