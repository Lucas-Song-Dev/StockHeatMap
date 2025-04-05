# Stock Heat Map Visualizer

A powerful web-based tool for visualizing stock market momentum across different sectors and individual stocks. Compare performance against the S&P 500 and sector benchmarks with an intuitive, color-coded heat map interface.

![Screenshot 2025-03-30 005442](https://github.com/user-attachments/assets/4d027709-dd95-47f9-b394-91e13f408fa3)


## Features

- **Interactive Heat Map**: Visualize stock performance with color-coded tiles representing percentage changes
- **Sector Grouping**: Stocks organized by sectors for easy comparison
- **Size Scaling Options**: Toggle between absolute market cap sizing and sector-relative sizing
- **Detailed Stock Information**: Click on any stock to view detailed metrics
- **Real-time Data**: Automatic data refresh every 5 minutes
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

### Backend
- Python 3.9+
- Flask 2.0+
- Caching system for optimized performance
- RESTful API endpoints

### Frontend
- React with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Axios for API requests

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/stock-heat-map.git
   cd stock-heat-map


2. Create and activate a Python virtual environment

python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
3. Install Python dependencies

pip install -r requirements.txt
4. Start the Flask server

python app.py
The backend API will be available at http://localhost:5000

5. Frontend Setup
Navigate to the frontend directory

cd frontend
6. Install Node.js dependencies

npm install
# or
yarn install
7. Start the development server

npm run dev
# or
yarn dev
The frontend application will be available at http://localhost:3000

API Endpoints
The backend provides several API endpoints for stock data:

/api/stocks - Get current stock data for heat map visualization
/api/historical - Get historical stock data for selected symbols
/api/sectors - Get performance data by sectors for heat map visualization
/api/stocks-by-sector - Get stock data grouped by sectors for heatmap visualization
/api/status - API status endpoint
Usage Guide
Viewing the Heat Map: Upon loading the application, you'll see stocks grouped by sector and colored based on their performance.

Understanding Colors:

Deep red: -3% or worse
Medium red: -1% to -3%
Light red: 0% to -1%
Neutral: 0% change
Light green: 0% to +1%
Medium green: +1% to +3%
Deep green: +3% or better
Sizing Options: Toggle between "sector relative" sizing (where stock size is relative to others in the same sector) and "absolute" sizing (based on market cap).

Detailed Information: Click on any stock tile to view detailed information including price, daily high/low, volume, market cap, P/E ratio, and dividend yield.

Refreshing Data: Data automatically refreshes every 5 minutes, or click the refresh button to manually update.

Future Enhancements
User authentication to save favorite stocks and sectors
Additional technical indicators and metrics
Custom time periods for historical performance
Advanced filtering options by various metrics
News feed integration for selected stocks
License
MIT License

Acknowledgements
Financial data provided by Yahoo Finance API
Icons from FontAwesome
