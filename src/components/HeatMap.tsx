"use client";

import { useEffect, useState } from "react";
import StockDetails from "./StockDetails";
import { fetchStockData } from "../services/stockService";
import { StockData, SectorData } from "../types";
import { sampleData } from "@/sample/sampleData";
import Toggle from "./ToggleButton";

// Helper function to get color class based on percentage change
const getColorClass = (change: number): string => {
  if (change <= -3) return "change-negative-3";
  if (change <= -1) return "change-negative-2";
  if (change < 0) return "change-negative-1";
  if (change === 0) return "change-neutral";
  if (change < 1) return "change-positive-1";
  if (change < 3) return "change-positive-2";
  return "change-positive-3";
};

export default function HeatMap() {
  const [heatmapData, setHeatmapData] = useState<SectorData[]>(sampleData);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [hoveringStock, setHoveringStock] = useState<StockData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [useSectorRelative, setUseSectorRelative] = useState(false);
  const [maxSectorMarketCap, setMaxSectorMarketCap] = useState<
    Record<string, number>
  >({});

  const handleToggleSize = () => {
    setUseSectorRelative((prev) => !prev);
  };
  // Format percentage with sign
  const formatPercentage = (value: number): string => {
    const sign = value > 0 ? "+" : "";
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

  useEffect(() => {
    // Function to load data
    const loadStockData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call the API service function
        const data = await fetchStockData();
        setHeatmapData(data);

        const sectorMaxCaps: Record<string, number> = {};
        data.forEach((sector) => {
          console.log("🚀 ~ data.forEach ~ sector:", sector);
          sectorMaxCaps[sector.name] = sector.stocks[0].marketCap || 1;
        });
        setMaxSectorMarketCap(sectorMaxCaps);
      } catch (err) {
        setError("Failed to load stock data. Please try again later.");
        console.error("Error loading stock data:", err);
      } finally {
        setLoading(false);
      }
    };
    // Load data on component mount
    loadStockData();

    // Optional: Set up a refresh interval
    const refreshInterval = setInterval(loadStockData, 300000); // Refresh every 5 minutes

    // Clean up the interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);
  // Function to handle manual refresh
  const handleRefresh = async () => {
    try {
      setLoading(true);
      const data = await fetchStockData();
      setHeatmapData(data);
      setError(null);
    } catch (err) {
      setError("Failed to refresh stock data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  // Render loading state
  if (loading && heatmapData.length === 0) {
    return (
      <div className="heatmap-container">
        <div className="loading-spinner">
          <p>Loading stock data...</p>
        </div>
      </div>
    );
  }
  // Render error state
  if (error && heatmapData.length === 0) {
    return (
      <div className="heatmap-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleRefresh}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="heatmap-container">
      <div className="flex justify-left mb-4 mt-2 gap-2">
        <Toggle
          isToggledOn={useSectorRelative}
          onToggle={handleToggleSize}
          labelOn="Click to compare to absolute"
          labelOff="Click to compare to sector"
        />
        <div className="flex-grow"></div>
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
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-1">
        {heatmapData.map((sector, sectorIndex) => {
          // Group stocks by subsector
          const subsectors: Record<string, StockData[]> = {};
          sector.stocks.forEach((stock) => {
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
              {Object.entries(subsectors).map(
                ([subsectorName, stocks], subIndex) => (
                  <div key={subIndex} className="mb-1">
                    {/* <div className="heatmap-header mb-1 text-[10px]">
                      {subsectorName}
                    </div> */}

                    {/* Stocks Grid */}
                    <div className="flex flex-wrap">
                      {stocks.map((stock, stockIndex) => {
                        const maxCap = maxSectorMarketCap[subsectorName] || 1;
                        const relativeSize = useSectorRelative
                          ? ((stock.marketCap || 10) / maxCap) * 100 + 50
                          : Math.sqrt(stock.marketCap || 100000) / 5000;
                        return (
                          <div
                            key={stockIndex}
                            className={`stock-cell ${getColorClass(
                              stock.change
                            )}`}
                            style={{
                              width: `${relativeSize}px`,
                              height: `${relativeSize}px`,
                            }}
                            onClick={() => handleStockClick(stock)}
                            onMouseEnter={() => handleMouseEnter(stock)}
                            onMouseLeave={handleMouseLeave}
                          >
                            <div className="stock-ticker">{stock.ticker}</div>
                            <div className="stock-change">
                              {stock.change.toFixed(2)}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
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
