// Constants
const API_KEY = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY || 'demo';
const BASE_URL = 'http://localhost:5000/api/stocks';

// Types
export type StockQuote = {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  timestamp: string;
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

interface StockResponse {
  items: StockQuote[];
  timestamp: string;
}

/**
 * Get a real-time quote for a specific stock
 */
export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data['Error Message'] || !data['Global Quote']) {
      console.error('API error:', data);
      return null;
    }

    const quote = data['Global Quote'] as GlobalQuote;

    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      change_percent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      timestamp: quote['07. latest trading day'],
    };

  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return null;
  }
}

/**
 * Get company details including sector and industry
 */
export async function getCompanyOverview(symbol: string): Promise<CompanyOverview | null> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data['Error Message'] || !data['Symbol']) {
      console.error('API error:', data);
      return null;
    }

    return data as CompanyOverview;

  } catch (error) {
    console.error('Error fetching company overview:', error);
    return null;
  }
}

/**
 * Fetches stock data from the backend API
 * @param symbols Optional comma-separated list of stock symbols
 * @param sector Optional sector filter
 * @param limit Optional limit on number of stocks (default: 30)
 * @returns Promise with stock data for heatmap visualization
 */
export const fetchStockData = async (
  symbols?: string,
  sector?: string,
  limit?: number
): Promise<StockQuote[]> => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (symbols) params.append('symbols', symbols);
    if (sector) params.append('sector', sector);
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    const url = `http://localhost:5000/api/stocks${queryString ? `?${queryString}` : ''}`;
    
    console.log("🚀 ~ `http://localhost:5000/api/stocks${queryString ? `?${queryString}` : ''}`:", `http://localhost:5000/api/stocks${queryString ? `?${queryString}` : ''}`)
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: StockResponse = await response.json();
    console.log("🚀 ~ data:", data.items)
    return data.items || [];
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

/**
 * Batch fetch real-time quotes for multiple stocks
 */
export async function getBatchStockQuotes(symbols: string[]): Promise<StockQuote[]> {
  // Alpha Vantage doesn't provide a true batch endpoint, so we need to make individual requests
  // This is okay for the free tier which allows 25-500 requests per day
  try {
    const promises = symbols.map(symbol => getStockQuote(symbol));
    const results = await Promise.allSettled(promises);

    return results
      .filter((result): result is PromiseFulfilledResult<StockQuote | null> =>
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value as StockQuote);

  } catch (error) {
    console.error('Error fetching batch stock quotes:', error);
    return [];
  }
}

/**
 * Get the top gainers and losers for the day
 * Note: This is not a real Alpha Vantage endpoint, we'll simulate it with our data
 */
export async function getTopMovers(count: number = 20): Promise<{ gainers: StockQuote[], losers: StockQuote[] }> {
  // For a real implementation, you'd need to:
  // 1. Fetch quotes for multiple stocks
  // 2. Sort them by change percentage
  // 3. Return the top and bottom N

  // Simulating with our existing data since Alpha Vantage doesn't have a top movers endpoint
  const majorStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 'JNJ', 'V', 'PG'];

  try {
    const quotes = await getBatchStockQuotes(majorStocks);

    // Sort by change percentage
    const sortedQuotes = [...quotes].sort((a, b) => b.change_percent - a.change_percent);

    // Get top gainers and losers
    const gainers = sortedQuotes.filter(q => q.change_percent > 0).slice(0, count);
    const losers = sortedQuotes.filter(q => q.change_percent < 0)
      .sort((a, b) => a.change_percent - b.change_percent)
      .slice(0, count);

    return { gainers, losers };

  } catch (error) {
    console.error('Error fetching top movers:', error);
    return { gainers: [], losers: [] };
  }
}
