import React, { useState } from 'react';
import './styles/History.css';

// Mock icons for the component (replace with actual icon imports in a real app)
const HistoryIcon = () => (
  <svg className="history-title-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6H21M6 12H18M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw h-4 w-4" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>
);

const EmptyIcon = () => (
  <svg className="empty-table-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PaginationArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PaginationArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Demo stock symbols with icon placeholders
const symbolIcons = {
  AAPL: "https://example.com/apple.png",
  GOOG: "https://example.com/google.png",
  MSFT: "https://example.com/microsoft.png",
  AMZN: "https://example.com/amazon.png",
  TSLA: "https://example.com/tesla.png",
};

export default function History({ recentTrades }) {
  // Local filter state
  const [filterType, setFilterType] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [filterSymbol, setFilterSymbol] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Helper function to determine status class
  const getStatusClass = (status) => {
    if (!status) return '';
    switch(status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'failed':
        return 'status-failed';
      default:
        return '';
    }
  };

  // Filter and pagination logic
  const resetFilters = () => {
    setFilterType('all');
    setFilterDateRange('all');
    setFilterSymbol('');
    setStartDate('');
    setEndDate('');
  };

  // Apply all filters to trades
  const filteredTrades = recentTrades.filter(trade => {
    // Filter by type
    if (filterType !== 'all' && trade.type.toLowerCase() !== filterType.toUpperCase()) {
      return false;
    }
    
    // Filter by symbol
    if (filterSymbol && !trade.symbol.includes(filterSymbol.toUpperCase())) {
      return false;
    }
    
    // Filter by date range logic would go here
    // This is simplified for the example
    
    return true;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrades = filteredTrades.slice(indexOfFirstItem, indexOfLastItem);

  // Create an array of page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h2 className="history-title">
          <HistoryIcon /> Transaction History
        </h2>
        <div className="history-actions">
          <button className="history-action-button">
            <RefreshIcon />
          </button>
        </div>
      </div>
      <div className="history-content">
        {/* Filter controls */}
        <div className="filter-controls">
          <div className="filter-group">
            <label className="filter-label">Transaction Type</label>
            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Date Range</label>
            <select
              className="filter-select"
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
          <div className="filter-group">
            <label className="filter-label">Custom Date</label>
            <input
              type="date"
              className="filter-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Symbol</label>
            <input
              type="text"
              className="filter-input"
              placeholder="e.g. AAPL"
              value={filterSymbol}
              onChange={(e) => setFilterSymbol(e.target.value)}
            />
          </div>
          <button className="filter-button">
            <FilterIcon /> Apply Filters
          </button>
          <button className="filter-button-reset" onClick={resetFilters}>
            <RefreshIcon /> Reset
          </button>
        </div>

        {/* Transactions table */}
        <div className="table-container">
          <table className="transactions-table">
            <thead className="table-header">
              <tr>
                <th className="table-heading">Date</th>
                <th className="table-heading">Type</th>
                <th className="table-heading">Symbol</th>
                <th className="table-heading">Name</th>
                <th className="table-heading">Quantity</th>
                <th className="table-heading">Price</th>
                <th className="table-heading">Total</th>
                <th className="table-heading">Status</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {currentTrades.length > 0 ? (
                currentTrades.map((trade) => (
                  <tr key={trade.id}>
                    <td className="table-cell">{trade.date}</td>
                    <td className="table-cell">
                      <span className={`trade-badge ${trade.type === 'BUY' ? 'buy-badge' : 'sell-badge'}`}>
                        {trade.type}
                      </span>
                    </td>
                    <td className="table-cell symbol-cell">
                      {trade.symbol in symbolIcons && (
                        <img 
                          src={symbolIcons[trade.symbol]} 
                          alt={trade.symbol} 
                          className="symbol-icon"
                          onError={(e) => {e.target.style.display = 'none'}}
                        />
                      )}
                      {trade.symbol}
                    </td>
                    <td className="table-cell">{trade.name}</td>
                    <td className="table-cell">{trade.quantity}</td>
                    <td className="table-cell price-cell">${trade.price.toFixed(2)}</td>
                    <td className="table-cell amount-cell">${(trade.quantity * trade.price).toFixed(2)}</td>
                    <td className="table-cell">
                      <span className={`status-badge ${getStatusClass(trade.status)}`}>
                        {trade.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-table-message">
                    <EmptyIcon />
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTrades.length)} of {filteredTrades.length} transactions
            </div>
            <div className="pagination-controls">
              <button 
                className="pagination-button" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <PaginationArrowLeft />
              </button>
              
              {pageNumbers.map(number => (
                <button
                  key={number}
                  className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                  onClick={() => setCurrentPage(number)}
                >
                  {number}
                </button>
              ))}
              
              <button 
                className="pagination-button" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <PaginationArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}