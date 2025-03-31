import logging
from flask import Blueprint, jsonify, request, current_app
from data.sources import get_stock_data, get_sector_data, get_historical_data, get_yahoo_finance_data, DEFAULT_SYMBOLS
from utils.cache import get_cached_data, cache_data
from datetime import datetime, timedelta
from data.processors import process_stocks_by_sector

logger = logging.getLogger(__name__)

api_bp = Blueprint('api', __name__)

@api_bp.route('/stocks', methods=['GET'])
def stocks():
    """
    Get current stock data for heat map visualization
    
    Query parameters:
    - symbols: Comma-separated list of stock symbols (optional)
    - sector: Filter by sector (optional)
    - limit: Number of stocks to return (default: 30)
    """
    try:
        symbols = request.args.get('symbols')
        sector = request.args.get('sector')
        limit = int(request.args.get('limit', 30))
        
        # Use cache for frequent requests
        cache_key = f"stocks_{symbols}_{sector}_{limit}"
        cached_result = get_cached_data(cache_key)
        
        if cached_result:
            logger.debug(f"Serving cached stock data for {cache_key}")
            return jsonify(cached_result)
        
        if symbols:
            symbol_list = [s.strip().upper() for s in symbols.split(',')]
            data = get_stock_data(symbol_list)
        elif sector:
            data = get_sector_data(sector, limit)
        else:
            data = get_stock_data(limit=limit)
        
        # Cache the result for 5 minutes
        cache_data(cache_key, data, timeout=300)
        
        return jsonify(data)
    except Exception as e:
        logger.error(f"Error fetching stock data: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@api_bp.route('/historical', methods=['GET'])
def historical():
    """
    Get historical stock data for selected symbols
    
    Query parameters:
    - symbols: Comma-separated list of stock symbols (required)
    - days: Number of days of historical data (default: 30)
    """
    try:
        symbols = request.args.get('symbols')
        days = int(request.args.get('days', 30))
        
        if not symbols:
            return jsonify({'error': 'Symbol parameter is required'}), 400
            
        symbol_list = [s.strip().upper() for s in symbols.split(',')]
        
        # Use cache for frequent requests
        cache_key = f"historical_{','.join(symbol_list)}_{days}"
        cached_result = get_cached_data(cache_key)
        
        if cached_result:
            logger.debug(f"Serving cached historical data for {cache_key}")
            return jsonify(cached_result)
            
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        data = get_historical_data(symbol_list, start_date, end_date)
        
        # Cache the result for 60 minutes for historical data
        cache_data(cache_key, data, timeout=3600)
        
        return jsonify(data)
    except Exception as e:
        logger.error(f"Error fetching historical data: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@api_bp.route('/sectors', methods=['GET'])
def sectors():
    """Get performance data by sectors for heat map visualization"""
    try:
        # Use cache for frequent requests
        cache_key = "sectors_data"
        cached_result = get_cached_data(cache_key)
        
        if cached_result:
            logger.debug("Serving cached sector data")
            return jsonify(cached_result)
            
        # Get sector performance data - using a large limit to get all sectors
        data = get_sector_data(limit=100)
        
        # Cache the result for 15 minutes
        cache_data(cache_key, data, timeout=900)
        
        return jsonify(data)
    except Exception as e:
        logger.error(f"Error fetching sector data: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@api_bp.route('/stocks-by-sector', methods=['GET'])
def stocks_by_sector():
    """
    Get stock data grouped by sectors for heatmap visualization
    
    Query parameters:
    - symbols: Comma-separated list of stock symbols (optional)
    - limit: Number of stocks to return (default: 100)
    - large_cap_threshold: Market cap threshold in $ for isLarge flag (default: 100,000,000,000)
    """
    try:
        symbols = request.args.get('symbols')
        limit = int(request.args.get('limit', 100))
        large_cap_threshold = int(float(request.args.get('large_cap_threshold', 100000000000)))
        
        # Use cache for frequent requests
        cache_key = f"stocks_by_sector_{symbols}_{limit}_{large_cap_threshold}"
        cached_result = get_cached_data(cache_key)
        
        if cached_result:
            logger.debug(f"Serving cached stocks by sector data for {cache_key}")
            return jsonify(cached_result)
        
        # Get raw stock data
        if symbols:
            symbol_list = [s.strip().upper() for s in symbols.split(',')]
            stock_data_raw = get_yahoo_finance_data(symbol_list)
        else:
            symbol_list = DEFAULT_SYMBOLS[:limit]
            stock_data_raw = get_yahoo_finance_data(symbol_list)
            
        # Convert raw data to the format expected by process_stocks_by_sector
        stock_data = {
            "items": [{
                "symbol": item.get("symbol"),
                "name": item.get("name"),
                "price": item.get("price"),
                "change_percent": item.get("change_percent"),
                "marketCap": item.get("marketCap"),
                "sector": item.get("sector"),
                "industry": item.get("industry")
            } for item in stock_data_raw]
        }
        
        # Process data into the desired format
        sector_data = process_stocks_by_sector(stock_data, large_cap_threshold=large_cap_threshold)
        
        result = {
            'sectors': sector_data,
            'timestamp': datetime.now().isoformat()
        }
        
        # Cache the result for 5 minutes
        cache_data(cache_key, result, timeout=300)
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error fetching stocks by sector: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@api_bp.route('/status', methods=['GET'])
def status():
    """API status endpoint"""
    return jsonify({
        'status': 'online',
        'timestamp': datetime.now().isoformat()
    })
