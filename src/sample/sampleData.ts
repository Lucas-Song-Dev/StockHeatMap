import { StockData, SectorData } from "../types";


export const sampleData: SectorData[] = [
    {
      name: "TECHNOLOGY",
      stocks: [
        {
          ticker: "MSFT",
          change: 0.16,
          change_percent: 0.5,
          sector: "SOFTWARE - INFRASTRUCTURE",
          isLarge: true,
        },
        { ticker: "ORCL", change: -1.37, change_percent: -1.2, sector: "SOFTWARE - INFRASTRUCTURE" },
        { ticker: "ADBE", change: -0.42, change_percent: -0.8, sector: "SOFTWARE - INFRASTRUCTURE" },
        { ticker: "PLTR", change: -2.37, change_percent: -3.4, sector: "SOFTWARE - INFRASTRUCTURE" },
        { ticker: "PANW", change: -5.69, change_percent: -6.7, sector: "SOFTWARE - INFRASTRUCTURE" },
        { ticker: "CRWD", change: -1.31, change_percent: -2.1, sector: "SOFTWARE - INFRASTRUCTURE" },
        {
          ticker: "AAPL",
          change: 1.05,
          change_percent: 0.9,
          sector: "CONSUMER ELECTRONICS",
          isLarge: true,
        },
        {
          ticker: "GOOG",
          change: -1.83,
          change_percent: -1.5,
          sector: "INTERNET CONTENT & INFORMATION",
          isLarge: true,
        },
        {
          ticker: "META",
          change: -1.38,
          change_percent: -1.2,
          sector: "INTERNET CONTENT & INFORMATION",
          isLarge: true,
        },
        {
          ticker: "NVDA",
          change: -2.05,
          change_percent: -2.3,
          sector: "SEMICONDUCTORS",
          isLarge: true,
        },
        { ticker: "TSM", change: -3.03, change_percent: -3.8, sector: "SEMICONDUCTORS", isLarge: true },
        { ticker: "AVGO", change: -4.06, change_percent: -5.2, sector: "SEMICONDUCTORS" },
        { ticker: "AMD", change: -0.21, change_percent: -0.4, sector: "SEMICONDUCTORS" },
        { ticker: "TXN", change: -2.02, change_percent: -2.7, sector: "SEMICONDUCTORS" },
        { ticker: "CRM", change: -1.13, change_percent: -1.5, sector: "SOFTWARE - APPLICATION" },
        { ticker: "NOW", change: -1.29, change_percent: -1.8, sector: "SOFTWARE - APPLICATION" },
        { ticker: "SAP", change: 0.0, change_percent: 0.0, sector: "SOFTWARE - APPLICATION" },
        { ticker: "INTU", change: 0.07, change_percent: 0.1, sector: "SOFTWARE - APPLICATION" },
      ],
    },
    {
      name: "CONSUMER CYCLICAL",
      stocks: [
        {
          ticker: "AMZN",
          change: 0.11,
          change_percent: 0.2,
          sector: "INTERNET RETAIL",
          isLarge: true,
        },
        {
          ticker: "TSLA",
          change: 0.39,
          change_percent: 0.5,
          sector: "AUTO MANUFACTURERS",
          isLarge: true,
        },
        { ticker: "TM", change: -2.8, change_percent: -3.1, sector: "AUTO MANUFACTURERS" },
      ],
    },
    {
      name: "COMMUNICATION SERVICES",
      stocks: [
        { ticker: "NFLX", change: 0.63, change_percent: 0.9, sector: "ENTERTAINMENT" },
        { ticker: "DIS", change: -0.33, change_percent: -0.4, sector: "ENTERTAINMENT" },
        { ticker: "T", change: 1.99, change_percent: 2.1, sector: "TELECOM SERVICES" },
        { ticker: "VZ", change: 1.77, change_percent: 1.8, sector: "TELECOM SERVICES" },
      ],
    },
    {
      name: "HEALTHCARE",
      stocks: [
        {
          ticker: "JNJ",
          change: 0.87,
          change_percent: 0.9,
          sector: "DRUG MANUFACTURERS - GENERAL",
          isLarge: true,
        },
        { ticker: "LLY", change: -0.62, change_percent: -0.8, sector: "DRUG MANUFACTURERS - GENERAL" },
        { ticker: "MRK", change: -0.58, change_percent: -0.7, sector: "DRUG MANUFACTURERS - GENERAL" },
        { ticker: "PFE", change: -0.7, change_percent: -0.9, sector: "DRUG MANUFACTURERS - GENERAL" },
      ],
    },
    {
      name: "FINANCIAL",
      stocks: [
        {
          ticker: "JPM",
          change: -1.16,
          change_percent: -1.5,
          sector: "BANKS - DIVERSIFIED",
          isLarge: true,
        },
        { ticker: "BAC", change: -0.61, change_percent: -0.7, sector: "BANKS - DIVERSIFIED" },
        { ticker: "WFC", change: -1.62, change_percent: -1.9, sector: "BANKS - DIVERSIFIED" },
        { ticker: "C", change: -4.9, change_percent: -5.2, sector: "BANKS - DIVERSIFIED" },
        { ticker: "MA", change: 1.55, change_percent: 1.8, sector: "CREDIT SERVICES", isLarge: true },
        { ticker: "V", change: 1.65, change_percent: 2.0, sector: "CREDIT SERVICES", isLarge: true },
      ],
    },
  ];
  