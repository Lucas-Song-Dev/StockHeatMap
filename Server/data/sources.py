import os
import logging
import time
import requests
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
from utils.cache import get_cached_data, cache_data
from data.processors import process_stock_data, process_historical_data, process_sector_data

# Configure module logger
logger = logging.getLogger(__name__)

# API Keys
ALPHA_VANTAGE_API_KEY = os.environ.get("ALPHA_VANTAGE_API_KEY", "UZU19YTV2XQGQ02V")
FMP_API_KEY = os.environ.get("FMP_API_KEY", "demo")

# Default symbols for initial data load
DEFAULT_SYMBOLS = [
    # Technology
    "AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "NVDA", "INTC", "AMD",
    "CSCO", "IBM", "ORCL", "ADBE", "CRM", "TXN", "AVGO", "QCOM", "PYPL", "NOW",
    "SNOW", "ZS", "PANW", "MDB", "TTD", "DOCU", "CRWD", "PLTR", "SHOP", "SQ",
    "DDOG", "NET", "TWLO", "U", "ROKU", "FSLY",

    # Financials
    "JPM", "BAC", "GS", "MS", "BLK", "C", "WFC", "AXP", "SCHW", "BRK.B",
    "SPGI", "ICE", "VIRT", "FIS", "FISV", "TROW", "RJF", "ALLY",

    # Consumer Goods & Retail
    "WMT", "PG", "KO", "PEP", "COST", "MCD", "NKE", "SBUX", "TGT", "HD", "LOW",
    "DG", "DLTR", "YUM", "TIF", "UL", "KHC", "GIS", "HSY", "CLX", "EL", "MNST",

    # Healthcare & Pharmaceuticals
    "JNJ", "PFE", "MRK", "LLY", "ABBV", "TMO", "ABT", "GILD", "BMY", "REGN",
    "VRTX", "ISRG", "CVS", "HUM", "UNH", "CNC", "CI", "ZBH", "IDXX", "DHR",
    "EW", "SYK", "BSX", "BIIB", "IQV", "TDOC",

    # Industrials & Transportation
    "BA", "LMT", "CAT", "DE", "HON", "GE", "UPS", "FDX", "UNP", "MMM",
    "RTX", "EMR", "ITW", "GD", "CSX", "NSC", "CARR", "OTIS", "WM", "RSG",

    # Energy & Utilities
    "XOM", "CVX", "OXY", "SLB", "DUK", "NEE", "SO", "D", "AEP", "EXC",
    "PXD", "EOG", "MPC", "VLO", "PSX", "HAL", "BKR", "FANG", "ENB", "ET",

    # Communication & Media
    "DIS", "NFLX", "CMCSA", "T", "VZ", "TMUS", "CHTR", "FOX", "FWONA",
    "SPOT", "LYV", "WBD", "EA", "TTWO", "ATVI", "PARA",

    # Payment Processors & FinTech
    "MA", "V", "SQ", "FISV", "FIS", "AFRM", "UPST", "BILL", "ADYEN", "GPN",

    # Real Estate & Miscellaneous
    "SPG", "PLD", "AMT", "CCI", "O", "EQR", "AVB", "VTR", "DRE", "BXP",

    # Automotive & Manufacturing
    "GM", "F", "RIVN", "LCID", "NKLA", "TSLA", "NIO", "XPEV", "LI", "FREY"
]


# Data source functions
def get_alpha_vantage_data(symbols, function="GLOBAL_QUOTE"):
    """Fetch data from Alpha Vantage API"""
    results = []
    
    # Rate limiting: 5 calls per minute for free tier
    for i, symbol in enumerate(symbols):
        if i > 0 and i % 5 == 0:
            logger.debug("Alpha Vantage rate limit reached, pausing for 65 seconds")
            time.sleep(65)
            
        url = f"https://www.alphavantage.co/query?function={function}&symbol={symbol}&apikey={ALPHA_VANTAGE_API_KEY}"
        
        try:
            response = requests.get(url)
            data = response.json()
            
            if "Error Message" in data:
                logger.warning(f"Alpha Vantage error for {symbol}: {data['Error Message']}")
                continue
                
            if "Global Quote" in data:
                quote = data["Global Quote"]
                results.append({
                    "symbol": symbol,
                    "price": float(quote.get("05. price", 0)),
                    "change": float(quote.get("09. change", 0)),
                    "change_percent": float(quote.get("10. change percent", "0%").replace('%', '')),
                    "volume": int(quote.get("06. volume", 0)),
                    "latest_trading_day": quote.get("07. latest trading day", "")
                })
            else:
                logger.warning(f"No data returned from Alpha Vantage for {symbol}")
        except Exception as e:
            logger.error(f"Error fetching Alpha Vantage data for {symbol}: {str(e)}")
    
    return results

def get_yahoo_finance_data(symbols):
    """Fetch data from Yahoo Finance API via yfinance"""
    try:
        # Create a space-separated string of symbols
        symbols_str = " ".join(symbols)
        
        # Use yfinance to get current data for all symbols at once
        data = yf.download(symbols_str, period="1d", group_by="ticker")
        
        results = []
        
        # Define a mapping for default sectors if needed
        default_sectors = {
            # Technology
            "AAPL": {"sector": "TECHNOLOGY", "industry": "CONSUMER ELECTRONICS"},
            "MSFT": {"sector": "TECHNOLOGY", "industry": "SOFTWARE"},
            "GOOGL": {"sector": "TECHNOLOGY", "industry": "INTERNET CONTENT & INFORMATION"},
            "AMZN": {"sector": "CONSUMER CYCLICAL", "industry": "INTERNET RETAIL"},
            "META": {"sector": "TECHNOLOGY", "industry": "INTERNET CONTENT & INFORMATION"},
            "TSLA": {"sector": "CONSUMER CYCLICAL", "industry": "AUTO MANUFACTURERS"},
            "NVDA": {"sector": "TECHNOLOGY", "industry": "SEMICONDUCTORS"},
            "INTC": {"sector": "TECHNOLOGY", "industry": "SEMICONDUCTORS"},
            "AMD": {"sector": "TECHNOLOGY", "industry": "SEMICONDUCTORS"},
            "CSCO": {"sector": "TECHNOLOGY", "industry": "COMMUNICATION EQUIPMENT"},
            "IBM": {"sector": "TECHNOLOGY", "industry": "INFORMATION TECHNOLOGY SERVICES"},
            "ORCL": {"sector": "TECHNOLOGY", "industry": "SOFTWARE"},
            "ADBE": {"sector": "TECHNOLOGY", "industry": "SOFTWARE"},
            "CRM": {"sector": "TECHNOLOGY", "industry": "SOFTWARE"},
            "TXN": {"sector": "TECHNOLOGY", "industry": "SEMICONDUCTORS"},
            "AVGO": {"sector": "TECHNOLOGY", "industry": "SEMICONDUCTORS"},
            "QCOM": {"sector": "TECHNOLOGY", "industry": "SEMICONDUCTORS"},
            "PYPL": {"sector": "FINANCIAL SERVICES", "industry": "CREDIT SERVICES"},
            "NOW": {"sector": "TECHNOLOGY", "industry": "SOFTWARE"},
            "SNOW": {"sector": "TECHNOLOGY", "industry": "DATA INFRASTRUCTURE"},
            "ZS": {"sector": "TECHNOLOGY", "industry": "CYBERSECURITY"},
            "PANW": {"sector": "TECHNOLOGY", "industry": "CYBERSECURITY"},
            "MDB": {"sector": "TECHNOLOGY", "industry": "DATABASE MANAGEMENT"},
            "TTD": {"sector": "TECHNOLOGY", "industry": "DIGITAL ADVERTISING"},
            "DOCU": {"sector": "TECHNOLOGY", "industry": "CLOUD COMPUTING"},
            "CRWD": {"sector": "TECHNOLOGY", "industry": "CYBERSECURITY"},
            "PLTR": {"sector": "TECHNOLOGY", "industry": "BIG DATA"},
            "SHOP": {"sector": "TECHNOLOGY", "industry": "E-COMMERCE"},
            "SQ": {"sector": "TECHNOLOGY", "industry": "FINTECH"},
            "DDOG": {"sector": "TECHNOLOGY", "industry": "CLOUD MONITORING"},
            "NET": {"sector": "TECHNOLOGY", "industry": "CLOUD COMPUTING"},
            "TWLO": {"sector": "TECHNOLOGY", "industry": "COMMUNICATION SERVICES"},
            "U": {"sector": "TECHNOLOGY", "industry": "GAME DEVELOPMENT"},
            "ROKU": {"sector": "TECHNOLOGY", "industry": "STREAMING MEDIA"},
            
            # Financials
            "JPM": {"sector": "FINANCIAL SERVICES", "industry": "BANKS"},
            "BAC": {"sector": "FINANCIAL SERVICES", "industry": "BANKS"},
            "GS": {"sector": "FINANCIAL SERVICES", "industry": "CAPITAL MARKETS"},
            "MS": {"sector": "FINANCIAL SERVICES", "industry": "CAPITAL MARKETS"},
            "BLK": {"sector": "FINANCIAL SERVICES", "industry": "ASSET MANAGEMENT"},
            "C": {"sector": "FINANCIAL SERVICES", "industry": "BANKS"},
            "WFC": {"sector": "FINANCIAL SERVICES", "industry": "BANKS"},
            "AXP": {"sector": "FINANCIAL SERVICES", "industry": "CREDIT SERVICES"},
            "SCHW": {"sector": "FINANCIAL SERVICES", "industry": "BROKERAGE"},
            "BRK.B": {"sector": "FINANCIAL SERVICES", "industry": "DIVERSIFIED FINANCIALS"},
            
            # Consumer Goods & Retail
            "WMT": {"sector": "CONSUMER DEFENSIVE", "industry": "DISCOUNT STORES"},
            "PG": {"sector": "CONSUMER DEFENSIVE", "industry": "HOUSEHOLD PRODUCTS"},
            "KO": {"sector": "CONSUMER DEFENSIVE", "industry": "BEVERAGES"},
            "PEP": {"sector": "CONSUMER DEFENSIVE", "industry": "BEVERAGES"},
            "COST": {"sector": "CONSUMER DEFENSIVE", "industry": "DISCOUNT STORES"},
            "MCD": {"sector": "CONSUMER CYCLICAL", "industry": "RESTAURANTS"},
            "NKE": {"sector": "CONSUMER CYCLICAL", "industry": "FOOTWEAR & ACCESSORIES"},
            "SBUX": {"sector": "CONSUMER CYCLICAL", "industry": "RESTAURANTS"},
            "TGT": {"sector": "CONSUMER DEFENSIVE", "industry": "DEPARTMENT STORES"},
            
            # Healthcare
            "JNJ": {"sector": "HEALTHCARE", "industry": "DRUG MANUFACTURERS"},
            "PFE": {"sector": "HEALTHCARE", "industry": "DRUG MANUFACTURERS"},
            "MRK": {"sector": "HEALTHCARE", "industry": "DRUG MANUFACTURERS"},
            "LLY": {"sector": "HEALTHCARE", "industry": "DRUG MANUFACTURERS"},
            "ABBV": {"sector": "HEALTHCARE", "industry": "DRUG MANUFACTURERS"},
            "TMO": {"sector": "HEALTHCARE", "industry": "DIAGNOSTICS & RESEARCH"},
            "ABT": {"sector": "HEALTHCARE", "industry": "MEDICAL DEVICES"},
            "DHR": {"sector": "HEALTHCARE", "industry": "DIAGNOSTICS & RESEARCH"},
            
            # Industrials
            "BA": {"sector": "INDUSTRIALS", "industry": "AEROSPACE & DEFENSE"},
            "LMT": {"sector": "INDUSTRIALS", "industry": "AEROSPACE & DEFENSE"},
            "CAT": {"sector": "INDUSTRIALS", "industry": "FARM & HEAVY CONSTRUCTION MACHINERY"},
            "DE": {"sector": "INDUSTRIALS", "industry": "FARM & HEAVY CONSTRUCTION MACHINERY"},
            "HON": {"sector": "INDUSTRIALS", "industry": "DIVERSIFIED INDUSTRIALS"},
            "UPS": {"sector": "INDUSTRIALS", "industry": "INTEGRATED FREIGHT & LOGISTICS"},
            
            # Energy
            "XOM": {"sector": "ENERGY", "industry": "OIL & GAS INTEGRATED"},
            "CVX": {"sector": "ENERGY", "industry": "OIL & GAS INTEGRATED"},
            "OXY": {"sector": "ENERGY", "industry": "OIL & GAS EXPLORATION"},
            
            # Communication & Media
            "DIS": {"sector": "COMMUNICATION SERVICES", "industry": "ENTERTAINMENT"},
            "NFLX": {"sector": "COMMUNICATION SERVICES", "industry": "ENTERTAINMENT"},
            "CMCSA": {"sector": "COMMUNICATION SERVICES", "industry": "ENTERTAINMENT"},
            "T": {"sector": "COMMUNICATION SERVICES", "industry": "TELECOM SERVICES"},
            "VZ": {"sector": "COMMUNICATION SERVICES", "industry": "TELECOM SERVICES"},
            "TMUS": {"sector": "COMMUNICATION SERVICES", "industry": "WIRELESS CARRIERS"},
            
            # Miscellaneous
            "SPG": {"sector": "REAL ESTATE", "industry": "REITs"},
            "PLD": {"sector": "REAL ESTATE", "industry": "REITs"},
        }



        
        # Fetch additional info for all symbols (sector, industry, market cap)
        ticker_info = {}
        for symbol in symbols:
            try:
                # Get ticker information one at a time
                ticker = yf.Ticker(symbol)
                print("🚀 ~ ticker:", ticker)
                info = ticker.info
                
                # Extract sector and industry
                sector = info.get("sector", "")
                industry = info.get("industry", "")
                
                # Use default values if not available from API
                if not sector and symbol in default_sectors:
                    sector = default_sectors[symbol]["sector"]
                    
                if not industry and symbol in default_sectors:
                    industry = default_sectors[symbol]["industry"]
                
                # Store the information
                ticker_info[symbol] = {
                    "name": info.get("shortName", ""),
                    "sector": sector.upper() if sector else "OTHER",
                    "industry": industry.upper() if industry else sector.upper() if sector else "OTHER",
                    "marketCap": info.get("marketCap", 0)
                }
                
                logger.debug(f"Retrieved info for {symbol}: sector={ticker_info[symbol]['sector']}, industry={ticker_info[symbol]['industry']}")
                
            except Exception as e:
                logger.warning(f"Error fetching detailed info for {symbol}: {str(e)}")
                
                # Use default values if available
                if symbol in default_sectors:
                    ticker_info[symbol] = {
                        "name": "",
                        "sector": default_sectors[symbol]["sector"],
                        "industry": default_sectors[symbol]["industry"],
                        "marketCap": 0
                    }
                else:
                    ticker_info[symbol] = {
                        "name": "",
                        "sector": "OTHER",
                        "industry": "OTHER",
                        "marketCap": 0
                    }
        
        # Handle different output formats based on number of symbols
        if len(symbols) == 1:
            symbol = symbols[0]
            try:
                change = data["Close"].iloc[-1] - data["Open"].iloc[-1]
                change_percent = (change / data["Open"].iloc[-1]) * 100 if data["Open"].iloc[-1] > 0 else 0
                
                results.append({
                    "symbol": symbol,
                    "name": ticker_info[symbol]["name"],
                    "price": float(data["Close"].iloc[-1]),
                    "change": float(change),
                    "change_percent": float(change_percent),
                    "volume": int(data["Volume"].iloc[-1]),
                    "marketCap": ticker_info[symbol]["marketCap"],
                    "sector": ticker_info[symbol]["sector"],
                    "industry": ticker_info[symbol]["industry"],
                    "latest_trading_day": data.index[-1].strftime("%Y-%m-%d")
                })
            except Exception as e:
                logger.warning(f"Error processing Yahoo Finance data for {symbol}: {str(e)}")
        else:
            for symbol in symbols:
                try:
                    if symbol in data:
                        symbol_data = data[symbol]
                        change = symbol_data["Close"].iloc[-1] - symbol_data["Open"].iloc[-1]
                        change_percent = (change / symbol_data["Open"].iloc[-1]) * 100 if symbol_data["Open"].iloc[-1] > 0 else 0
                        
                        results.append({
                            "symbol": symbol,
                            "name": ticker_info[symbol]["name"],
                            "price": float(symbol_data["Close"].iloc[-1]),
                            "change": float(change),
                            "change_percent": float(change_percent),
                            "volume": int(symbol_data["Volume"].iloc[-1]),
                            "marketCap": ticker_info[symbol]["marketCap"],
                            "sector": ticker_info[symbol]["sector"],
                            "industry": ticker_info[symbol]["industry"],
                            "latest_trading_day": symbol_data.index[-1].strftime("%Y-%m-%d")
                        })
                except Exception as e:
                    logger.warning(f"Error processing Yahoo Finance data for {symbol}: {str(e)}")
        
        return results
    except Exception as e:
        logger.error(f"Error fetching Yahoo Finance data: {str(e)}")
        return []

def get_fmp_data(symbols=None, limit=30):
    """Fetch data from Financial Modeling Prep API"""
    try:
        if symbols:
            symbols_str = ",".join(symbols)
            url = f"https://financialmodelingprep.com/api/v3/quote/{symbols_str}?apikey={FMP_API_KEY}"
        else:
            url = f"https://financialmodelingprep.com/api/v3/stock/gainers?apikey={FMP_API_KEY}"
        
        response = requests.get(url)
        data = response.json()
        
        results = []
        
        # Get additional profile data for sectors and industries
        profiles = {}
        for item in data[:limit]:
            symbol = item.get("symbol")
            if symbol:
                try:
                    profile_url = f"https://financialmodelingprep.com/api/v3/profile/{symbol}?apikey={FMP_API_KEY}"
                    profile_response = requests.get(profile_url)
                    profile_data = profile_response.json()
                    
                    if profile_data and isinstance(profile_data, list) and len(profile_data) > 0:
                        profiles[symbol] = {
                            "name": profile_data[0].get("companyName", ""),
                            "sector": profile_data[0].get("sector", ""),
                            "industry": profile_data[0].get("industry", ""),
                            "marketCap": profile_data[0].get("mktCap", 0)
                        }
                    else:
                        profiles[symbol] = {"name": "", "sector": "", "industry": "", "marketCap": 0}
                except Exception as e:
                    logger.warning(f"Error fetching profile data for {symbol}: {str(e)}")
                    profiles[symbol] = {"name": "", "sector": "", "industry": "", "marketCap": 0}
        
        for item in data[:limit]:
            symbol = item.get("symbol")
            if symbol in profiles:
                results.append({
                    "symbol": symbol,
                    "name": profiles[symbol]["name"],
                    "price": float(item.get("price", 0)),
                    "change": float(item.get("change", 0)),
                    "change_percent": float(item.get("changesPercentage", 0)),
                    "volume": int(item.get("volume", 0)),
                    "marketCap": profiles[symbol]["marketCap"],
                    "sector": profiles[symbol]["sector"],
                    "industry": profiles[symbol]["industry"],
                    "latest_trading_day": item.get("date", datetime.now().strftime("%Y-%m-%d"))
                })
            else:
                results.append({
                    "symbol": symbol,
                    "name": "",
                    "price": float(item.get("price", 0)),
                    "change": float(item.get("change", 0)),
                    "change_percent": float(item.get("changesPercentage", 0)),
                    "volume": int(item.get("volume", 0)),
                    "marketCap": 0,
                    "sector": "",
                    "industry": "",
                    "latest_trading_day": item.get("date", datetime.now().strftime("%Y-%m-%d"))
                })
        
        return results
    except Exception as e:
        logger.error(f"Error fetching FMP data: {str(e)}")
        return []

def get_fmp_sectors():
    """Fetch sector performance data from Financial Modeling Prep API"""
    try:
        url = f"https://financialmodelingprep.com/api/v3/stock/sectors-performance?apikey={FMP_API_KEY}"
        
        response = requests.get(url)
        data = response.json()
        
        if "sectorPerformance" in data:
            return data["sectorPerformance"]
        return []
    except Exception as e:
        logger.error(f"Error fetching FMP sector data: {str(e)}")
        return []

def get_yahoo_historical(symbols, start_date, end_date):
    """Get historical data from Yahoo Finance"""
    try:
        # Format dates for yfinance
        start_str = start_date.strftime('%Y-%m-%d')
        end_str = end_date.strftime('%Y-%m-%d')
        
        # Join symbols with space
        symbols_str = " ".join(symbols)
        
        # Download historical data
        data = yf.download(symbols_str, start=start_str, end=end_str, group_by="ticker")
        
        results = {}
        
        # Process data based on number of symbols
        if len(symbols) == 1:
            symbol = symbols[0]
            df = pd.DataFrame({
                'date': data.index.strftime('%Y-%m-%d').tolist(),
                'open': data['Open'].tolist(),
                'high': data['High'].tolist(),
                'low': data['Low'].tolist(),
                'close': data['Close'].tolist(),
                'volume': data['Volume'].tolist()
            })
            results[symbol] = df.to_dict('records')
        else:
            for symbol in symbols:
                if symbol in data:
                    symbol_data = data[symbol]
                    df = pd.DataFrame({
                        'date': symbol_data.index.strftime('%Y-%m-%d').tolist(),
                        'open': symbol_data['Open'].tolist(),
                        'high': symbol_data['High'].tolist(),
                        'low': symbol_data['Low'].tolist(),
                        'close': symbol_data['Close'].tolist(),
                        'volume': symbol_data['Volume'].tolist()
                    })
                    results[symbol] = df.to_dict('records')
        
        return results
    except Exception as e:
        logger.error(f"Error fetching Yahoo Finance historical data: {str(e)}")
        return {}

# Main functions for API endpoints
def get_stock_data(symbols=None, limit=30):
    """Get stock data from available sources, trying each in turn"""
    if symbols is None or len(symbols) == 0:
        symbols = DEFAULT_SYMBOLS[:limit]
    
    # Try Yahoo Finance first (most reliable free source)
    data = get_yahoo_finance_data(symbols)
    
    # If Yahoo Finance failed, try Alpha Vantage
    if not data:
        data = get_alpha_vantage_data(symbols)
    
    # If Alpha Vantage failed, try FMP
    if not data:
        data = get_fmp_data(symbols, limit)
    
    # Process data for heatmap visualization
    return process_stock_data(data)

def get_sector_data(sector=None, limit=30):
    """Get sector performance data"""
    # Get sector data from FMP
    sector_data = get_fmp_sectors()
    
    # Process sector data for heatmap visualization
    return process_sector_data(sector_data, sector, limit)

def get_historical_data(symbols, start_date, end_date):
    """Get historical stock data for selected symbols"""
    # Get historical data from Yahoo Finance
    data = get_yahoo_historical(symbols, start_date, end_date)
    
    # Process historical data for visualization
    return process_historical_data(data)

def update_stock_data():
    """Update cached stock data - called by scheduler"""
    logger.info("Scheduled update: Refreshing stock data")
    try:
        # Update main stocks data
        data = get_stock_data()
        cache_data("stocks_default", data, timeout=3600)
        
        # Update sector data
        sector_data = get_sector_data()
        cache_data("sectors_data", sector_data, timeout=3600)
        
        logger.info("Stock data successfully updated")
    except Exception as e:
        logger.error(f"Error in scheduled stock data update: {str(e)}")
