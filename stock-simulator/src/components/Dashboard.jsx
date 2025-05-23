import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './styles/Dashboard.css';
import './styles/Tables.css';
import './styles/FilterSearch.css';

/**
 * Dashboard Component - Main overview page for the stock trading application
 * 
 * FUTURE DATA INTEGRATION NEEDS:
 * - Portfolio data should come from a database/API instead of props
 * - Real-time stock prices need WebSocket or frequent API polling
 * - Watchlist should be user-specific and stored in database
 * - Market movers should come from real market data APIs
 */
const DashboardTab = ({
	// TODO: Replace with API calls to user's portfolio endpoint
	portfolio,          // Array of user's stock holdings
	watchlist,          // Array of stocks user is watching
	marketMovers,       // Array of top performing stocks (should come from market data API)
	chartData,          // Historical data for charts (currently unused - implement later)
	selectedStock,      // Currently selected stock (for detailed view)
	openTradeModal,     // Function to open buy/sell modal
	handleSelectStock,  // Function to select a stock for detailed view
	
	// Financial summary props - these should come from backend calculations
	portfolioValue,     // Total value of all holdings
	totalGainLoss,      // Total profit/loss across portfolio
	gainLossPercent,    // Percentage gain/loss
	availableCash       // Available cash for trading
}) => {
	return (
		<div className="dashboard-container">
			{/* Dashboard Header */}
			<div className="dashboard-header">
				<h2 className="dashboard-title">
					<span className="dashboard-title-icon"><TrendingUp size={18} /></span>
					Dashboard Overview
				</h2>
			</div>
			
			<div className="dashboard-content">
				{/* Portfolio Summary Cards - Key Performance Indicators */}
				{/* TODO: These values should be calculated on the backend and cached for performance */}
				<div className="portfolio-summary-grid">
					{/* Portfolio Value Card */}
					<div className={`portfolio-summary-card ${totalGainLoss >= 0 ? 'gain' : 'loss'}`}>
						<h3 className="portfolio-summary-title">Portfolio Value</h3>
						{/* TODO: Add real-time updates - consider WebSocket for live pricing */}
						<div className="portfolio-summary-value">${portfolioValue.toFixed(2)}</div>
						<div className="portfolio-summary-subtitle">Total investment value</div>
					</div>

					{/* Gain/Loss Card */}
					<div className={`portfolio-summary-card ${totalGainLoss >= 0 ? 'gain' : 'loss'}`}>
						<h3 className="portfolio-summary-title">Total Gain/Loss</h3>
						<div className="portfolio-summary-value">
							<span className={totalGainLoss >= 0 ? 'portfolio-gain' : 'portfolio-loss'}>
								{totalGainLoss >= 0 ? '+' : ''}${Math.abs(totalGainLoss).toFixed(2)}
								<span className="percentage-badge gain">
									{gainLossPercent >= 0 ? '+' : ''}{gainLossPercent}%
								</span>
							</span>
						</div>
						<div className="portfolio-summary-subtitle">Overall performance</div>
					</div>

					{/* Available Cash Card */}
					<div className="portfolio-summary-card">
						<h3 className="portfolio-summary-title">Available Cash</h3>
						{/* TODO: Integrate with banking/payment API for real cash balance */}
						<div className="portfolio-summary-value">${availableCash.toFixed(2)}</div>
						<div className="portfolio-summary-subtitle">Ready to invest</div>
					</div>
				</div>

				{/* Holdings Section - User's Current Stock Positions */}
				<div className="holdings-section">
					<h3 className="section-title">
						<span className="section-title-icon">
							<TrendingUp size={20} />
						</span>
						Your Holdings
						<div className="section-title-actions">
							{/* TODO: Implement search functionality with backend filtering */}
							<div className="holdings-filter">
								<span className="holdings-filter-icon">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<circle cx="11" cy="11" r="8" />
										<line x1="21" y1="21" x2="16.65" y2="16.65" />
									</svg>
								</span>
								<input
									type="text"
									className="holdings-filter-input"
									placeholder="Search holdings..."
									// TODO: Add onChange handler to filter portfolio array
									// onChange={(e) => filterPortfolio(e.target.value)}
								/>
							</div>
						</div>
					</h3>
					
					{/* Holdings Table */}
					<div className="table-container">
						<table className="table">
							<thead className="table-header">
								<tr>
									{/* TODO: Add sorting functionality - click headers to sort by column */}
									<th className="table-header-cell">Symbol</th>
									<th className="table-header-cell">Price</th>
									<th className="table-header-cell">Shares</th>
									<th className="table-header-cell">Avg. Price</th>
									<th className="table-header-cell">Market Value</th>
									<th className="table-header-cell">Gain/Loss</th>
									<th className="table-header-cell">Change</th>
									<th className="table-header-cell">Actions</th>
								</tr>
							</thead>
							<tbody className="table-body">
								{portfolio.length > 0 ? (
									// Map through user's portfolio holdings
									portfolio.map((stock) => {
										// Calculate financial metrics for each holding
										// TODO: Move these calculations to backend for better performance
										const stockCost = stock.shares * stock.avgPrice;           // Total cost basis
										const stockValue = stock.shares * stock.currentPrice;      // Current market value
										const stockGainLoss = stockValue - stockCost;              // Unrealized gain/loss
										const stockGainLossPercent = ((stockValue / stockCost - 1) * 100).toFixed(2);
										const isGain = stockGainLoss >= 0;

										return (
											<tr key={stock.symbol}>
												{/* Stock Symbol and Name */}
												<td className="table-cell">
													<div className="symbol-cell">
														{/* TODO: Replace with actual company logos from API */}
														<div className="symbol-icon">{stock.symbol.charAt(0)}</div>
														<div className="symbol-text">
															{stock.symbol}
															{/* TODO: Get full company name from stock info API */}
															<span className="symbol-name">{stock.name}</span>
														</div>
													</div>
												</td>
												
												{/* Current Price - TODO: Real-time price updates */}
												<td className="table-cell price-cell">${stock.currentPrice.toFixed(2)}</td>
												
												{/* Number of Shares Owned */}
												<td className="table-cell amount-cell">{stock.shares}</td>
												
												{/* Average Purchase Price */}
												<td className="table-cell price-cell">${stock.avgPrice.toFixed(2)}</td>
												
												{/* Current Market Value */}
												<td className="table-cell price-cell">${stockValue.toFixed(2)}</td>
												
												{/* Gain/Loss Display */}
												<td className={`table-cell ${isGain ? 'gain-cell' : 'loss-cell'}`}>
													<div className="gain-loss-values">
														<span>${Math.abs(stockGainLoss).toFixed(2)}</span>
														<div className={`gain-loss-badge ${isGain ? 'gain-badge' : 'loss-badge'}`}>
															{isGain ? '+' : '-'}{Math.abs(stockGainLossPercent)}%
														</div>
													</div>
												</td>
												
												{/* Daily Change - TODO: Get from real market data */}
												<td className="table-cell">
													<div className={stock.change >= 0 ? 'trend-up' : 'trend-down'}>
														{stock.change >= 0 ?
															<TrendingUp className="trend-icon h-4 w-4" /> :
															<TrendingDown className="trend-icon h-4 w-4" />
														}
														{stock.change >= 0 ? '+' : ''}{stock.change}%
													</div>
												</td>
												
												{/* Action Buttons */}
												<td className="table-cell">
													<div style={{ display: 'flex', gap: '0.5rem' }}>
														{/* TODO: Add validation - check available cash before allowing buy */}
														<button
															className="action-button buy-button"
															onClick={() => openTradeModal(stock.symbol, 'BUY')}
														>
															Buy
														</button>
														{/* TODO: Add validation - check available shares before allowing sell */}
														<button
															className="action-button sell-button"
															onClick={() => openTradeModal(stock.symbol, 'SELL')}
														>
															Sell
														</button>
													</div>
												</td>
											</tr>
										);
									})
								) : (
									// Empty state when user has no holdings
									<tr>
										<td colSpan="8" className="empty-message">
											<span className="empty-icon"><TrendingDown size={48} /></span>
											No holdings found. Start building your portfolio!
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Watchlist Section - Stocks User is Monitoring */}
				{/* TODO: Make watchlist user-specific, store in database with user ID */}
				<div className="holdings-section">
					<h3 className="section-title">
						<span className="section-title-icon">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M12 20v-6M6 20V10M18 20V4" />
							</svg>
						</span>
						Watchlist
						{/* TODO: Add "Add to Watchlist" functionality */}
					</h3>
					<div className="table-container">
						<table className="table">
							<thead className="table-header">
								<tr>
									<th className="table-header-cell">Symbol</th>
									<th className="table-header-cell">Price</th>
									<th className="table-header-cell">Change</th>
									<th className="table-header-cell">Action</th>
								</tr>
							</thead>
							<tbody className="table-body">
								{watchlist.length > 0 ? (
									watchlist.map((stock) => (
										<tr key={stock.symbol}>
											<td className="table-cell">
												<div className="symbol-cell">
													<div className="symbol-icon">{stock.symbol.charAt(0)}</div>
													<div className="symbol-text">
														{stock.symbol}
														<span className="symbol-name">{stock.name}</span>
													</div>
												</div>
											</td>
											{/* TODO: Real-time price updates for watchlist items */}
											<td className="table-cell price-cell">${stock.price.toFixed(2)}</td>
											<td className="table-cell">
												<div className={stock.change >= 0 ? 'trend-up' : 'trend-down'}>
													{stock.change >= 0 ?
														<TrendingUp className="trend-icon h-4 w-4" /> :
														<TrendingDown className="trend-icon h-4 w-4" />
													}
													{stock.change >= 0 ? '+' : ''}{stock.change}%
												</div>
											</td>
											<td className="table-cell">
												{/* TODO: Add "Remove from Watchlist" option */}
												<button
													className="action-button buy-button"
													onClick={() => openTradeModal(stock.symbol, 'BUY')}
												>
													Trade
												</button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="4" className="empty-message">
											<span className="empty-icon"><TrendingDown size={48} /></span>
											No stocks in watchlist. Add stocks to track them!
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Market Movers Section - Top Performing Stocks */}
				{/* TODO: Replace with real market data from financial APIs (Alpha Vantage, Yahoo Finance, etc.) */}
				<div className="holdings-section">
					<h3 className="section-title">
						<span className="section-title-icon">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
							</svg>
						</span>
						Market Movers
						{/* TODO: Add time period selector (1D, 1W, 1M) */}
					</h3>
					<div className="table-container">
						<table className="table">
							<thead className="table-header">
								<tr>
									<th className="table-header-cell">Symbol</th>
									<th className="table-header-cell">Price</th>
									<th className="table-header-cell">Change</th>
									<th className="table-header-cell">Action</th>
								</tr>
							</thead>
							<tbody className="table-body">
								{marketMovers.length > 0 ? (
									// TODO: Sort by highest % change and limit to top 10
									marketMovers.map((stock) => (
										<tr key={stock.symbol}>
											<td className="table-cell">
												<div className="symbol-cell">
													<div className="symbol-icon">{stock.symbol.charAt(0)}</div>
													<div className="symbol-text">
														{stock.symbol}
														<span className="symbol-name">{stock.name}</span>
													</div>
												</div>
											</td>
											<td className="table-cell price-cell">${stock.price.toFixed(2)}</td>
											<td className="table-cell">
												<div className={stock.change >= 0 ? 'trend-up' : 'trend-down'}>
													{stock.change >= 0 ?
														<TrendingUp className="trend-icon h-4 w-4" /> :
														<TrendingDown className="trend-icon h-4 w-4" />
													}
													{stock.change >= 0 ? '+' : ''}{stock.change}%
												</div>
											</td>
											<td className="table-cell">
												<button
													className="action-button buy-button"
													onClick={() => openTradeModal(stock.symbol, 'BUY')}
												>
													Trade
												</button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="4" className="empty-message">
											<span className="empty-icon"><TrendingDown size={48} /></span>
											No market movers available.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardTab;