// src/services/stockService.js
import axios from 'axios';

// Get API key from environment variables
const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

// Fetch current stock price for a symbol
export const fetchStockPrice = async (symbol) => {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    
    // Parse the response to return just what we need
    const data = response.data['Global Quote'];
    if (data) {
      return {
        symbol: data['01. symbol'],
        price: parseFloat(data['05. price']),
        change: parseFloat(data['09. change']),
        changePercent: data['10. change percent'].replace('%', ''),
        latestTradingDay: data['07. latest trading day'],
      };
    }
    throw new Error('No data returned from API');
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

// Fetch company information
export const fetchCompanyInfo = async (symbol) => {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching company info:', error);
    throw error;
  }
};

// Fetch time series data for charts
export const fetchTimeSeriesData = async (symbol, interval = 'daily') => {
  try {
    // Map intervals to Alpha Vantage functions
    const functionMap = {
      daily: 'TIME_SERIES_DAILY',
      weekly: 'TIME_SERIES_WEEKLY',
      monthly: 'TIME_SERIES_MONTHLY'
    };
    
    const func = functionMap[interval] || 'TIME_SERIES_DAILY';
    
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&apikey=${API_KEY}`
    );
    
    // Process the data for chart display
    const timeSeriesKey = `Time Series (${interval === 'daily' ? 'Daily' : interval === 'weekly' ? 'Weekly' : 'Monthly'})`;
    const timeSeries = response.data[timeSeriesKey];
    
    if (timeSeries) {
      return Object.entries(timeSeries).map(([date, values]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseFloat(values['5. volume']),
      })).reverse(); // Most recent first
    }
    
    throw new Error('No time series data returned');
  } catch (error) {
    console.error('Error fetching time series data:', error);
    throw error;
  }
};

// Fetch market movers (simulated for now, as Alpha Vantage doesn't provide this directly)
export const fetchMarketMovers = async () => {
  // In a real app, you might use a different endpoint or API for this
  // This is a mock implementation with realistic data
  return [
    { 
      symbol: 'AAPL', 
      name: 'Apple Inc.', 
      price: 178.85, 
      change: 2.75, 
      changePercent: 1.56
    },
    { 
      symbol: 'MSFT', 
      name: 'Microsoft Corporation', 
      price: 412.31, 
      change: 5.21, 
      changePercent: 1.28
    },
    { 
      symbol: 'AMZN', 
      name: 'Amazon.com Inc.', 
      price: 181.47, 
      change: -2.35, 
      changePercent: -1.28
    },
    { 
      symbol: 'GOOGL', 
      name: 'Alphabet Inc.', 
      price: 159.13, 
      change: 1.78, 
      changePercent: 1.13
    },
    { 
      symbol: 'META', 
      name: 'Meta Platforms Inc.', 
      price: 452.36, 
      change: -3.42, 
      changePercent: -0.75
    }
  ];
};

// Fetch user portfolio (this would connect to a backend in a real app)
export const fetchPortfolio = async () => {
  // This is a mock implementation
  // In a real app, this would fetch from your backend API
  return [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 10,
      avgPrice: 145.75,
      currentPrice: 178.85,
      change: 1.56
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      shares: 5,
      avgPrice: 320.45,
      currentPrice: 412.31,
      change: 1.28
    },
    {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      shares: 8,
      avgPrice: 210.30,
      currentPrice: 195.70,
      change: -1.45
    }
  ];
};

// Fetch user watchlist
export const fetchWatchlist = async () => {
  // Mock implementation
  return [
    { 
      symbol: 'NVDA', 
      name: 'NVIDIA Corporation', 
      price: 980.75, 
      change: 3.25 
    },
    { 
      symbol: 'AMD', 
      name: 'Advanced Micro Devices, Inc.', 
      price: 165.85, 
      change: -1.24 
    },
    { 
      symbol: 'INTC', 
      name: 'Intel Corporation', 
      price: 35.42, 
      change: 0.68 
    }
  ];
};

// Fetch transaction history
export const fetchTransactionHistory = async () => {
  // Mock implementation
  return [
    { 
      date: '2025-04-28', 
      action: 'BUY', 
      symbol: 'AAPL', 
      shares: 5, 
      price: 178.85 
    },
    { 
      date: '2025-04-26', 
      action: 'SELL', 
      symbol: 'MSFT', 
      shares: 2, 
      price: 410.22 
    },
    { 
      date: '2025-04-22', 
      action: 'BUY', 
      symbol: 'TSLA', 
      shares: 8, 
      price: 210.30 
    }
  ];
};