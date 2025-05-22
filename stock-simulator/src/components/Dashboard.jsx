import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './styles/Dashboard.css';

const DashboardTab = ({
	portfolio,
	watchlist,
	marketMovers,
	chartData,
	selectedStock,
	openTradeModal,
	handleSelectStock,
	portfolioValue,
	totalGainLoss,
	gainLossPercent,
	availableCash
}) => {
	return (
		<>
			{/* Portfolio Summary */}
			<div className="portfolio-summary-grid">
				<div className={`portfolio-summary-card ${totalGainLoss >= 0 ? 'gain' : 'loss'}`}>
					<h3 className="portfolio-summary-title">Portfolio Value</h3>
					<div className="portfolio-summary-value">${portfolioValue.toFixed(2)}</div>
					<div className="portfolio-summary-subtitle">Total investment value</div>
				</div>

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

				<div className="portfolio-summary-card">
					<h3 className="portfolio-summary-title">Available Cash</h3>
					<div className="portfolio-summary-value">${availableCash.toFixed(2)}</div>
					<div className="portfolio-summary-subtitle">Ready to invest</div>
				</div>
			</div>

			{/* Stock Chart */}
			{chartData.length > 0 && (
				<div className="stock-chart-container">
					<div className="stock-chart-header">
						<h2 className="stock-chart-title">
							Stock Performance {selectedStock && `- ${selectedStock.symbol}`}
						</h2>
						<div className="chart-period-selector">
							<button className="chart-period-button active">1D</button>
							<button className="chart-period-button">1W</button>
							<button className="chart-period-button">1M</button>
							<button className="chart-period-button">3M</button>
							<button className="chart-period-button">1Y</button>
						</div>
					</div>
					<div className="stock-chart-body">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart
								data={chartData}
								margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis
									dataKey="date"
									tick={{ fontSize: 12 }}
									tickFormatter={(value) => {
										const date = new Date(value);
										return `${date.getMonth() + 1}/${date.getDate()}`;
									}}
								/>
								<YAxis />
								<Tooltip
									formatter={(value) => [`$${value.toFixed(2)}`, "Price"]}
									labelFormatter={(label) => `Date: ${label}`}
								/>
								<Line
									type="monotone"
									dataKey="close"
									stroke="#3b82f6"
									strokeWidth={2}
									dot={false}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
			)}

			{/* Holdings */}
			<div className="holdings-container">
				<div className="holdings-header">
					<h2 className="holdings-title">
						<span className="holdings-title-icon">
							<TrendingUp className="h-5 w-5" />
						</span>
						Your Holdings
					</h2>
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
						/>
					</div>
				</div>
				<div className="holdings-table-container">
					<table className="holdings-table">
						<thead className="table-header">
							<tr>
								<th className="table-heading">Symbol</th>
								<th className="table-heading">Price</th>
								<th className="table-heading">Shares</th>
								<th className="table-heading">Avg. Price</th>
								<th className="table-heading">Market Value</th>
								<th className="table-heading">Gain/Loss</th>
								<th className="table-heading">Change</th>
								<th className="table-heading">Actions</th>
							</tr>
						</thead>
						<tbody className="table-body">
							{portfolio.length > 0 ? (
								portfolio.map((stock) => {
									const stockCost = stock.shares * stock.avgPrice;
									const stockValue = stock.shares * stock.currentPrice;
									const stockGainLoss = stockValue - stockCost;
									const stockGainLossPercent = ((stockValue / stockCost - 1) * 100).toFixed(2);
									const isGain = stockGainLoss >= 0;

									return (
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
											<td className="table-cell price-cell">${stock.currentPrice.toFixed(2)}</td>
											<td className="table-cell amount-cell">{stock.shares}</td>
											<td className="table-cell price-cell">${stock.avgPrice.toFixed(2)}</td>
											<td className="table-cell price-cell">${stockValue.toFixed(2)}</td>
											<td className={`table-cell ${isGain ? 'gain-cell' : 'loss-cell'}`}>
												<div className="gain-loss-values">
													<span>${Math.abs(stockGainLoss).toFixed(2)}</span>
													<div className={`gain-loss-badge ${isGain ? 'gain-badge' : 'loss-badge'}`}>
														{isGain ? '+' : '-'}{Math.abs(stockGainLossPercent)}%
													</div>
												</div>
											</td>
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
												<div style={{ display: 'flex', gap: '0.5rem' }}>
													<button
														className="action-button buy-button"
														onClick={() => openTradeModal(stock.symbol, 'BUY')}
													>
														Buy
													</button>
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

			{/* Watchlist and Market Movers */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="panel-container">
					<div className="panel-header">
						<h2 className="panel-title">
							<span className="panel-title-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M12 20v-6M6 20V10M18 20V4" />
								</svg>
							</span>
							Watchlist
						</h2>
					</div>
					<div className="panel-body">
						<div className="holdings-table-container">
							<table className="holdings-table">
								<thead className="table-header">
									<tr>
										<th className="table-heading">Symbol</th>
										<th className="table-heading">Price</th>
										<th className="table-heading">Change</th>
										<th className="table-heading">Action</th>
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
												No stocks in watchlist. Add stocks to track them!
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<div className="panel-container">
					<div className="panel-header">
						<h2 className="panel-title">
							<span className="panel-title-icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
								</svg>
							</span>
							Market Movers
						</h2>
					</div>
					<div className="panel-body">
						<div className="holdings-table-container">
							<table className="holdings-table">
								<thead className="table-header">
									<tr>
										<th className="table-heading">Symbol</th>
										<th className="table-heading">Price</th>
										<th className="table-heading">Change</th>
										<th className="table-heading">Action</th>
									</tr>
								</thead>
								<tbody className="table-body">
									{marketMovers.length > 0 ? (
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
		</>
	);
};

export default DashboardTab;