import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
				<div className="bg-white rounded-xl shadow-sm p-6">
					<h3 className="text-gray-500 text-sm font-medium mb-2">Portfolio Value</h3>
					<div className="flex items-end space-x-2">
						<span className="text-2xl font-bold">${portfolioValue.toFixed(2)}</span>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm p-6">
					<h3 className="text-gray-500 text-sm font-medium mb-2">Total Gain/Loss</h3>
					<div className="flex items-end space-x-2">
						<span className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
							{totalGainLoss >= 0 ? '+' : ''}${Math.abs(totalGainLoss).toFixed(2)}
						</span>
						<span className={`text-sm font-medium ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
							{gainLossPercent >= 0 ? '+' : ''}{gainLossPercent}%
						</span>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm p-6">
					<h3 className="text-gray-500 text-sm font-medium mb-2">Available Cash</h3>
					<div className="flex items-end space-x-2">
						<span className="text-2xl font-bold">${availableCash.toFixed(2)}</span>
					</div>
				</div>
			</div>

			{/* Stock Chart */}
			{chartData.length > 0 && (
				<div className="bg-white rounded-xl shadow-sm mb-6">
					<div className="p-6 border-b">
						<h2 className="text-lg font-semibold">
							Stock Performance {selectedStock && `- ${selectedStock.symbol}`}
						</h2>
					</div>
					<div className="p-4 h-64">
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
			<div className="bg-white rounded-xl shadow-sm mb-6">
				<div className="p-6 border-b">
					<h2 className="text-lg font-semibold">Your Holdings</h2>
				</div>
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Price</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Value</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{portfolio.length > 0 ? (
								portfolio.map((stock) => (
									<tr key={stock.symbol}>
										<td className="px-6 py-4 whitespace-nowrap font-medium">{stock.symbol}</td>
										<td className="px-6 py-4 whitespace-nowrap">{stock.name}</td>
										<td className="px-6 py-4 whitespace-nowrap">{stock.shares}</td>
										<td className="px-6 py-4 whitespace-nowrap">${stock.avgPrice.toFixed(2)}</td>
										<td className="px-6 py-4 whitespace-nowrap">${stock.currentPrice.toFixed(2)}</td>
										<td className={`px-6 py-4 whitespace-nowrap ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
											<div className="flex items-center">
												{stock.change >= 0 ?
													<TrendingUp className="h-4 w-4 mr-1" /> :
													<TrendingDown className="h-4 w-4 mr-1" />
												}
												{stock.change >= 0 ? '+' : ''}{stock.change}%
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											${(stock.shares * stock.currentPrice).toFixed(2)}
										</td>
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
								))
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

			{/* Watchlist and Market Movers */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white rounded-xl shadow-sm">
					<div className="p-6 border-b">
						<h2 className="text-lg font-semibold">Watchlist</h2>
					</div>
					<div className="p-4">
						<table className="min-w-full">
							<thead>
								<tr>
									<th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
									<th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
									<th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
									<th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
									<th className="pb-2 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
								</tr>
							</thead>
							<tbody>
								{watchlist.length > 0 ? (
									watchlist.map((stock) => (
										<tr key={stock.symbol} className="border-t">
											<td className="py-3 font-medium">{stock.symbol}</td>
											<td className="py-3">{stock.name}</td>
											<td className="py-3">${stock.price.toFixed(2)}</td>
											<td className={`py-3 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
												<div className="flex items-center">
													{stock.change >= 0 ?
														<TrendingUp className="h-4 w-4 mr-1" /> :
														<TrendingDown className="h-4 w-4 mr-1" />
													}
													{stock.change >= 0 ? '+' : ''}{stock.change}%
												</div>
											</td>
											<td className="py-3 text-right">
												<button
													className="bg-blue-100 text-blue-800 py-1 px-3 rounded-lg hover:bg-blue-200"
													onClick={() => openTradeModal(stock.symbol, 'BUY')}
												>
													Trade
												</button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="5" className="py-4 text-center text-gray-500 border-t">
											No stocks in watchlist. Add stocks to track them!
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm">
					<div className="p-6 border-b">
						<h2 className="text-lg font-semibold">Market Movers</h2>
					</div>
					<div className="p-4">
						<table className="min-w-full">
							<thead>
								<tr>
									<th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
									<th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
									<th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
									<th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
									<th className="pb-2 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
								</tr>
							</thead>
							<tbody>
								{marketMovers.length > 0 ? (
									marketMovers.map((stock) => (
										<tr key={stock.symbol} className="border-t">
											<td className="py-3 font-medium">{stock.symbol}</td>
											<td className="py-3">{stock.name}</td>
											<td className="py-3">${stock.price.toFixed(2)}</td>
											<td className={`py-3 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
												<div className="flex items-center">
													{stock.change >= 0 ?
														<TrendingUp className="h-4 w-4 mr-1" /> :
														<TrendingDown className="h-4 w-4 mr-1" />
													}
													{stock.change >= 0 ? '+' : ''}{stock.change}%
												</div>
											</td>
											<td className="py-3 text-right">
												<button
													className="bg-blue-100 text-blue-800 py-1 px-3 rounded-lg hover:bg-blue-200"
													onClick={() => openTradeModal(stock.symbol, 'BUY')}
												>
													Trade
												</button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="5" className="py-4 text-center text-gray-500 border-t">
											No market movers available.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
};

export default DashboardTab;