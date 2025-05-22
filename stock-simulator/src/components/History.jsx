import React, { useState } from 'react';
import { Clock, Filter, RotateCcw, FileText } from 'lucide-react';
import './styles/History.css';

export default function History({ recentTrades }) {
  // Local filter state
  const [filterType, setFilterType] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [filterSymbol, setFilterSymbol] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    setCurrentPage(1);
  };

  // Apply all filters to trades
  const filteredTrades = recentTrades.filter(trade => {
    // Filter by type
    if (filterType !== 'all' && trade.type && trade.type.toLowerCase() !== filterType) {
      return false;
    }
    
    // Filter by symbol
    if (filterSymbol && trade.symbol && !trade.symbol.toLowerCase().includes(filterSymbol.toLowerCase())) {
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
  const maxVisiblePages = 5;
  
  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h2 className="history-title">
          <Clock size={20} className="history-title-icon" />
          Transaction History
        </h2>
        <div className="history-actions">
          <button className="history-action-button" title="Refresh">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
      
      <div className="history-content">
        {/* Filter Section */}
        <div className="filter-section">
          <h3 className="section-title">
            <Filter size={16} className="section-title-icon" />
            Filter Transactions
          </h3>
          <div className="filter-controls">
            <div className="filter-group">
              <label className="filter-label">Transaction Type</label>
              <select
                className="filter-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="buy">Buy Orders</option>
                <option value="sell">Sell Orders</option>
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
                <option value="1d">Today</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Start Date</label>
              <input
                type="date"
                className="filter-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">End Date</label>
              <input
                type="date"
                className="filter-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
            
            <div className="filter-actions">
              <button className="filter-button" title="Apply Filters">
                <Filter size={16} />
                Apply
              </button>
              <button className="filter-button-reset" onClick={resetFilters} title="Reset Filters">
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="transactions-section">
          <h3 className="section-title">
            Transaction Details
            <div className="section-title-actions">
              <span className="transaction-count">{filteredTrades.length} transactions</span>
            </div>
          </h3>
          
          <div className="table-container">
            <table className="transactions-table">
              <thead className="table-header">
                <tr>
                  <th className="table-heading">Date & Time</th>
                  <th className="table-heading">Symbol</th>
                  <th className="table-heading">Type</th>
                  <th className="table-heading">Quantity</th>
                  <th className="table-heading">Price</th>
                  <th className="table-heading">Total Value</th>
                  <th className="table-heading">Status</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {currentTrades.length > 0 ? (
                  currentTrades.map((trade) => {
                    const totalValue = (trade.quantity || 0) * (trade.price || 0);
                    const tradeType = trade.type || 'unknown';
                    const isBuy = tradeType.toLowerCase() === 'buy';
                    
                    return (
                      <tr key={trade.id || Math.random()}>
                        <td className="table-cell">
                          <div className="date-cell">
                            <span className="date-primary">{formatDate(trade.date || new Date())}</span>
                            <span className="date-secondary">{trade.time || '09:30 AM'}</span>
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="symbol-cell">
                            <div className="symbol-icon">{(trade.symbol || 'N/A').charAt(0)}</div>
                            <div className="symbol-text">
                              <span className="symbol-code">{trade.symbol || 'N/A'}</span>
                              <span className="symbol-name">{trade.name || 'Unknown'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className={`trade-badge ${isBuy ? 'buy-badge' : 'sell-badge'}`}>
                            {tradeType.toUpperCase()}
                          </span>
                        </td>
                        <td className="table-cell amount-cell">
                          {(trade.quantity || 0).toLocaleString()}
                        </td>
                        <td className="table-cell price-cell">
                          ${(trade.price || 0).toFixed(2)}
                        </td>
                        <td className="table-cell price-cell">
                          <div className="total-value-cell">
                            <span className="total-amount">${totalValue.toFixed(2)}</span>
                            <span className={`total-indicator ${isBuy ? 'buy-indicator' : 'sell-indicator'}`}>
                              {isBuy ? 'Purchased' : 'Sold'}
                            </span>
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className={`status-badge ${getStatusClass(trade.status)}`}>
                            {trade.status || 'Completed'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="empty-message">
                      <FileText size={48} className="empty-icon" />
                      <span>No transactions found matching your criteria.</span>
                      <button className="empty-action-button" onClick={resetFilters}>
                        Clear Filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTrades.length)} of {filteredTrades.length} transactions
              </div>
              <div className="pagination-controls">
                <button 
                  className="pagination-button pagination-nav" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  title="First page"
                >
                  ««
                </button>
                <button 
                  className="pagination-button pagination-nav" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  title="Previous page"
                >
                  ‹
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
                  className="pagination-button pagination-nav" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  title="Next page"
                >
                  ›
                </button>
                <button 
                  className="pagination-button pagination-nav" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  title="Last page"
                >
                  »»
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}