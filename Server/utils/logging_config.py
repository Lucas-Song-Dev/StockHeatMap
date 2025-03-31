import os
import logging
from logging.handlers import RotatingFileHandler

def configure_logging():
    """Configure application logging"""
    log_level = os.environ.get("LOG_LEVEL", "DEBUG")
    numeric_level = getattr(logging, log_level.upper(), logging.DEBUG)
    
    # Configure root logger
    logging.basicConfig(
        level=numeric_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Create console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(numeric_level)
    console_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    console_handler.setFormatter(console_formatter)
    
    # Add handlers to root logger
    root_logger = logging.getLogger()
    
    # Remove default handlers and add our custom one
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
    
    root_logger.addHandler(console_handler)
    
    # Set specific loggers to appropriate levels
    logging.getLogger('werkzeug').setLevel(logging.WARNING)
    logging.getLogger('apscheduler').setLevel(logging.WARNING)
    
    # Create logger for our application
    app_logger = logging.getLogger('stock_api')
    app_logger.setLevel(numeric_level)
    
    return app_logger
