import time
import logging
from threading import Lock

# Configure module logger
logger = logging.getLogger(__name__)

# Simple in-memory cache
_cache = {}
_cache_lock = Lock()

def get_cached_data(key):
    """
    Get data from cache if it exists and hasn't expired
    
    Args:
        key: Cache key
        
    Returns:
        Cached data or None if not found/expired
    """
    with _cache_lock:
        if key in _cache:
            timestamp, timeout, data = _cache[key]
            if time.time() - timestamp < timeout:
                return data
            else:
                # Clean up expired cache entry
                del _cache[key]
    return None

def cache_data(key, data, timeout=300):
    """
    Cache data with expiration
    
    Args:
        key: Cache key
        data: Data to cache
        timeout: Cache timeout in seconds (default: 5 minutes)
    """
    with _cache_lock:
        _cache[key] = (time.time(), timeout, data)
    
def clear_cache():
    """Clear all cached data"""
    with _cache_lock:
        _cache.clear()
    logger.info("Cache cleared")

def cleanup_expired_cache():
    """Remove expired cache entries"""
    with _cache_lock:
        current_time = time.time()
        expired_keys = [
            key for key, (timestamp, timeout, _) in _cache.items()
            if current_time - timestamp >= timeout
        ]
        
        for key in expired_keys:
            del _cache[key]
    
    if expired_keys:
        logger.debug(f"Cleaned up {len(expired_keys)} expired cache entries")
