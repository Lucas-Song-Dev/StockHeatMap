// Constants
const API_KEY = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY || 'demo';
const BASE_URL = 'http://localhost:5000/api/stocks';
import { StockData, SectorData, GlobalQuote, CompanyOverview , StockResponse} from "../types";

/**
 * Get a real-time quote for a specific stock
 */
export async function getStockData(symbol: string): Promise<StockData | null> {
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
      ticker: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      change_percent: parseFloat(quote['10. change percent'].replace('%', '')),
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
): Promise<SectorData[]> => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (symbols) params.append('symbols', symbols);
    if (sector) params.append('sector', sector);
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    const url = `http://localhost:5000/api/stocks-by-sector${queryString ? `?${queryString}` : ''}`;
    
    console.log("🚀 ~ url:", url)
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: StockResponse = await response.json();
    console.log("🚀 ~ data:", data.sectors)
    return data.sectors || [];
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

/**
 * Batch fetch real-time quotes for multiple stocks
 */
export async function getBatchStockDatas(symbols: string[]): Promise<StockData[]> {
  // Alpha Vantage doesn't provide a true batch endpoint, so we need to make individual requests
  // This is okay for the free tier which allows 25-500 requests per day
  try {
    const promises = symbols.map(symbol => getStockData(symbol));
    const results = await Promise.allSettled(promises);

    return results
      .filter((result): result is PromiseFulfilledResult<StockData | null> =>
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value as StockData);

  } catch (error) {
    console.error('Error fetching batch stock quotes:', error);
    return [];
  }
}

/**
 * Get the top gainers and losers for the day
 * Note: This is not a real Alpha Vantage endpoint, we'll simulate it with our data
 */
export async function getTopMovers(count: number = 20): Promise<{ gainers: StockData[], losers: StockData[] }> {
  // For a real implementation, you'd need to:
  // 1. Fetch quotes for multiple stocks
  // 2. Sort them by change percentage
  // 3. Return the top and bottom N

  // Simulating with our existing data since Alpha Vantage doesn't have a top movers endpoint
  const majorStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 'JNJ', 'V', 'PG'];

  try {
    const quotes = await getBatchStockDatas(majorStocks);

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
