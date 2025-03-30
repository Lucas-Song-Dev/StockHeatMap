"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  StockData,
  getBatchStockDatas,
  getCompanyOverview,
} from "@/services/stockService";

// Define the stock data structure we'll use in the heatmap
export type HeatmapStockData = {
  ticker: string;
  name?: string;
  price?: number;
  change: number;
  change_percent: number;
  marketCap?: number;
  sector: string;
  industry?: string;
  isLarge?: boolean;
  volume?: number;
};

export type HeatmapSectorData = {
  name: string;
  stocks: HeatmapStockData[];
};

// Types for our context
type StockContextProps = {
  stockData: HeatmapSectorData[];
  loading: boolean;
  lastUpdated: Date | null;
  error: string | null;
  refreshData: () => Promise<void>;
};

// Initial context value
const initialContextValue: StockContextProps = {
  stockData: [],
  loading: true,
  lastUpdated: null,
  error: null,
  refreshData: async () => {},
};

// Create the context
const StockContext = createContext<StockContextProps>(initialContextValue);

// Sample tickers organized by sector to fetch
const sectorTickers = [
  {
    sector: "TECHNOLOGY",
    tickers: [
      "MSFT",
      "AAPL",
      "GOOGL",
      "META",
      "NVDA",
      "ORCL",
      "ADBE",
      "CRM",
      "INTC",
      "AMD",
    ],
  },
  {
    sector: "CONSUMER CYCLICAL",
    tickers: ["AMZN", "TSLA", "BABA", "HD", "MCD", "NKE", "SBUX"],
  },
  {
    sector: "COMMUNICATION SERVICES",
    tickers: ["NFLX", "DIS", "CMCSA", "T", "VZ"],
  },
  {
    sector: "HEALTHCARE",
    tickers: ["JNJ", "PFE", "UNH", "MRK", "ABT", "LLY"],
  },
  {
    sector: "FINANCIAL",
    tickers: ["JPM", "BAC", "MA", "V", "WFC", "C", "GS"],
  },
];

// Major company tickers that should have larger boxes
const majorTickers = [
  "MSFT",
  "AAPL",
  "GOOGL",
  "META",
  "NVDA",
  "AMZN",
  "TSLA",
  "JPM",
  "JNJ",
  "V",
];

type StockProviderProps = {
  children: ReactNode;
};

export function StockProvider({ children }: StockProviderProps) {
  const [stockData, setStockData] = useState<HeatmapSectorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch real-time data
  const fetchStockData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Collect all tickers to fetch
      const allTickers = sectorTickers.flatMap((sector) => sector.tickers);

      // Fetch quotes for all tickers
      const quotes = await getBatchStockDatas(allTickers);

      if (quotes.length === 0) {
        throw new Error("Could not fetch stock data.");
      }

      // Create a map of ticker to quote for easy lookup
      const quoteMap = new Map<string, StockData>();
      quotes.forEach((quote) => {
        quoteMap.set(quote.symbol, quote);
      });

      // Additional sector/industry info would come from company overviews
      // For demo purposes, we'll use predefined sector assignments

      // Build sector data
      const newStockData: HeatmapSectorData[] = sectorTickers.map(
        (sectorInfo) => {
          const sectorStocks: HeatmapStockData[] = sectorInfo.tickers
            .filter((ticker) => quoteMap.has(ticker))
            .map((ticker) => {
              const quote = quoteMap.get(ticker)!;

              // Special industry assignments by ticker (in a real app, this would come from the API)
              let industry = "";
              if (ticker === "MSFT" || ticker === "ORCL" || ticker === "ADBE") {
                industry = "SOFTWARE - INFRASTRUCTURE";
              } else if (ticker === "AAPL") {
                industry = "CONSUMER ELECTRONICS";
              } else if (ticker === "GOOGL" || ticker === "META") {
                industry = "INTERNET CONTENT & INFORMATION";
              } else if (
                ticker === "NVDA" ||
                ticker === "AMD" ||
                ticker === "INTC"
              ) {
                industry = "SEMICONDUCTORS";
              } else if (ticker === "CRM" || ticker === "INTU") {
                industry = "SOFTWARE - APPLICATION";
              } else if (ticker === "AMZN") {
                industry = "INTERNET RETAIL";
              } else if (
                ticker === "TSLA" ||
                ticker === "GM" ||
                ticker === "F"
              ) {
                industry = "AUTO MANUFACTURERS";
              } else if (ticker === "NFLX" || ticker === "DIS") {
                industry = "ENTERTAINMENT";
              } else if (ticker === "T" || ticker === "VZ") {
                industry = "TELECOM SERVICES";
              } else if (
                ticker === "JNJ" ||
                ticker === "PFE" ||
                ticker === "MRK" ||
                ticker === "LLY"
              ) {
                industry = "DRUG MANUFACTURERS - GENERAL";
              } else if (
                ticker === "JPM" ||
                ticker === "BAC" ||
                ticker === "WFC" ||
                ticker === "C"
              ) {
                industry = "BANKS - DIVERSIFIED";
              } else if (ticker === "MA" || ticker === "V") {
                industry = "CREDIT SERVICES";
              } else {
                industry = "OTHER";
              }

              return {
                ticker,
                price: quote.price,
                change: quote.change,
                change_percent: quote.change_percent,
                volume: quote.volume,
                sector: sectorInfo.sector,
                industry,
                isLarge: majorTickers.includes(ticker),
              };
            });

          return {
            name: sectorInfo.sector,
            stocks: sectorStocks,
          };
        }
      );

      setStockData(newStockData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching stock data", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchStockData();

    // Set up an interval to refresh data every 5 minutes
    // Note: For free API tier, we need to be careful with rate limits
    const intervalId = setInterval(() => {
      fetchStockData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(intervalId);
  }, []);

  // Context value
  const contextValue: StockContextProps = {
    stockData,
    loading,
    lastUpdated,
    error,
    refreshData: fetchStockData,
  };

  return (
    <StockContext.Provider value={contextValue}>
      {children}
    </StockContext.Provider>
  );
}

// Hook for using the context
export function useStockData() {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error("useStockData must be used within a StockProvider");
  }
  return context;
}
