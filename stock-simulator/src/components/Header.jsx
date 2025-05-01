import React from 'react';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';

export default function Header({
	searchTerm,
	setSearchTerm,
	handleSearchKeyPress,
	handleSearch,
	showSearchResults,
	searchResults,
	handleSelectStock,
	availableCash
}) {
	return (
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
	);
}