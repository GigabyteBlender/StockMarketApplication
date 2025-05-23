import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './styles/Portfolio.css';
import './styles/Tables.css';
import './styles/FilterSearch.css';

/**
 * Portfolio Component - Comprehensive portfolio management and analysis view
 * 
 * FUTURE DATA INTEGRATION NEEDS:
 * - Historical portfolio performance data from database/API
 * - Real-time portfolio value updates via WebSocket
 * - Advanced analytics: Sharpe ratio, beta, diversification metrics
 * - Portfolio rebalancing recommendations and alerts
 * - Tax-loss harvesting suggestions and reporting
 * - Integration with external brokerages for consolidated view
 * - Risk assessment and portfolio optimization tools
 */
const PortfolioTab = ({
	// Core portfolio data - should come from user's account API
	portfolio,        // Array of user's current stock holdings
	openTradeModal,   // Function to open buy/sell trading modal
	portfolioValue,   // Total current market value of all holdings
	availableCash     // Available cash balance for new investments
}) => {
	return (
		<div className="portfolio-container">
			{/* Portfolio Header */}
			<div className="portfolio-header">
				<h2 className="portfolio-title">
					<span className="portfolio-title-icon"><TrendingUp size={18} /></span>
					Portfolio Management
				</h2>
			</div>
			
			<div className="portfolio-content">
				{/* Portfolio Performance Chart Section */}
				{/* TODO: Replace with real historical data from database */}
				<div className="performance-section">
					<h3 className="section-title">
						Performance Overview
						<div className="section-title-actions">
							{/* Time Period Selector Buttons */}
							{/* TODO: Implement actual time period filtering functionality */}
							<button className="section-title-button active">1M</button>
							<button className="section-title-button">3M</button>
							<button className="section-title-button">YTD</button>
							<button className="section-title-button">1Y</button>
							<button className="section-title-button">All</button>
						</div>
					</h3>
					
					{/* Performance Chart Container */}
					<div className="chart-container">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart
								// TODO: Replace with actual historical portfolio data from API
								// This should track total portfolio value over time
								data={[
									{ date: '2025-01-01', value: 10000 },
									{ date: '2025-01-15', value: 10250 },
									{ date: '2025-02-01', value: 10450 },
									{ date: '2025-02-15', value: 10300 },
									{ date: '2025-03-01', value: 10600 },
									{ date: '2025-03-15', value: 10800 },
									{ date: '2025-04-01', value: 11200 },
									{ date: '2025-04-15', value: 11500 },
									{ date: '2025-04-30', value: portfolioValue + availableCash }
								]}
								margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
							>
								{/* Chart Grid and Axes */}
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis
									dataKey="date"
									tick={{ fontSize: 12 }}
									// Format date display to show month/day
									tickFormatter={(value) => {
										const date = new Date(value);
										return `${date.getMonth() + 1}/${date.getDate()}`;
									}}
								/>
								<YAxis />
								{/* Interactive Tooltip */}
								<Tooltip
									formatter={(value) => [`$${value.toFixed(2)}`, "Total Value"]}
									labelFormatter={(label) => `Date: ${label}`}
								/>
								{/* Portfolio Value Line */}
								{/* TODO: Add benchmark comparison line (S&P 500, etc.) */}
								<Line
									type="monotone"
									dataKey="value"
									stroke="#3b82f6"
									strokeWidth={2}
									dot={true}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Asset Allocation Section - Portfolio Composition Overview */}
				{/* TODO: Add more asset classes (bonds, crypto, real estate, etc.) */}
				<div className="allocation-section">
					<h3 className="section-title">Asset Allocation</h3>
					<div className="allocation-grid">
						{/* Stocks Allocation Card */}
						<div className="allocation-card">
							<h4 className="allocation-card-title">
								<span className="allocation-card-icon"><TrendingUp size={16} /></span>
								Stocks
							</h4>
							{/* Current value of all stock holdings */}
							<p className="allocation-value">${portfolioValue.toFixed(2)}</p>
							{/* Percentage of total portfolio */}
							<p className="allocation-percent">
								{((portfolioValue / (portfolioValue + availableCash)) * 100).toFixed(2)}% of portfolio
							</p>
						</div>
						
						{/* Cash Allocation Card */}
						<div className="allocation-card">
							<h4 className="allocation-card-title">
								<span className="allocation-card-icon"><TrendingDown size={16} /></span>
								Cash
							</h4>
							{/* Available cash for investing */}
							<p className="allocation-value">${availableCash.toFixed(2)}</p>
							{/* Cash percentage of total portfolio */}
							<p className="allocation-percent">
								{((availableCash / (portfolioValue + availableCash)) * 100).toFixed(2)}% of portfolio
							</p>
						</div>
						
						{/* Total Assets Card */}
						<div className="allocation-card">
							<h4 className="allocation-card-title">
								<span className="allocation-card-icon"><TrendingUp size={16} /></span>
								Total Assets
							</h4>
							{/* Combined value of stocks and cash */}
							<p className="allocation-value">${(portfolioValue + availableCash).toFixed(2)}</p>
							<p className="allocation-percent">100% of portfolio</p>
						</div>
					</div>
				</div>

				{/* Detailed Holdings Table Section */}
				{/* TODO: Add portfolio analytics like beta, correlation, sector allocation */}
				<div className="holdings-section">
					<h3 className="section-title">
						<span className="section-title-icon">
							<TrendingUp size={20} />
						</span>
						Holdings Detail
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
					<div className="table-container">
						<table className="table">
							<thead className="table-header">
								<tr>
									{/* TODO: Add sorting functionality for all columns */}
									<th className="table-header-cell">Symbol</th>
									<th className="table-header-cell">Price</th>
									<th className="table-header-cell">Shares</th>
									<th className="table-header-cell">Cost Basis</th>
									<th className="table-header-cell">Current Value</th>
									<th className="table-header-cell">Gain/Loss</th>
									<th className="table-header-cell">Allocation</th>
									<th className="table-header-cell">Actions</th>
								</tr>
							</thead>
							<tbody className="table-body">
								{portfolio.length > 0 ? (
									// Map through each stock holding in the portfolio
									portfolio.map((stock) => {
										// Calculate key financial metrics for each position
										// TODO: Move these calculations to backend for better performance
										const stockCost = stock.shares * stock.avgPrice;           // Total amount invested
										const stockValue = stock.shares * stock.currentPrice;      // Current market value
										const stockGainLoss = stockValue - stockCost;              // Unrealized gain/loss
										const stockGainLossPercent = ((stockValue / stockCost - 1) * 100).toFixed(2);
										const allocation = ((stockValue / portfolioValue) * 100).toFixed(2); // Portfolio allocation %
										const isGain = stockGainLoss >= 0;

										return (
											<tr key={stock.symbol} className="table-row">
												{/* Stock Symbol and Company Name */}
												<td className="table-cell">
													<div className="symbol-cell">
														{/* TODO: Replace with actual company logos from API */}
														<div className="symbol-icon">{stock.symbol.charAt(0)}</div>
														<div className="symbol-text">
															{stock.symbol}
															{/* TODO: Get full company name from stock API */}
															<span className="symbol-name">{stock.name}</span>
														</div>
													</div>
												</td>
												
												{/* Current Market Price */}
												{/* TODO: Add real-time price updates */}
												<td className="table-cell price-cell">${stock.currentPrice.toFixed(2)}</td>
												
												{/* Number of Shares Owned */}
												<td className="table-cell amount-cell">{stock.shares}</td>
												
												{/* Total Cost Basis (Original Investment) */}
												<td className="table-cell price-cell">${stockCost.toFixed(2)}</td>
												
												{/* Current Market Value */}
												<td className="table-cell price-cell">${stockValue.toFixed(2)}</td>
												
												{/* Unrealized Gain/Loss Display */}
												<td className={`table-cell ${isGain ? 'gain-cell' : 'loss-cell'}`}>
													<div className="gain-loss-values">
														{/* Dollar amount of gain/loss */}
														<span>${Math.abs(stockGainLoss).toFixed(2)}</span>
														{/* Percentage gain/loss badge */}
														<div className={`gain-loss-badge ${isGain ? 'gain-badge' : 'loss-badge'}`}>
															{isGain ? '+' : '-'}{Math.abs(stockGainLossPercent)}%
														</div>
													</div>
												</td>
												
												{/* Portfolio Allocation Percentage */}
												{/* TODO: Add color coding for concentration risk (>10% in single stock) */}
												<td className="table-cell">{allocation}%</td>
												
												{/* Trading Action Buttons */}
												<td className="table-cell">
													<div style={{ display: 'flex', gap: '0.5rem' }}>
														{/* Buy More Shares Button */}
														{/* TODO: Add validation for available cash */}
														<button
															className="action-button buy-button"
															onClick={() => openTradeModal(stock.symbol, 'BUY')}
														>
															Buy
														</button>
														{/* Sell Shares Button */}
														{/* TODO: Add partial sell options (25%, 50%, 75%, 100%) */}
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
									// Empty state when user has no portfolio holdings
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
			</div>
		</div>
	);
};

export default PortfolioTab;