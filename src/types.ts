
// Define types for our data
export type StockData = {
    ticker: string;
    name?: string;
    price?: number;
    change: number;
    marketCap?: number;
    sector: string;
    industry?: string;
    isLarge?: boolean;
    change_percent: number;
  };
  
export interface StockResponse {
    sectors: SectorData[];
    timestamp: string;
  }
  
  
export type SectorData = {
    name: string;
    stocks: StockData[];
  };
  

export type GlobalQuote = {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };

  


export type CompanyOverview = {
    Symbol: string;
    Name: string;
    Description: string;
    Exchange: string;
    Currency: string;
    Country: string;
    Sector: string;
    Industry: string;
    MarketCapitalization: string;
    PERatio: string;
    DividendYield: string;
    EPS: string;
    // ... other fields
  };
  