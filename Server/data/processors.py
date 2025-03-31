import logging
import pandas as pd
from datetime import datetime
from collections import defaultdict

# Configure module logger
logger = logging.getLogger(__name__)

def process_stock_data(data):
    """
    Process stock data for heat map visualization
    
    Args:
        data: List of stock data dictionaries
        
    Returns:
        Dictionary with processed data for heatmap visualization
    """
    try:
        if not data:
            return {"items": [], "timestamp": datetime.now().isoformat()}
        
        # Sort by change percentage
        sorted_data = sorted(data, key=lambda x: x.get('change_percent', 0), reverse=True)
        
        # Process for heatmap - adding color and size values
        processed_items = []
        
        # Find min and max values for normalization
        max_change = max(abs(item.get('change_percent', 0)) for item in data)
        max_volume = max(item.get('volume', 0) for item in data)
        
        for item in sorted_data:
            # Normalize change_percent to a -1 to 1 scale
            normalized_change = item.get('change_percent', 0) / max_change if max_change > 0 else 0
            
            # Determine color (red for negative, green for positive)
            color = "rgb(255, 0, 0)" if normalized_change < 0 else "rgb(0, 128, 0)"
            
            # Calculate intensity based on absolute change percentage
            intensity = min(255, int(abs(normalized_change) * 255))
            
            if normalized_change < 0:
                color = f"rgba(255, {255-intensity}, {255-intensity}, 1)"
            else:
                color = f"rgba({255-intensity}, 255, {255-intensity}, 1)"
                
            # Normalize volume for size
            size = 1
            if max_volume > 0:
                size = (item.get('volume', 0) / max_volume) * 2 + 0.5
                
            processed_items.append({
                "symbol": item.get('symbol', ''),
                "price": item.get('price', 0),
                "change": item.get('change', 0),
                "change_percent": item.get('change_percent', 0),
                "volume": item.get('volume', 0),
                "color": color,
                "size": size,
                "value": abs(item.get('change_percent', 0))
            })
            
        return {
            "items": processed_items,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error processing stock data: {str(e)}")
        return {"items": [], "timestamp": datetime.now().isoformat(), "error": str(e)}

def process_historical_data(data):
    """
    Process historical stock data for visualization
    
    Args:
        data: Dictionary of historical data by symbol
        
    Returns:
        Processed historical data ready for visualization
    """
    try:
        result = {"symbols": {}, "timestamp": datetime.now().isoformat()}
        
        for symbol, history in data.items():
            if not history:
                continue
                
            # Calculate daily changes
            changes = []
            for i in range(1, len(history)):
                prev_close = history[i-1].get('close', 0)
                if prev_close > 0:
                    pct_change = ((history[i].get('close', 0) - prev_close) / prev_close) * 100
                else:
                    pct_change = 0
                
                changes.append({
                    "date": history[i].get('date'),
                    "change_percent": pct_change,
                    "close": history[i].get('close'),
                    "volume": history[i].get('volume')
                })
            
            # Calculate metrics
            if changes:
                max_change = max(item["change_percent"] for item in changes)
                min_change = min(item["change_percent"] for item in changes)
                avg_change = sum(item["change_percent"] for item in changes) / len(changes)
                
                result["symbols"][symbol] = {
                    "history": changes,
                    "stats": {
                        "max_change": max_change,
                        "min_change": min_change,
                        "avg_change": avg_change
                    }
                }
        
        return result
    except Exception as e:
        logger.error(f"Error processing historical data: {str(e)}")
        return {"symbols": {}, "timestamp": datetime.now().isoformat(), "error": str(e)}

def process_sector_data(data, sector=None, limit=None):
    """
    Process sector performance data for heat map visualization
    
    Args:
        data: List of sector performance dictionaries
        sector: Filter by specific sector (optional)
        limit: Limit number of results (optional)
        
    Returns:
        Dictionary with processed sector data for heatmap visualization
    """
    try:
        if not data:
            return {"sectors": [], "timestamp": datetime.now().isoformat()}
        
        # Filter by sector if specified
        if sector:
            filtered_data = [item for item in data if sector.lower() in item.get('sector', '').lower()]
        else:
            filtered_data = data
        
        # Apply limit if specified
        if limit:
            filtered_data = filtered_data[:limit]
        
        # Process for heatmap
        processed_sectors = []
        
        for item in filtered_data:
            sector_name = item.get('sector', '')
            change_percent_str = item.get('changesPercentage', '0%').replace('%', '')
            
            try:
                change_percent = float(change_percent_str)
            except ValueError:
                change_percent = 0
            
            # Determine color (red for negative, green for positive)
            if change_percent < 0:
                intensity = min(255, int(abs(change_percent) * 20))
                color = f"rgba(255, {255-intensity}, {255-intensity}, 1)"
            else:
                intensity = min(255, int(abs(change_percent) * 20))
                color = f"rgba({255-intensity}, 255, {255-intensity}, 1)"
                
            processed_sectors.append({
                "name": sector_name,
                "change_percent": change_percent,
                "color": color,
                "value": abs(change_percent)
            })
            
        # Sort by absolute change percentage
        processed_sectors = sorted(processed_sectors, key=lambda x: abs(x["change_percent"]), reverse=True)
            
        return {
            "sectors": processed_sectors,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error processing sector data: {str(e)}")
        return {"sectors": [], "timestamp": datetime.now().isoformat(), "error": str(e)}

def process_stocks_by_sector(stock_data, large_cap_threshold=100000000000):
    """
    Group stock data by sectors for heatmap visualization
    
    Args:
        stock_data: List of stock data dictionaries
        large_cap_threshold: Market cap threshold for isLarge flag (default: $100B)
        
    Returns:
        List of sector data with stocks grouped by sector
    """
    try:
        if not stock_data or not isinstance(stock_data, dict) or "items" not in stock_data:
            logger.error("Invalid stock data format")
            return []
            
        # Group stocks by sector
        sector_map = defaultdict(list)
        
        for stock in stock_data.get("items", []):
            # Skip stocks with no symbol
            if not stock.get("symbol"):
                continue
                
            # Extract sector and industry data properly
            sector = stock.get("sector", "").upper() if stock.get("sector") else "OTHER"
            industry = stock.get("industry", "").upper() if stock.get("industry") else sector
            
            # For logging/debug purposes
            if sector == "OTHER" and industry == "OTHER":
                logger.debug(f"Missing sector info for {stock.get('symbol')}")
            
            # Determine if this is a large-cap stock
            market_cap = stock.get("marketCap", 0)
            is_large = market_cap >= large_cap_threshold if market_cap else False
            
            # Create stock entry in the format needed for the heatmap
            stock_entry = {
                "ticker": stock.get("symbol", ""),
                "name": stock.get("name", ""),
                "price": stock.get("price", 0),
                "change": stock.get("change_percent", 0),
                "marketCap": market_cap,
                "sector": sector,  # Use actual sector for grouping
                "industry": industry,
                "isLarge": is_large
            }
            
            # Add to the appropriate sector
            sector_map[sector].append(stock_entry)
        
        # If we have no sectors with data, log an error
        if not sector_map:
            logger.error("No sector data available for any stock")
            
        # Create the final structure
        result = []
        for sector_name, stocks in sector_map.items():
            # Skip empty sectors
            if not stocks:
                continue
                
            # Sort stocks by market cap (larger first) and then by change (absolute value)
            sorted_stocks = sorted(
                stocks, 
                key=lambda x: (x.get("marketCap", 0) or 0, abs(x.get("change", 0) or 0)), 
                reverse=True
            )
            
            # Add sector to result
            result.append({
                "name": sector_name,
                "stocks": sorted_stocks
            })
        
        # Sort sectors by number of stocks (more stocks first)
        result = sorted(result, key=lambda x: len(x["stocks"]), reverse=True)
        
        # Log the sectors we found
        logger.debug(f"Processed {len(result)} sectors: {[s['name'] for s in result]}")
        
        return result
    except Exception as e:
        logger.error(f"Error processing stocks by sector: {str(e)}")
        return []
