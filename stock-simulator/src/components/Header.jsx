import React from 'react';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import './styles/Header.css';

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
		<header className="header">
			<div className="logo-container">
				<TrendingUp className="logo-icon" />
				<h1 className="app-title">Stock Simulator</h1>
			</div>
			<div className="header-controls">
				<div className="search-container">
					<input
						type="text"
						placeholder="Search for stocks..."
						className="search-input"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						onKeyPress={handleSearchKeyPress}
					/>
					<Search
						className="search-icon"
						onClick={handleSearch}
					/>

					{/* Search Results Dropdown */}
					{showSearchResults && searchResults.length > 0 && (
						<div className="search-results">
							{searchResults.map((result) => (
								<div
									key={result.symbol}
									className="search-result-item"
									onClick={() => handleSelectStock(result.symbol)}
								>
									<div>
										<div className="stock-symbol">{result.symbol}</div>
										<div className="stock-price">${result.price}</div>
									</div>
									<div className={`stock-trend ${result.change >= 0 ? 'positive' : 'negative'}`}>
										{result.change >= 0 ?
											<TrendingUp className="trend-icon" /> :
											<TrendingDown className="trend-icon" />
										}
										{result.change >= 0 ? '+' : ''}{result.changePercent}%
									</div>
								</div>
							))}
						</div>
					)}
				</div>
				<div className="balance-display">
					Balance: ${availableCash.toFixed(2)}
				</div>
			</div>
		</header>
	);
}