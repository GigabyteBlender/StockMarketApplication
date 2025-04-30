import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, PieChart, Clock, Briefcase, Search, X } from 'lucide-react';
import {
	fetchPortfolio,
	fetchWatchlist,
	fetchMarketMovers,
	fetchTransactionHistory,
	fetchStockPrice,
	fetchTimeSeriesData
} from '../services/stockService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

	return (
		<div className="flex flex-col h-screen bg-gray-100 text-gray-800">
			{/* Header */}
			<header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
				<div className="flex items-center space-x-2">
					<TrendingUp className="text-blue-600" />
					<h1 className="text-xl font-bold">Stock Simulator</h1>
				</div>
				<div className="flex items-center space-x-4">
					<div className="relative">
						<input
							type="text"
							placeholder="Search for stocks..."
							className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onKeyPress={handleSearchKeyPress}
						/>
						<Search
							className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
							onClick={handleSearch}
						/>

						{/* Search Results Dropdown */}
						{showSearchResults && searchResults.length > 0 && (
							<div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10">
								{searchResults.map((result) => (
									<div
										key={result.symbol}
										className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
										onClick={() => handleSelectStock(result.symbol)}
									>
										<div>
											<div className="font-medium">{result.symbol}</div>
											<div className="text-sm text-gray-500">${result.price}</div>
										</div>
										<div className={`${result.change >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
											{result.change >= 0 ?
												<TrendingUp className="h-4 w-4 mr-1" /> :
												<TrendingDown className="h-4 w-4 mr-1" />
											}
											{result.change >= 0 ? '+' : ''}{result.changePercent}%
										</div>
									</div>
								))}
							</div>
						)}
					</div>
					<div className="bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-lg">
						Balance: ${availableCash.toFixed(2)}
					</div>
				</div>
			</header>

			{/* Main content */}
			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar */}
				<aside className="w-64 bg-white shadow-sm p-4">
					<nav className="space-y-1">
						<button
							className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
							onClick={() => setActiveTab('dashboard')}
						>
							<PieChart size={20} />
							<span className="font-medium">Dashboard</span>
						</button>

						<button
							className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg ${activeTab === 'portfolio' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
							onClick={() => setActiveTab('portfolio')}
						>
							<Briefcase size={20} />
							<span className="font-medium">Portfolio</span>
						</button>

						<button
							className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg ${activeTab === 'market' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
							onClick={() => setActiveTab('market')}
						>
							<TrendingUp size={20} />
							<span className="font-medium">Market</span>
						</button>

						<button
							className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg ${activeTab === 'history' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
							onClick={() => setActiveTab('history')}
						>
							<Clock size={20} />
							<span className="font-medium">History</span>
						</button>
					</nav>
				</aside>

				{/* Main content area */}
				<main className="flex-1 p-6 overflow-auto">
					{activeTab === 'dashboard' && (
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
// Continuing from where the file left off:

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
					)}

					{activeTab === 'portfolio' && (
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
					)}

					{activeTab === 'market' && (
						<div className="bg-white rounded-xl shadow-sm">
							<div className="p-6 border-b">
								<h2 className="text-lg font-semibold">Market Overview</h2>
							</div>
							<div className="p-6">
								{/* Market summary */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
									<div className="bg-gray-50 p-4 rounded-lg">
										<h3 className="text-sm text-gray-500 mb-1">S&P 500</h3>
										<div className="flex items-center">
											<span className="text-xl font-semibold mr-2">5,304.12</span>
											<span className="text-green-600 flex items-center text-sm">
												<TrendingUp className="h-4 w-4 mr-1" />
												+0.87%
											</span>
										</div>
									</div>
									<div className="bg-gray-50 p-4 rounded-lg">
										<h3 className="text-sm text-gray-500 mb-1">Dow Jones</h3>
										<div className="flex items-center">
											<span className="text-xl font-semibold mr-2">39,651.87</span>
											<span className="text-green-600 flex items-center text-sm">
												<TrendingUp className="h-4 w-4 mr-1" />
												+0.56%
											</span>
										</div>
									</div>
									<div className="bg-gray-50 p-4 rounded-lg">
										<h3 className="text-sm text-gray-500 mb-1">NASDAQ</h3>
										<div className="flex items-center">
											<span className="text-xl font-semibold mr-2">16,802.36</span>
											<span className="text-red-600 flex items-center text-sm">
												<TrendingDown className="h-4 w-4 mr-1" />
												-0.22%
											</span>
										</div>
									</div>
								</div>

								{/* Top Gainers */}
								<div className="mb-6">
									<h3 className="text-md font-medium mb-3">Top Gainers</h3>
									<div className="overflow-x-auto">
										<table className="min-w-full divide-y divide-gray-200">
											<thead className="bg-gray-50">
												<tr>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
													<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
												</tr>
											</thead>
											<tbody className="bg-white divide-y divide-gray-200">
												{marketMovers
													.filter(stock => stock.change > 0)
													.sort((a, b) => b.change - a.change)
													.slice(0, 5)
													.map((stock) => (
														<tr key={stock.symbol}>
															<td className="px-6 py-4 whitespace-nowrap font-medium">{stock.symbol}</td>
															<td className="px-6 py-4 whitespace-nowrap">{stock.name}</td>
															<td className="px-6 py-4 whitespace-nowrap">${stock.price.toFixed(2)}</td>
															<td className="px-6 py-4 whitespace-nowrap text-green-600">
																<div className="flex items-center">
																	<TrendingUp className="h-4 w-4 mr-1" />
																	+{stock.change}%
																</div>
															</td>
															<td className="px-6 py-4 whitespace-nowrap text-right">
																<div className="flex justify-end space-x-2">
																	<button
																		className="bg-blue-100 text-blue-800 py-1 px-3 rounded-lg hover:bg-blue-200"
																		onClick={() => openTradeModal(stock.symbol, 'BUY')}
																	>
																		Trade
																	</button>
																	<button
																		className="bg-gray-100 text-gray-800 py-1 px-3 rounded-lg hover:bg-gray-200"
																		onClick={() => handleSelectStock(stock.symbol)}
																	>
																		View
																	</button>
																</div>
															</td>
														</tr>
													))}
											</tbody>
										</table>
									</div>
								</div>

								{/* Top Losers */}
								<div>
									<h3 className="text-md font-medium mb-3">Top Losers</h3>
									<div className="overflow-x-auto">
										<table className="min-w-full divide-y divide-gray-200">
											<thead className="bg-gray-50">
												<tr>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
													<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
												</tr>
											</thead>
											<tbody className="bg-white divide-y divide-gray-200">
												{marketMovers
													.filter(stock => stock.change < 0)
													.sort((a, b) => a.change - b.change)
													.slice(0, 5)
													.map((stock) => (
														<tr key={stock.symbol}>
															<td className="px-6 py-4 whitespace-nowrap font-medium">{stock.symbol}</td>
															<td className="px-6 py-4 whitespace-nowrap">{stock.name}</td>
															<td className="px-6 py-4 whitespace-nowrap">${stock.price.toFixed(2)}</td>
															<td className="px-6 py-4 whitespace-nowrap text-red-600">
																<div className="flex items-center">
																	<TrendingDown className="h-4 w-4 mr-1" />
																	{stock.change}%
																</div>
															</td>
															<td className="px-6 py-4 whitespace-nowrap text-right">
																<div className="flex justify-end space-x-2">
																	<button
																		className="bg-blue-100 text-blue-800 py-1 px-3 rounded-lg hover:bg-blue-200"
																		onClick={() => openTradeModal(stock.symbol, 'BUY')}
																	>
																		Trade
																	</button>
																	<button
																		className="bg-gray-100 text-gray-800 py-1 px-3 rounded-lg hover:bg-gray-200"
																		onClick={() => handleSelectStock(stock.symbol)}
																	>
																		View
																	</button>
																</div>
															</td>
														</tr>
													))}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'history' && (
						<div className="bg-white rounded-xl shadow-sm">
							<div className="p-6 border-b">
								<h2 className="text-lg font-semibold">Transaction History</h2>
							</div>
							<div className="p-6">
								{/* Filter controls */}
								<div className="flex flex-wrap items-center space-x-4 mb-6">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
										<select className="border rounded-lg px-3 py-2 w-32">
											<option value="all">All</option>
											<option value="buy">Buy</option>
											<option value="sell">Sell</option>
										</select>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
										<select className="border rounded-lg px-3 py-2 w-40">
											<option value="all">All Time</option>
											<option value="1d">Last 24 Hours</option>
											<option value="7d">Last 7 Days</option>
											<option value="30d">Last 30 Days</option>
											<option value="90d">Last 90 Days</option>
										</select>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
										<input type="text" className="border rounded-lg px-3 py-2 w-24" placeholder="e.g. AAPL" />
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
					)}
				</main>
			</div>

			{/* Trade Modal */}
			{isTradeModalOpen && selectedStock && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-xl shadow-xl max-w-md w-full">
						<div className="p-6 border-b flex justify-between items-center">
							<h2 className="text-lg font-semibold">
								{tradeAction === 'BUY' ? 'Buy' : 'Sell'} {selectedStock.symbol}
							</h2>
							<button
								onClick={closeTradeModal}
								className="text-gray-500 hover:text-gray-700"
							>
								<X size={20} />
							</button>
						</div>
						<div className="p-6">
							<div className="flex justify-between items-center mb-6">
								<div className="text-center w-1/3">
									<p className="text-sm text-gray-500 mb-1">Current Price</p>
									<p className="text-lg font-semibold">${selectedStock.price?.toFixed(2) || '0.00'}</p>
								</div>
								<div className="text-center w-1/3">
									<p className="text-sm text-gray-500 mb-1">Available Cash</p>
									<p className="text-lg font-semibold">${availableCash.toFixed(2)}</p>
								</div>
								<div className="text-center w-1/3">
									<p className="text-sm text-gray-500 mb-1">Available Shares</p>
									<p className="text-lg font-semibold">
										{
											portfolio.find(stock => stock.symbol === selectedStock.symbol)?.shares || 0
										}
									</p>
								</div>
							</div>

							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
								<div className="flex items-center">
									<button
										onClick={() => updateTradeQuantity(-1)}
										className="border border-r-0 rounded-l-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
									>
										-
									</button>
									<input
										type="number"
										value={tradeQuantity}
										onChange={(e) => setTradeQuantity(Math.max(1, parseInt(e.target.value) || 1))}
										className="border text-center py-2 px-4 w-20"
										min="1"
									/>
									<button
										onClick={() => updateTradeQuantity(1)}
										className="border border-l-0 rounded-r-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
									>
										+
									</button>
								</div>
							</div>

							<div className="mb-6">
								<div className="flex justify-between items-center mb-1">
									<p className="text-sm text-gray-500">Estimated Total</p>
									<p className="text-lg font-semibold">${(tradeQuantity * (selectedStock.price || 0)).toFixed(2)}</p>
								</div>
								{tradeAction === 'BUY' && (
									<div className="text-sm text-gray-500">
										{tradeQuantity * (selectedStock.price || 0) > availableCash && (
											<p className="text-red-600">Insufficient funds</p>
										)}
									</div>
								)}
								{tradeAction === 'SELL' && (
									<div className="text-sm text-gray-500">
										{(portfolio.find(stock => stock.symbol === selectedStock.symbol)?.shares || 0) < tradeQuantity && (
											<p className="text-red-600">Insufficient shares</p>
										)}
									</div>
								)}
							</div>

							<button
								onClick={confirmTrade}
								disabled={
									(tradeAction === 'BUY' && tradeQuantity * (selectedStock.price || 0) > availableCash) ||
									(tradeAction === 'SELL' && (portfolio.find(stock => stock.symbol === selectedStock.symbol)?.shares || 0) < tradeQuantity)
								}
								className={`w-full py-3 rounded-lg text-white font-medium ${tradeAction === 'BUY'
									? (tradeQuantity * (selectedStock.price || 0) > availableCash
										? 'bg-green-300 cursor-not-allowed'
										: 'bg-green-600 hover:bg-green-700')
									: ((portfolio.find(stock => stock.symbol === selectedStock.symbol)?.shares || 0) < tradeQuantity
										? 'bg-red-300 cursor-not-allowed'
										: 'bg-red-600 hover:bg-red-700')
									}`}
							>
								Confirm {tradeAction === 'BUY' ? 'Purchase' : 'Sale'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}