import React, { useState } from 'react';

export default function History({ recentTrades }) {
	// Local filter state
	const [filterType, setFilterType] = useState('all');
	const [filterDateRange, setFilterDateRange] = useState('all');
	const [filterSymbol, setFilterSymbol] = useState('');

	return (
		<div className="bg-white rounded-xl shadow-sm">
			<div className="p-6 border-b">
				<h2 className="text-lg font-semibold">Transaction History</h2>
			</div>
			<div className="p-6">
				{/* Filter controls */}
				<div className="flex flex-wrap items-center space-x-4 mb-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
						<select
							className="border rounded-lg px-3 py-2 w-32"
							value={filterType}
							onChange={(e) => setFilterType(e.target.value)}
						>
							<option value="all">All</option>
							<option value="buy">Buy</option>
							<option value="sell">Sell</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
						<select
							className="border rounded-lg px-3 py-2 w-40"
							value={filterDateRange}
							onChange={(e) => setFilterDateRange(e.target.value)}
						>
							<option value="all">All Time</option>
							<option value="1d">Last 24 Hours</option>
							<option value="7d">Last 7 Days</option>
							<option value="30d">Last 30 Days</option>
							<option value="90d">Last 90 Days</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
						<input
							type="text"
							className="border rounded-lg px-3 py-2 w-24"
							placeholder="e.g. AAPL"
							value={filterSymbol}
							onChange={(e) => setFilterSymbol(e.target.value)}
						/>
					</div>
				</div>

				{/* Transactions table */}
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{recentTrades.length > 0 ? (
								recentTrades.map((trade) => (
									<tr key={trade.id}>
										<td className="px-6 py-4 whitespace-nowrap">{trade.date}</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${trade.type === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
												}`}>
												{trade.type}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap font-medium">{trade.symbol}</td>
										<td className="px-6 py-4 whitespace-nowrap">{trade.name}</td>
										<td className="px-6 py-4 whitespace-nowrap">{trade.quantity}</td>
										<td className="px-6 py-4 whitespace-nowrap">${trade.price.toFixed(2)}</td>
										<td className="px-6 py-4 whitespace-nowrap">${(trade.quantity * trade.price).toFixed(2)}</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="inline-flex rounded-full bg-blue-100 text-blue-800 px-2 text-xs font-semibold leading-5">
												{trade.status}
											</span>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="8" className="px-6 py-4 text-center text-gray-500">
										No transactions found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}