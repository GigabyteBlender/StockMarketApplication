import { useState, useEffect } from 'react';
import { TrendingDown } from 'lucide-react';
import {
  fetchPortfolio,
  fetchWatchlist,
  fetchMarketMovers,
  fetchTransactionHistory,
  fetchStockPrice,
  fetchTimeSeriesData
} from '../services/stockService';

// Import components
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Portfolio from './Portfolio';
import Market from './Market';
import History from './History';
import TradeModal from './TradeModal';

export default function StockSimulator() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [stockData, setStockData] = useState(null);

  // State for our data
  const [portfolio, setPortfolio] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [marketMovers, setMarketMovers] = useState([]);
  const [recentTrades, setRecentTrades] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [tradeAction, setTradeAction] = useState('BUY');
  const [tradeQuantity, setTradeQuantity] = useState(1);

  // Calculate portfolio metrics
  const portfolioValue = portfolio.reduce((total, stock) => total + (stock.shares * stock.currentPrice), 0);
  const totalCost = portfolio.reduce((total, stock) => total + (stock.shares * stock.avgPrice), 0);
  const totalGainLoss = portfolioValue - totalCost;
  const gainLossPercent = totalCost > 0 ? ((portfolioValue / totalCost - 1) * 100).toFixed(2) : 0;
  const availableCash = 10000; // Starting amount - would be tracked in a real app

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const portfolioData = await fetchPortfolio();
        const watchlistData = await fetchWatchlist();
        const marketMoversData = await fetchMarketMovers();
        const tradesData = await fetchTransactionHistory();

        setPortfolio(portfolioData);
        setWatchlist(watchlistData);
        setMarketMovers(marketMoversData);
        setRecentTrades(tradesData);

        // Fetch chart data for a default stock (first in portfolio if exists)
        if (portfolioData.length > 0) {
          const stockChartData = await fetchTimeSeriesData(portfolioData[0].symbol);
          setChartData(stockChartData.slice(0, 30)); // Only use the last 30 days
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadData();
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (searchTerm.trim().length > 0) {
      try {
        const data = await fetchStockPrice(searchTerm);
        setSearchResults([data]);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Error searching for stock:', error);
        setSearchResults([]);
      }
    }
  };

  // Handle stock selection
  const handleSelectStock = async (symbol) => {
    try {
      const stockData = await fetchStockPrice(symbol);
      const timeSeriesData = await fetchTimeSeriesData(symbol);

      setSelectedStock(stockData);
      setChartData(timeSeriesData.slice(0, 30));
      setShowSearchResults(false);
      setSearchTerm('');
    } catch (error) {
      console.error('Error fetching stock details:', error);
    }
  };

  // Handle trade modal
  const openTradeModal = (symbol, action = 'BUY') => {
    setSelectedStock({ symbol });
    setTradeAction(action);
    setIsTradeModalOpen(true);
  };

  const closeTradeModal = () => {
    setIsTradeModalOpen(false);
  };

  const updateTradeQuantity = (amount) => {
    const newQuantity = Math.max(1, tradeQuantity + amount);
    setTradeQuantity(newQuantity);
  };

  const confirmTrade = () => {
    // In a real app, this would send the trade to your backend
    console.log(`Executing ${tradeAction} for ${tradeQuantity} shares of ${selectedStock.symbol}`);
    closeTradeModal();
    // You would then refresh the portfolio data
  };

  // Search handler
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Create props for each component
  const headerProps = {
    searchTerm,
    setSearchTerm,
    handleSearchKeyPress,
    handleSearch,
    showSearchResults,
    searchResults,
    handleSelectStock,
    availableCash,
    TrendingDown
  };

  const dashboardProps = {
    portfolio,
    portfolioValue,
    totalGainLoss,
    gainLossPercent,
    availableCash,
    chartData,
    selectedStock,
    watchlist,
    marketMovers,
    openTradeModal
  };

  const portfolioProps = {
    portfolio,
    portfolioValue,
    totalCost,
    totalGainLoss,
    gainLossPercent,
    availableCash,
    openTradeModal
  };

  const marketProps = {
    marketMovers,
    openTradeModal,
    handleSelectStock
  };

  const historyProps = {
    recentTrades
  };

  const tradeModalProps = {
    isOpen: isTradeModalOpen,
    onClose: closeTradeModal,
    selectedStock,
    tradeAction,
    tradeQuantity,
    updateTradeQuantity,
    confirmTrade,
    availableCash,
    portfolio
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <Header {...headerProps} />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main content area */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'dashboard' && <Dashboard {...dashboardProps} />}
          {activeTab === 'portfolio' && <Portfolio {...portfolioProps} />}
          {activeTab === 'market' && <Market {...marketProps} />}
          {activeTab === 'history' && <History {...historyProps} />}
        </main>
      </div>

      {/* Trade Modal */}
      <TradeModal {...tradeModalProps} />
    </div>
  );
}