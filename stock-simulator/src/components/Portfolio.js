import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PortfolioTab = ({
	portfolio,
	openTradeModal,
	portfolioValue,
	availableCash
}) => {
	return (
		<div className="bg-white rounded-xl shadow-sm">
			<div className="p-6 border-b">
				<h2 className="text-lg font-semibold">Portfolio Management</h2>
			</div>
			<div className="p-6">
				{/* Portfolio Performance Chart */}
				<div className="mb-6">
					<h3 className="text-md font-medium mb-3">Performance Overview</h3>
					<div className="bg-gray-50 p-4 rounded-lg h-64">
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
				<div className="mb-6">
					<h3 className="text-md font-medium mb-3">Asset Allocation</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="bg-gray-50 p-4 rounded-lg">
							<h4 className="text-sm text-gray-500 mb-1">Stocks</h4>
							<p className="text-xl font-semibold">${portfolioValue.toFixed(2)}</p>
							<p className="text-sm text-gray-500">{((portfolioValue / (portfolioValue + availableCash)) * 100).toFixed(2)}% of portfolio</p>
						</div>
						<div className="bg-gray-50 p-4 rounded-lg">
							<h4 className="text-sm text-gray-500 mb-1">Cash</h4>
							<p className="text-xl font-semibold">${availableCash.toFixed(2)}</p>
							<p className="text-sm text-gray-500">{((availableCash / (portfolioValue + availableCash)) * 100).toFixed(2)}% of portfolio</p>
						</div>
						<div className="bg-gray-50 p-4 rounded-lg">
							<h4 className="text-sm text-gray-500 mb-1">Total Assets</h4>
							<p className="text-xl font-semibold">${(portfolioValue + availableCash).toFixed(2)}</p>
							<p className="text-sm text-gray-500">100% of portfolio</p>
						</div>
					</div>
				</div>

				{/* Detailed Holdings Table */}
				<div>
					<h3 className="text-md font-medium mb-3">Holdings Detail</h3>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Basis</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gain/Loss</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{portfolio.length > 0 ? (
									portfolio.map((stock) => {
										const stockCost = stock.shares * stock.avgPrice;
										const stockValue = stock.shares * stock.currentPrice;
										const stockGainLoss = stockValue - stockCost;
										const stockGainLossPercent = ((stockValue / stockCost - 1) * 100).toFixed(2);
										const allocation = ((stockValue / portfolioValue) * 100).toFixed(2);

										return (
											<tr key={stock.symbol}>
												<td className="px-6 py-4 whitespace-nowrap font-medium">{stock.symbol}</td>
												<td className="px-6 py-4 whitespace-nowrap">{stock.name}</td>
												<td className="px-6 py-4 whitespace-nowrap">{stock.shares}</td>
												<td className="px-6 py-4 whitespace-nowrap">${stockCost.toFixed(2)}</td>
												<td className="px-6 py-4 whitespace-nowrap">${stockValue.toFixed(2)}</td>
												<td className={`px-6 py-4 whitespace-nowrap ${stockGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
													<div className="flex flex-col">
														<span>${stockGainLoss.toFixed(2)}</span>
														<span className="text-xs">
															{stockGainLossPercent >= 0 ? '+' : ''}{stockGainLossPercent}%
														</span>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">{allocation}%</td>
												<td className="px-6 py-4 whitespace-nowrap text-right">
													<div className="flex justify-end space-x-2">
														<button
															className="bg-green-100 text-green-800 py-1 px-3 rounded-lg hover:bg-green-200"
															onClick={() => openTradeModal(stock.symbol, 'BUY')}
														>
															Buy
														</button>
														<button
															className="bg-red-100 text-red-800 py-1 px-3 rounded-lg hover:bg-red-200"
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
										<td colSpan="8" className="px-6 py-4 text-center text-gray-500">
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