import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './styles/Portfolio.css';

const PortfolioTab = ({
	portfolio,
	openTradeModal,
	portfolioValue,
	availableCash
}) => {
	return (
		<div className="portfolio-container">
			<div className="portfolio-header">
				<h2 className="portfolio-title">
					<span className="portfolio-title-icon"><TrendingUp size={18} /></span>
					Portfolio Management
				</h2>
			</div>
			<div className="portfolio-content">
				{/* Portfolio Performance Chart */}
				<div className="performance-section">
					<h3 className="section-title">
						Performance Overview
						<div className="section-title-actions">
							<button className="section-title-button active">1M</button>
							<button className="section-title-button">3M</button>
							<button className="section-title-button">YTD</button>
							<button className="section-title-button">1Y</button>
							<button className="section-title-button">All</button>
						</div>
					</h3>
					<div className="chart-container">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart
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
									formatter={(value) => [`$${value.toFixed(2)}`, "Total Value"]}
									labelFormatter={(label) => `Date: ${label}`}
								/>
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

				{/* Allocation Breakdown */}
				<div className="allocation-section">
					<h3 className="section-title">Asset Allocation</h3>
					<div className="allocation-grid">
						<div className="allocation-card">
							<h4 className="allocation-card-title">
								<span className="allocation-card-icon"><TrendingUp size={16} /></span>
								Stocks
							</h4>
							<p className="allocation-value">${portfolioValue.toFixed(2)}</p>
							<p className="allocation-percent">{((portfolioValue / (portfolioValue + availableCash)) * 100).toFixed(2)}% of portfolio</p>
						</div>
						<div className="allocation-card">
							<h4 className="allocation-card-title">
								<span className="allocation-card-icon"><TrendingDown size={16} /></span>
								Cash
							</h4>
							<p className="allocation-value">${availableCash.toFixed(2)}</p>
							<p className="allocation-percent">{((availableCash / (portfolioValue + availableCash)) * 100).toFixed(2)}% of portfolio</p>
						</div>
						<div className="allocation-card">
							<h4 className="allocation-card-title">
								<span className="allocation-card-icon"><TrendingUp size={16} /></span>
								Total Assets
							</h4>
							<p className="allocation-value">${(portfolioValue + availableCash).toFixed(2)}</p>
							<p className="allocation-percent">100% of portfolio</p>
						</div>
					</div>
				</div>

				{/* Detailed Holdings Table */}
				<div className="holdings-section">
					<h3 className="section-title">Holdings Detail</h3>
					<div className="holdings-table-container">
						<table className="holdings-table">
							<thead className="table-header">
								<tr>
									<th className="table-heading">Symbol</th>
									<th className="table-heading">Price</th>
									<th className="table-heading">Shares</th>
									<th className="table-heading">Cost Basis</th>
									<th className="table-heading">Current Value</th>
									<th className="table-heading">Gain/Loss</th>
									<th className="table-heading">Allocation</th>
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
										const allocation = ((stockValue / portfolioValue) * 100).toFixed(2);
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
												<td className="table-cell price-cell">${stockCost.toFixed(2)}</td>
												<td className="table-cell price-cell">${stockValue.toFixed(2)}</td>
												<td className={`table-cell ${isGain ? 'gain-cell' : 'loss-cell'}`}>
													<div className="gain-loss-values">
														<span>${Math.abs(stockGainLoss).toFixed(2)}</span>
														<div className={`gain-loss-badge ${isGain ? 'gain-badge' : 'loss-badge'}`}>
															{isGain ? '+' : '-'}{Math.abs(stockGainLossPercent)}%
														</div>
													</div>
												</td>
												<td className="table-cell">{allocation}%</td>
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
			</div>
		</div>
	);
};

export default PortfolioTab;