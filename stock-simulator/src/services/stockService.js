// src/services/stockService.js
import axios from 'axios';

const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key

export const fetchStockPrice = async (symbol) => {
  try {
    // Example using Alpha Vantage API - replace with your preferred API
    const response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

export const fetchPortfolio = async () => {
  // Mock implementation - replace with your actual backend call
  // For a real app, you would have a backend API to store user portfolio
  return [];
};

export const fetchWatchlist = async () => {
  // Mock implementation
  return [];
};

export const fetchMarketMovers = async () => {
  // Mock implementation
  return [];
};