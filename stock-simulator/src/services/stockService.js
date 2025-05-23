import axios from 'axios';

// Get API key from environment variables
const API_KEY = process.env.REACT_APP_FINNHUB_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

// Fetch current stock price for a symbol
export const fetchStockPrice = async (symbol) => {
  try {
    // Get current quote
    const quoteResponse = await axios.get(
      `${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`
    );
    
    // Get company profile for name
    const profileResponse = await axios.get(
      `${BASE_URL}/stock/profile2?symbol=${symbol}&token=${API_KEY}`
    );
    
    const quote = quoteResponse.data;
    const profile = profileResponse.data;
    
    if (quote && quote.c !== null) {
      const change = quote.c - quote.pc; // current - previous close
      const changePercent = quote.pc > 0 ? ((change / quote.pc) * 100) : 0;
      
      return {
        symbol: symbol,
        name: profile.name || symbol,
        price: parseFloat(quote.c.toFixed(2)), // current price
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        latestTradingDay: new Date().toISOString().split('T')[0], // Use current date as trading day
      };
    }
    throw new Error('No data returned from API');
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

// Helper function to get company name from symbol
export const fetchCompanyName = async (symbol) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/stock/profile2?symbol=${symbol}&token=${API_KEY}`
    );
    
    return response.data.name || symbol;
  } catch (error) {
    console.error('Error fetching company name:', error);
    return symbol; // Return the symbol as fallback
  }
};

// Fetch company information
export const fetchCompanyInfo = async (symbol) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/stock/profile2?symbol=${symbol}&token=${API_KEY}`
    );
    
    // Map Finnhub response to match Alpha Vantage structure
    const data = response.data;
    return {
      Name: data.name,
      Symbol: symbol,
      Description: data.description || '',
      Industry: data.finnhubIndustry || '',
      Sector: data.gics || '',
      MarketCapitalization: data.marketCapitalization || 0,
      Country: data.country || '',
      Currency: data.currency || 'USD',
      Exchange: data.exchange || '',
      WebURL: data.weburl || '',
      Logo: data.logo || '',
    };
  } catch (error) {
    console.error('Error fetching company info:', error);
    throw error;
  }
};

// Fetch time series data for charts
export const fetchTimeSeriesData = async (symbol, interval = 'daily') => {
  try {
    // Calculate date range based on interval
    const endDate = Math.floor(Date.now() / 1000);
    let startDate;
    
    switch (interval) {
      case 'weekly':
        startDate = endDate - (7 * 24 * 60 * 60 * 52); // 52 weeks
        break;
      case 'monthly':
        startDate = endDate - (30 * 24 * 60 * 60 * 12); // 12 months
        break;
      default: // daily
        startDate = endDate - (24 * 60 * 60 * 365); // 365 days
    }
    
    // For daily data, use daily resolution; for weekly/monthly, use weekly resolution
    const resolution = interval === 'daily' ? 'D' : interval === 'weekly' ? 'W' : 'M';
    
    const response = await axios.get(
      `${BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${startDate}&to=${endDate}&token=${API_KEY}`
    );
    
    const data = response.data;
    
    if (data.s === 'ok' && data.c && data.c.length > 0) {
      return data.t.map((timestamp, index) => ({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        open: parseFloat(data.o[index]),
        high: parseFloat(data.h[index]),
        low: parseFloat(data.l[index]),
        close: parseFloat(data.c[index]),
        volume: parseFloat(data.v[index]),
      })).reverse(); // Most recent first
    }
    
    throw new Error('No time series data returned');
  } catch (error) {
    console.error('Error fetching time series data:', error);
    throw error;
  }
};

// Fetch market movers using real API calls
export const fetchMarketMovers = async () => {
  // List of popular stock symbols to query
  const symbols = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'TSLA', 'WMT'];
  
  try {
    // Make API calls for each symbol in parallel
    const promises = symbols.map(symbol => fetchStockPrice(symbol));
    const results = await Promise.all(promises);
    
    // Sort by absolute change percentage to get the biggest movers
    return results.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
  } catch (error) {
    console.error('Error fetching market movers:', error);
    
    // Fallback to sample data if the API fails
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
  }
};

// Fetch user portfolio (this would connect to a backend in a real app)
export const fetchPortfolio = async () => {
  // This is a mock implementation
  // In a real app, this would fetch from your backend API
  const mockPortfolio = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 10,
      avgPrice: 145.75,
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      shares: 5,
      avgPrice: 320.45,
    },
    {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      shares: 8,
      avgPrice: 210.30,
    }
  ];
  
  try {
    // Get real-time prices for the portfolio stocks
    const updatedPortfolio = await Promise.all(
      mockPortfolio.map(async (stock) => {
        try {
          const currentData = await fetchStockPrice(stock.symbol);
          return {
            ...stock,
            currentPrice: currentData.price,
            change: currentData.changePercent
          };
        } catch (error) {
          console.error(`Error fetching current price for ${stock.symbol}:`, error);
          // Return the stock with estimated data if the API call fails
          return {
            ...stock,
            currentPrice: stock.avgPrice * 1.05, // Estimate a 5% increase
            change: 5
          };
        }
      })
    );
    
    return updatedPortfolio;
  } catch (error) {
    console.error('Error updating portfolio with real-time data:', error);
    
    // Return mock data with placeholder current prices
    return mockPortfolio.map(stock => ({
      ...stock,
      currentPrice: stock.symbol === 'TSLA' ? 195.70 : stock.avgPrice * 1.1,
      change: stock.symbol === 'TSLA' ? -1.45 : 1.5
    }));
  }
};

// Fetch user watchlist with real-time data
export const fetchWatchlist = async () => {
  // Mock watchlist symbols
  const watchlistSymbols = ['NVDA', 'AMD', 'INTC'];
  
  try {
    // Get real-time data for watchlist stocks
    const watchlist = await Promise.all(
      watchlistSymbols.map(async (symbol) => {
        try {
          const data = await fetchStockPrice(symbol);
          return {
            symbol,
            name: data.name,
            price: data.price,
            change: data.changePercent
          };
        } catch (error) {
          console.error(`Error fetching data for watchlist stock ${symbol}:`, error);
          // Return placeholder data if API call fails
          return {
            symbol,
            name: symbol === 'NVDA' ? 'NVIDIA Corporation' : 
                  symbol === 'AMD' ? 'Advanced Micro Devices, Inc.' : 'Intel Corporation',
            price: symbol === 'NVDA' ? 980.75 : 
                  symbol === 'AMD' ? 165.85 : 35.42,
            change: symbol === 'NVDA' ? 3.25 : 
                  symbol === 'AMD' ? -1.24 : 0.68
          };
        }
      })
    );
    
    return watchlist;
  } catch (error) {
    console.error('Error fetching watchlist with real-time data:', error);
    
    // Return mock data as fallback
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
  }
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