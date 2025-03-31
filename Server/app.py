import os
import logging
from flask import Flask
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from utils.logging_config import configure_logging
from data.sources import update_stock_data
from api.routes import api_bp

# Configure application logging
configure_logging()
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "default-secret-key-for-development")

# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Register blueprints
app.register_blueprint(api_bp, url_prefix='/api')

# Set up background scheduler for data updates
scheduler = BackgroundScheduler()
scheduler.add_job(update_stock_data, 'interval', minutes=60)
scheduler.start()

logger.info("Stock Market API initialized")

# Import routes after app initialization to avoid circular imports
from api import routes

@app.route('/')
def index():
    """Serve the main documentation page"""
    from flask import render_template
    return render_template('index.html')

@app.teardown_appcontext
def shutdown_scheduler(exception=None):
    """Shut down the scheduler when the app is shutting down"""
    if scheduler.running:
        scheduler.shutdown()
