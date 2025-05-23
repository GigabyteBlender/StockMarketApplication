import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart2, RotateCcw} from 'lucide-react';
import './styles/Market.css';
import './styles/Tables.css';
import { fetchStockPrice } from '../services/stockService';

/**
 * Market Component - Displays market overview, indices, and top movers
 * 
 * FUTURE DATA INTEGRATION NEEDS:
 * - Replace Alpha Vantage with more robust financial data provider
 * - Add WebSocket connections for real-time market data streaming
 * - Implement caching to reduce API calls and improve performance
 * - Add more market indices (Russell 2000, VIX, international markets)
 * - Store market data in backend database for historical analysis
 * - Add user-customizable market watchlists and alerts
 */
const MarketTab = ({ 
	marketMovers,      // Array of stocks with price changes (should come from real market data API)
	openTradeModal,    // Function to open trading modal for buy/sell operations
	handleSelectStock  // Function to navigate to detailed stock view
}) => {
	// Market indices state - tracks major market performance indicators
	// TODO: Expand to include more indices and international markets
	const [marketIndices, setMarketIndices] = useState({
		sp500: { price: 5304.12, change: 0.87 },     // S&P 500 ETF (SPY) data
		dowJones: { price: 39651.87, change: 0.56 }, // Dow Jones ETF (DIA) data  
		nasdaq: { price: 16802.36, change: -0.22 }   // NASDAQ ETF (QQQ) data
	});

	// Loading state for API calls
	const [loading, setLoading] = useState(true);

	// Fetch market data on component mount
	useEffect(() => {
		fetchMarketIndices();
	}, []);

	/**
	 * Fetches current market indices data using the StockService
	 * Uses ETF symbols as proxies for major market indices
	 * TODO: Implement the following improvements:
	 * - Add error handling with retry logic
	 * - Cache responses to reduce API usage
	 * - Add fallback data sources in case primary API fails
	 * - Implement rate limiting to avoid API quota exhaustion
	 */
	const fetchMarketIndices = async () => {
		try {
			// Fetch data for major market indices using ETF symbols as proxies
			// TODO: Consider using actual index data if available from API provider
			const [sp500Data, dowData, nasdaqData] = await Promise.all([
				fetchStockPrice('SPY'),  // S&P 500 ETF
				fetchStockPrice('DIA'),  // Dow Jones ETF
				fetchStockPrice('QQQ')   // NASDAQ ETF
			]);

			// Update state with fresh market data if all API calls succeeded
			if (sp500Data && dowData && nasdaqData) {
				setMarketIndices({
					sp500: { 
						price: sp500Data.price,
						change: sp500Data.changePercent
					},
					dowJones: { 
						price: dowData.price,
						change: dowData.changePercent
					},
					nasdaq: { 
						price: nasdaqData.price,
						change: nasdaqData.changePercent
					}
				});
			}
		} catch (error) {
			console.error('Error fetching market indices:', error);
			// Keep the default values in case of API failures
			// TODO: Implement proper error notification to user
			// TODO: Add fallback to cached data if available
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Handles manual refresh of market data
	 * TODO: Add auto-refresh functionality with configurable intervals
	 * TODO: Show last updated timestamp to user
	 */
	const handleRefresh = () => {
		setLoading(true);
		// Re-fetch market data
		fetchMarketIndices();
	};

	return (
		<div className="market-container">
			{/* Market Header with Title and Refresh Button */}
			<div className="market-header">
				<h2 className="market-title">
					<BarChart2 className="market-title-icon" />
					Market Overview
				</h2>
				<div className="market-header-actions">
					{/* Manual Refresh Button */}
					{/* TODO: Add auto-refresh toggle and interval selector */}
					<button className="market-refresh-button" onClick={handleRefresh}>
						<RotateCcw size={16} />
					</button>
				</div>
			</div>
			
			<div className="market-body">
				{/* Market Indices Section - Major Market Performance Indicators */}
				{/* TODO: Make indices configurable by user preferences */}
				<div className="market-indices-container">
					{/* S&P 500 Index Card */}
					<div className="market-index-card">
						<h3 className="market-index-title">S&P 500</h3>
						<div className="market-index-value">
							{loading ? (
								<span className="loading-text">
									<div className="loading-spinner"></div>
									Loading...
								</span>
							) : (
								<>
									{/* Current Index Value */}
									<span className="index-price">{marketIndices.sp500.price.toFixed(2)}</span>
									{/* Daily Change with Trend Indicator */}
									<span className={`index-change ${marketIndices.sp500.change >= 0 ? 'index-change-up' : 'index-change-down'}`}>
										{marketIndices.sp500.change >= 0 ? 
											<TrendingUp className="h-4 w-4 mr-1" /> : 
											<TrendingDown className="h-4 w-4 mr-1" />
										}
										{marketIndices.sp500.change >= 0 ? '+' : ''}{marketIndices.sp500.change.toFixed(2)}%
									</span>
								</>
							)}
						</div>
					</div>
					
					{/* Dow Jones Index Card */}
					<div className="market-index-card">
						<h3 className="market-index-title">Dow Jones</h3>
						<div className="market-index-value">
							{loading ? (
								<span className="loading-text">
									<div className="loading-spinner"></div>
									Loading...
								</span>
							) : (
								<>
									<span className="index-price">{marketIndices.dowJones.price.toFixed(2)}</span>
									<span className={`index-change ${marketIndices.dowJones.change >= 0 ? 'index-change-up' : 'index-change-down'}`}>
										{marketIndices.dowJones.change >= 0 ? 
											<TrendingUp className="h-4 w-4 mr-1" /> : 
											<TrendingDown className="h-4 w-4 mr-1" />
										}
										{marketIndices.dowJones.change >= 0 ? '+' : ''}{marketIndices.dowJones.change.toFixed(2)}%
									</span>
								</>
							)}
						</div>
					</div>
					
					{/* NASDAQ Index Card */}
					<div className="market-index-card">
						<h3 className="market-index-title">NASDAQ</h3>
						<div className="market-index-value">
							{loading ? (
								<span className="loading-text">
									<div className="loading-spinner"></div>
									Loading...
								</span>
							) : (
								<>
									<span className="index-price">{marketIndices.nasdaq.price.toFixed(2)}</span>
									<span className={`index-change ${marketIndices.nasdaq.change >= 0 ? 'index-change-up' : 'index-change-down'}`}>
										{marketIndices.nasdaq.change >= 0 ? 
											<TrendingUp className="h-4 w-4 mr-1" /> : 
											<TrendingDown className="h-4 w-4 mr-1" />
										}
										{marketIndices.nasdaq.change >= 0 ? '+' : ''}{marketIndices.nasdaq.change.toFixed(2)}%
									</span>
								</>
							)}
						</div>
					</div>
				</div>

				{/* Top Gainers Section - Best Performing Stocks */}
				{/* TODO: Add configurable time periods and number of results */}
				<div className="table-section">
					<div className="table-section-header">
						<h3 className="table-section-title">Top Gainers</h3>
						<div className="table-section-controls">
							{/* Time Period Selector */}
							{/* TODO: Implement functionality for different time periods */}
							<button className="table-section-button active">Day</button>
							<button className="table-section-button">Week</button>
						</div>
					</div>
					<div className="table-container">
						<table className="table">
							<thead className="table-header">
								<tr>
									{/* TODO: Add sorting functionality for each column */}
									<th className="table-header-cell">Symbol</th>
									<th className="table-header-cell">Name</th>
									<th className="table-header-cell">Price</th>
									<th className="table-header-cell">Change</th>
									<th className="table-header-cell">Actions</th>
								</tr>
							</thead>
							<tbody className="table-body">
								{loading ? (
									<tr>
										<td colSpan="5" className="loading-message">
											<div className="loading-spinner"></div>
											Loading market data...
										</td>
									</tr>
								) : (
									// Filter for positive changes, sort by highest percentage gain, limit to top 5
									// TODO: Make number of results configurable
									marketMovers
										.filter(stock => stock.changePercent > 0)
										.sort((a, b) => b.changePercent - a.changePercent)
										.slice(0, 5)
										.map((stock) => (
											<tr key={stock.symbol} className="table-row">
												{/* Stock Symbol and Company Name */}
												<td className="table-cell">
													<div className="symbol-cell">
														{/* TODO: Replace with actual company logos */}
														<div className="symbol-icon">{stock.symbol.charAt(0)}</div>
														<div className="symbol-text">
															{stock.symbol}
															<span className="symbol-name">{stock.name}</span>
														</div>
													</div>
												</td>
												
												{/* Full Company Name */}
												{/* TODO: Truncate long names with tooltip */}
												<td className="table-cell">{stock.name}</td>
												
												{/* Current Stock Price */}
												<td className="table-cell price-cell">${stock.price.toFixed(2)}</td>
												
												{/* Price Change Percentage */}
												<td className="table-cell">
													<div className="gain-loss-values">
														<div className="trend-up">
															<TrendingUp className="h-4 w-4" />
															+{stock.changePercent.toFixed(2)}%
														</div>
													</div>
												</td>
												
												{/* Action Buttons */}
												<td className="table-cell">
													<div style={{ display: 'flex', gap: '0.5rem' }}>
														{/* Trade Button - Opens Buy/Sell Modal */}
														{/* TODO: Add quick buy functionality with preset amounts */}
														<button
															className="btn-trade"
															onClick={() => openTradeModal(stock.symbol, 'BUY')}
														>
															Trade
														</button>
														{/* View Details Button */}
														{/* TODO: Add stock analysis and news in detailed view */}
														<button
															className="btn-view"
															onClick={() => handleSelectStock(stock.symbol)}
														>
															View
														</button>
													</div>
												</td>
											</tr>
										))
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Top Losers Section - Worst Performing Stocks */}
				{/* TODO: Consider adding "Biggest Movers" section for stocks with highest volume */}
				<div className="table-section">
					<div className="table-section-header">
						<h3 className="table-section-title">Top Losers</h3>
						<div className="table-section-controls">
							{/* Time Period Selector */}
							{/* TODO: Implement functionality for different time periods */}
							<button className="table-section-button active">Day</button>
							<button className="table-section-button">Week</button>
						</div>
					</div>
					<div className="table-container">
						<table className="table">
							<thead className="table-header">
								<tr>
									<th className="table-header-cell">Symbol</th>
									<th className="table-header-cell">Name</th>
									<th className="table-header-cell">Price</th>
									<th className="table-header-cell">Change</th>
									<th className="table-header-cell">Actions</th>
								</tr>
							</thead>
							<tbody className="table-body">
								{loading ? (
									<tr>
										<td colSpan="5" className="loading-message">
											<div className="loading-spinner"></div>
											Loading market data...
										</td>
									</tr>
								) : (
									// Filter for negative changes, sort by lowest percentage (biggest losses), limit to top 5
									// TODO: Add volume data to identify significant selloffs vs. low-volume declines
									marketMovers
										.filter(stock => stock.changePercent < 0)
										.sort((a, b) => a.changePercent - b.changePercent)
										.slice(0, 5)
										.map((stock) => (
											<tr key={stock.symbol} className="table-row">
												{/* Stock Symbol and Company Name */}
												<td className="table-cell">
													<div className="symbol-cell">
														<div className="symbol-icon">{stock.symbol.charAt(0)}</div>
														<div className="symbol-text">
															{stock.symbol}
															<span className="symbol-name">{stock.name}</span>
														</div>
													</div>
												</td>
												
												{/* Full Company Name */}
												<td className="table-cell">{stock.name}</td>
												
												{/* Current Stock Price */}
												<td className="table-cell price-cell">${stock.price.toFixed(2)}</td>
												
												{/* Price Change Percentage (Negative) */}
												<td className="table-cell">
													<div className="gain-loss-values">
														<div className="trend-down">
															<TrendingDown className="h-4 w-4" />
															{stock.changePercent.toFixed(2)}%
														</div>
													</div>
												</td>
												
												{/* Action Buttons */}
												<td className="table-cell">
													<div style={{ display: 'flex', gap: '0.5rem' }}>
														{/* Trade Button - Could be good buying opportunity */}
														{/* TODO: Add "Buy the Dip" quick action */}
														<button
															className="btn-trade"
															onClick={() => openTradeModal(stock.symbol, 'BUY')}
														>
															Trade
														</button>
														{/* View Details Button - Important for loss analysis */}
														{/* TODO: Add news integration to explain price drops */}
														<button
															className="btn-view"
															onClick={() => handleSelectStock(stock.symbol)}
														>
															View
														</button>
													</div>
												</td>
											</tr>
										))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MarketTab;