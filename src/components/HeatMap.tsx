"use client";

import { useEffect, useState } from 'react';
import StockDetails from './StockDetails';

// Define types for our data
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

type SectorData = {
  name: string;
  stocks: StockData[];
};

// Sample data for the heatmap based on the provided images
const sampleData: SectorData[] = [
  {
    name: "TECHNOLOGY",
    stocks: [
      { ticker: "MSFT", change: 0.16, sector: "SOFTWARE - INFRASTRUCTURE", isLarge: true },
      { ticker: "ORCL", change: -1.37, sector: "SOFTWARE - INFRASTRUCTURE" },
      { ticker: "ADBE", change: -0.42, sector: "SOFTWARE - INFRASTRUCTURE" },
      { ticker: "PLTR", change: -2.37, sector: "SOFTWARE - INFRASTRUCTURE" },
      { ticker: "PANW", change: -5.69, sector: "SOFTWARE - INFRASTRUCTURE" },
      { ticker: "CRWD", change: -1.31, sector: "SOFTWARE - INFRASTRUCTURE" },
      { ticker: "AAPL", change: 1.05, sector: "CONSUMER ELECTRONICS", isLarge: true },
      { ticker: "GOOG", change: -1.83, sector: "INTERNET CONTENT & INFORMATION", isLarge: true },
      { ticker: "META", change: -1.38, sector: "INTERNET CONTENT & INFORMATION", isLarge: true },
      { ticker: "NVDA", change: -2.05, sector: "SEMICONDUCTORS", isLarge: true },
      { ticker: "TSM", change: -3.03, sector: "SEMICONDUCTORS", isLarge: true },
      { ticker: "AVGO", change: -4.06, sector: "SEMICONDUCTORS" },
      { ticker: "AMD", change: -0.21, sector: "SEMICONDUCTORS" },
      { ticker: "TXN", change: -2.02, sector: "SEMICONDUCTORS" },
      { ticker: "CRM", change: -1.13, sector: "SOFTWARE - APPLICATION" },
      { ticker: "NOW", change: -1.29, sector: "SOFTWARE - APPLICATION" },
      { ticker: "SAP", change: 0.00, sector: "SOFTWARE - APPLICATION" },
      { ticker: "INTU", change: 0.07, sector: "SOFTWARE - APPLICATION" },
    ]
  },
  {
    name: "CONSUMER CYCLICAL",
    stocks: [
      { ticker: "AMZN", change: 0.11, sector: "INTERNET RETAIL", isLarge: true },
      { ticker: "TSLA", change: 0.39, sector: "AUTO MANUFACTURERS", isLarge: true },
      { ticker: "TM", change: -2.80, sector: "AUTO MANUFACTURERS" },
    ]
  },
  {
    name: "COMMUNICATION SERVICES",
    stocks: [
      { ticker: "NFLX", change: 0.63, sector: "ENTERTAINMENT" },
      { ticker: "DIS", change: -0.33, sector: "ENTERTAINMENT" },
      { ticker: "T", change: 1.99, sector: "TELECOM SERVICES" },
      { ticker: "VZ", change: 1.77, sector: "TELECOM SERVICES" },
    ]
  },
  {
    name: "HEALTHCARE",
    stocks: [
      { ticker: "JNJ", change: 0.87, sector: "DRUG MANUFACTURERS - GENERAL", isLarge: true },
      { ticker: "LLY", change: -0.62, sector: "DRUG MANUFACTURERS - GENERAL" },
      { ticker: "MRK", change: -0.58, sector: "DRUG MANUFACTURERS - GENERAL" },
      { ticker: "PFE", change: -0.70, sector: "DRUG MANUFACTURERS - GENERAL" },
    ]
  },
  {
    name: "FINANCIAL",
    stocks: [
      { ticker: "JPM", change: -1.16, sector: "BANKS - DIVERSIFIED", isLarge: true },
      { ticker: "BAC", change: -0.61, sector: "BANKS - DIVERSIFIED" },
      { ticker: "WFC", change: -1.62, sector: "BANKS - DIVERSIFIED" },
      { ticker: "C", change: -4.90, sector: "BANKS - DIVERSIFIED" },
      { ticker: "MA", change: 1.55, sector: "CREDIT SERVICES", isLarge: true },
      { ticker: "V", change: 1.65, sector: "CREDIT SERVICES", isLarge: true },
    ]
  },
];

// Helper function to get color class based on percentage change
const getColorClass = (change: number): string => {
  if (change <= -3) return 'change-negative-3';
  if (change <= -1) return 'change-negative-2';
  if (change < 0) return 'change-negative-1';
  if (change === 0) return 'change-neutral';
  if (change < 1) return 'change-positive-1';
  if (change < 3) return 'change-positive-2';
  return 'change-positive-3';
};

export default function HeatMap() {
  const [heatmapData, setHeatmapData] = useState<SectorData[]>(sampleData);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [hoveringStock, setHoveringStock] = useState<StockData | null>(null);

  // Format percentage with sign
  const formatPercentage = (value: number): string => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  // Handle clicking on a stock cell
  const handleStockClick = (stock: StockData) => {
    setSelectedStock(stock);
  };

  // Handle mouse enter
  const handleMouseEnter = (stock: StockData) => {
    setHoveringStock(stock);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveringStock(null);
  };

  // Close stock details modal
  const closeStockDetails = () => {
    setSelectedStock(null);
  };

  return (
    <div className="heatmap-container">
      {/* Map legend */}
      <div className="flex justify-center mb-4 mt-2 gap-2">
        <div className="flex items-center">
          <div className="w-4 h-4 change-negative-3 rounded mr-1"></div>
          <span className="text-xs">-3%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 change-negative-2 rounded mr-1"></div>
          <span className="text-xs">-2%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 change-negative-1 rounded mr-1"></div>
          <span className="text-xs">-1%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 change-neutral rounded mr-1"></div>
          <span className="text-xs">0%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 change-positive-1 rounded mr-1"></div>
          <span className="text-xs">+1%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 change-positive-2 rounded mr-1"></div>
          <span className="text-xs">+2%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 change-positive-3 rounded mr-1"></div>
          <span className="text-xs">+3%</span>
        </div>
      </div>

      {/* Main heatmap grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-1">
        {heatmapData.map((sector, sectorIndex) => {
          // Group stocks by subsector
          const subsectors: Record<string, StockData[]> = {};
          sector.stocks.forEach(stock => {
            if (!subsectors[stock.sector]) {
              subsectors[stock.sector] = [];
            }
            subsectors[stock.sector].push(stock);
          });

          return (
            <div key={sectorIndex} className="mb-4">
              {/* Sector Header */}
              <div className="sector-label">{sector.name}</div>

              {/* Subsectors */}
              {Object.entries(subsectors).map(([subsectorName, stocks], subIndex) => (
                <div key={subIndex} className="mb-1">
                  <div className="heatmap-header mb-1 text-[10px]">{subsectorName}</div>

                  {/* Stocks Grid */}
                  <div className="grid grid-cols-3 gap-[1px]">
                    {stocks.map((stock, stockIndex) => (
                      <div
                        key={stockIndex}
                        className={`
                          stock-cell
                          ${getColorClass(stock.change)}
                          ${stock.isLarge ? 'large-stock-box' : ''}
                        `}
                        onClick={() => handleStockClick(stock)}
                        onMouseEnter={() => handleMouseEnter(stock)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="stock-ticker">{stock.ticker}</div>
                        <div className="stock-change">{formatPercentage(stock.change)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Hovering tooltip */}
      {hoveringStock && !selectedStock && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#38394a] p-2 rounded shadow-lg z-20 pointer-events-none">
          <div className="text-xs text-white">
            <p className="font-bold">{hoveringStock.ticker}</p>
            <p>Sector: {hoveringStock.sector}</p>
            <p>Change: {formatPercentage(hoveringStock.change)}</p>
          </div>
        </div>
      )}

      {/* Stock details modal */}
      {selectedStock && (
        <StockDetails stock={selectedStock} onClose={closeStockDetails} />
      )}
    </div>
  );
}
