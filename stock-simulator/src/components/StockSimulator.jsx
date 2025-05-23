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

// Import all the tab components that make up the different pages
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Portfolio from './Portfolio';
import Market from './Market';
import History from './History';
import TradeModal from './TradeModal';

import './styles/StockSimulator.css';

/**
 * StockSimulator - Main application component
 * 
 * This is the root component that:
 * 1. Manages all application state (portfolio, watchlist, market data, etc.)
 * 2. Handles navigation between different tabs/pages
 * 3. Coordinates data fetching and sharing between components
 * 4. Manages the search functionality
 * 5. Controls the trade modal
 * 
 * Layout Structure:
 * - Header (search bar, cash display)
 * - Main Content Area:
 *   - Sidebar (navigation tabs)
 *   - Content Area (Dashboard, Portfolio, Market, or History)
 * - Trade Modal (overlay for buying/selling stocks)
 */
export default function StockSimulator() {
	// ===========================================
	// NAVIGATION & UI STATE
	// ===========================================
	
	// Controls which tab/page is currently active
	const [activeTab, setActiveTab] = useState('dashboard');
	
	// Search functionality state
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [showSearchResults, setShowSearchResults] = useState(false);
	const [stockData, setStockData] = useState(null);

	// ===========================================
	// CORE DATA STATE
	// ===========================================
	
	// User's portfolio - stocks they own with shares, prices, etc.
	const [portfolio, setPortfolio] = useState([]);
	
	// User's watchlist - stocks they're monitoring but don't own
	const [watchlist, setWatchlist] = useState([]);
	
	// Market data - top gainers/losers, trending stocks
	const [marketMovers, setMarketMovers] = useState([]);
	
	// Transaction history - all past buy/sell orders
	const [recentTrades, setRecentTrades] = useState([]);
	
	// Chart data for displaying stock price trends
	const [chartData, setChartData] = useState([]);
	
	// Currently selected stock (for detailed view or trading)
	const [selectedStock, setSelectedStock] = useState(null);

	// ===========================================
	// TRADE MODAL STATE
	// ===========================================
	
	// Controls whether the buy/sell modal is open
	const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
	
	// Whether user is buying or selling ('BUY' or 'SELL')
	const [tradeAction, setTradeAction] = useState('BUY');
	
	// How many shares user wants to trade
	const [tradeQuantity, setTradeQuantity] = useState(1);

	// ===========================================
	// CALCULATED VALUES
	// ===========================================
	
	// Calculate total value of all stocks in portfolio
	const portfolioValue = portfolio.reduce((total, stock) => total + (stock.shares * stock.currentPrice), 0);
	
	// Calculate total amount originally invested
	const totalCost = portfolio.reduce((total, stock) => total + (stock.shares * stock.avgPrice), 0);
	
	// Calculate overall profit/loss
	const totalGainLoss = portfolioValue - totalCost;
	
	// Calculate gain/loss as a percentage
	const gainLossPercent = totalCost > 0 ? ((portfolioValue / totalCost - 1) * 100).toFixed(2) : 0;
	
	// Available cash for trading (in real app, this would be fetched from backend)
	const availableCash = 10000; // Starting amount - would be tracked in a real app

	// ===========================================
	// DATA LOADING (RUNS ONCE ON APP START)
	// ===========================================
	
	useEffect(() => {
		/**
		 * Load all initial data when the app starts
		 * This includes: portfolio, watchlist, market data, transaction history
		 */
		const loadData = async () => {
			try {
				// Fetch all data in parallel for better performance
				const portfolioData = await fetchPortfolio();
				const watchlistData = await fetchWatchlist();
				const marketMoversData = await fetchMarketMovers();
				const tradesData = await fetchTransactionHistory();

				// Update state with fetched data
				setPortfolio(portfolioData);
				setWatchlist(watchlistData);
				setMarketMovers(marketMoversData);
				setRecentTrades(tradesData);

				// If user has stocks, load chart data for the first stock
				if (portfolioData.length > 0) {
					const stockChartData = await fetchTimeSeriesData(portfolioData[0].symbol);
					setChartData(stockChartData.slice(0, 30)); // Only use the last 30 days
				}
			} catch (error) {
				console.error('Error loading initial data:', error);
			}
		};

		loadData();
	}, []); // Empty dependency array = run once on mount

	// ===========================================
	// SEARCH FUNCTIONALITY
	// ===========================================
	
	/**
	 * Handle stock search - called when user searches for a stock symbol
	 */
	const handleSearch = async () => {
		if (searchTerm.trim().length > 0) {
			try {
				// Fetch stock data for the searched symbol
				const data = await fetchStockPrice(searchTerm);
				setSearchResults([data]);
				setShowSearchResults(true);
			} catch (error) {
				console.error('Error searching for stock:', error);
				setSearchResults([]);
			}
		}
	};

	/**
	 * Handle when user selects a stock from search results or clicks "View" button
	 * This loads detailed data for that stock
	 */
	const handleSelectStock = async (symbol) => {
		try {
			// Fetch current stock price and historical data
			const stockData = await fetchStockPrice(symbol);
			const timeSeriesData = await fetchTimeSeriesData(symbol);

			// Update state with selected stock data
			setSelectedStock(stockData);
			setChartData(timeSeriesData.slice(0, 30));
			
			// Hide search results and clear search term
			setShowSearchResults(false);
			setSearchTerm('');
		} catch (error) {
			console.error('Error fetching stock details:', error);
		}
	};

	// ===========================================
	// TRADE MODAL FUNCTIONS
	// ===========================================
	
	/**
	 * Open the trade modal for buying or selling a stock
	 * @param {string} symbol - Stock symbol (e.g., 'AAPL')
	 * @param {string} action - 'BUY' or 'SELL'
	 */
	const openTradeModal = (symbol, action = 'BUY') => {
		setSelectedStock({ symbol });
		setTradeAction(action);
		setIsTradeModalOpen(true);
	};

	/**
	 * Close the trade modal and reset trade state
	 */
	const closeTradeModal = () => {
		setIsTradeModalOpen(false);
	};

	/**
	 * Update the quantity of shares to trade
	 * @param {number} amount - Amount to add/subtract from current quantity
	 */
	const updateTradeQuantity = (amount) => {
		const newQuantity = Math.max(1, tradeQuantity + amount);
		setTradeQuantity(newQuantity);
	};

	/**
	 * Execute the trade (buy or sell)
	 * In a real app, this would:
	 * 1. Send the trade to your backend API
	 * 2. Update user's portfolio and cash balance
	 * 3. Add transaction to history
	 * 4. Refresh all relevant data
	 */
	const confirmTrade = () => {
		// For now, just log the trade (in real app, send to backend)
		console.log(`Executing ${tradeAction} for ${tradeQuantity} shares of ${selectedStock.symbol}`);
		closeTradeModal();
		
		// In a real app, you would:
		// - Send trade to backend API
		// - Refresh portfolio data
		// - Update transaction history
		// - Update available cash
	};

	// ===========================================
	// EVENT HANDLERS
	// ===========================================
	
	/**
	 * Handle Enter key press in search input
	 */
	const handleSearchKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	// ===========================================
	// COMPONENT PROPS PREPARATION
	// ===========================================
	
	// Prepare props for Header component (search bar, cash display)
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

	// Prepare props for Dashboard tab (overview of everything)
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
		openTradeModal,
		handleSelectStock // Added this since Dashboard needs it
	};

	// Prepare props for Portfolio tab (detailed portfolio management)
	const portfolioProps = {
		portfolio,
		portfolioValue,
		totalCost,
		totalGainLoss,
		gainLossPercent,
		availableCash,
		openTradeModal
	};

	// Prepare props for Market tab (market overview, gainers/losers)
	const marketProps = {
		marketMovers,
		openTradeModal,
		handleSelectStock
	};

	// Prepare props for History tab (transaction history)
	const historyProps = {
		recentTrades
	};

	// Prepare props for Trade Modal (buy/sell dialog)
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

	// ===========================================
	// RENDER THE APPLICATION
	// ===========================================
	
	return (
		<div className="simulator-container">
			{/* 
				HEADER SECTION
				- Contains search bar
				- Shows available cash
				- Displays search results dropdown
			*/}
			<Header {...headerProps} />

			{/* MAIN CONTENT AREA */}
			<div className="simulator-content">
				{/* 
					SIDEBAR NAVIGATION
					- Dashboard tab button
					- Portfolio tab button  
					- Market tab button
					- History tab button
				*/}
				<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

				{/* 
					MAIN CONTENT AREA
					- Shows different components based on active tab
					- Only one tab content is rendered at a time
				*/}
				<main className="main-content">
					{/* Dashboard Tab - Overview of portfolio, watchlist, market movers */}
					{activeTab === 'dashboard' && <Dashboard {...dashboardProps} />}
					
					{/* Portfolio Tab - Detailed portfolio management and charts */}
					{activeTab === 'portfolio' && <Portfolio {...portfolioProps} />}
					
					{/* Market Tab - Market indices, top gainers/losers */}
					{activeTab === 'market' && <Market {...marketProps} />}
					
					{/* History Tab - Transaction history with filtering */}
					{activeTab === 'history' && <History {...historyProps} />}
				</main>
			</div>

			{/* 
				TRADE MODAL
				- Overlay dialog for buying/selling stocks
				- Only shows when isTradeModalOpen is true
				- Allows user to specify quantity and confirm trades
			*/}
			<TradeModal {...tradeModalProps} />
		</div>
	);
}