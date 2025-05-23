import React, { useState } from 'react';
import { Clock, Filter, RotateCcw, FileText } from 'lucide-react';
import './styles/History.css';
import './styles/Tables.css';

/**
 * History Component - Transaction history page for the stock trading application
 * 
 * FUTURE DATA INTEGRATION NEEDS:
 * - Transaction data should come from database/API instead of props
 * - Real-time status updates for pending transactions via WebSocket
 * - Export functionality for CSV/PDF reports
 * - Advanced filtering with date range validation
 * - Audit trail for compliance and regulatory reporting
 * - Integration with accounting systems for tax reporting
 */
export default function History({ recentTrades }) {
  // ======================== STATE MANAGEMENT ========================
  // Filter state - controls what transactions are displayed
  // TODO: Consider moving filter state to URL params for shareable filtered views
  const [filterType, setFilterType] = useState('all');           // Transaction type filter (buy/sell/all)
  const [filterDateRange, setFilterDateRange] = useState('all'); // Predefined date range filter
  const [filterSymbol, setFilterSymbol] = useState('');          // Stock symbol filter
  const [startDate, setStartDate] = useState('');               // Custom start date filter
  const [endDate, setEndDate] = useState('');                   // Custom end date filter
  
  // Pagination state - controls which page of results is displayed
  // TODO: Consider server-side pagination for large datasets
  const [currentPage, setCurrentPage] = useState(1);            // Current page number
  const itemsPerPage = 10;                                      // Number of items per page

  // ======================== HELPER FUNCTIONS ========================
  
  /**
   * Determines CSS class for transaction status badges
   * TODO: Add more status types (cancelled, expired, partial_fill, etc.)
   */
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

  /**
   * Resets all filters to default values
   * TODO: Add confirmation dialog if user has unsaved filter preferences
   */
  const resetFilters = () => {
    setFilterType('all');
    setFilterDateRange('all');
    setFilterSymbol('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // ======================== DATA FILTERING LOGIC ========================
  
  /**
   * Apply all active filters to the transaction data
   * TODO: Implement more sophisticated filtering:
   * - Amount range filtering (min/max transaction value)
   * - Multiple symbol filtering (comma-separated list)
   * - Advanced date logic with proper timezone handling
   * - Performance optimization for large datasets
   */
  const filteredTrades = recentTrades.filter(trade => {
    // Filter by transaction type (buy/sell)
    if (filterType !== 'all' && trade.type && trade.type.toLowerCase() !== filterType) {
      return false;
    }
    
    // Filter by stock symbol (case-insensitive partial match)
    // TODO: Add exact match option and regex support
    if (filterSymbol && trade.symbol && !trade.symbol.toLowerCase().includes(filterSymbol.toLowerCase())) {
      return false;
    }
    
    // TODO: Implement date range filtering logic
    // This should handle:
    // - Predefined ranges (today, last 7 days, etc.)
    // - Custom date ranges with start/end dates
    // - Timezone considerations
    // - Invalid date handling
    
    return true;
  });

  // ======================== PAGINATION LOGIC ========================
  
  // Calculate pagination values
  // TODO: Consider virtual scrolling for very large datasets
  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrades = filteredTrades.slice(indexOfFirstItem, indexOfLastItem);

  /**
   * Generate array of page numbers for pagination display
   * Uses smart pagination to show limited number of page buttons
   * TODO: Add "jump to page" input field for large datasets
   */
  const pageNumbers = [];
  const maxVisiblePages = 5;
  
  if (totalPages <= maxVisiblePages) {
    // Show all pages if total is small
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Show window of pages around current page
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  }

  /**
   * Format date strings for display
   * TODO: Add internationalization support for different date formats
   * TODO: Add timezone display and conversion options
   */
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

  // ======================== COMPONENT RENDER ========================
  
  return (
    <div className="history-container">
      {/* Page Header */}
      <div className="history-header">
        <h2 className="history-title">
          <Clock size={20} className="history-title-icon" />
          Transaction History
        </h2>
        <div className="history-actions">
          {/* TODO: Implement refresh functionality to reload data from API */}
          <button className="history-action-button" title="Refresh">
            <RotateCcw size={16} />
          </button>
          {/* TODO: Add export button for CSV/PDF downloads */}
          {/* TODO: Add print functionality for physical records */}
        </div>
      </div>
      
      <div className="history-content">
        {/* ======================== FILTER SECTION ======================== */}
        <div className="filter-section">
          <h3 className="section-title">
            <Filter size={16} className="section-title-icon" />
            Filter Transactions
          </h3>
          <div className="filter-controls">
            {/* Transaction Type Filter */}
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
                {/* TODO: Add more transaction types: dividend, split, transfer, etc. */}
              </select>
            </div>
            
            {/* Predefined Date Range Filter */}
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
                {/* TODO: Add more ranges: This week, This month, This quarter, This year */}
              </select>
            </div>
            
            {/* Custom Start Date */}
            <div className="filter-group">
              <label className="filter-label">Start Date</label>
              <input
                type="date"
                className="filter-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                // TODO: Add max date validation to prevent future dates
                // TODO: Add min date validation based on account creation date
              />
            </div>
            
            {/* Custom End Date */}
            <div className="filter-group">
              <label className="filter-label">End Date</label>
              <input
                type="date"
                className="filter-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                // TODO: Add validation to ensure end date is after start date
                // TODO: Add max date as today to prevent future dates
              />
            </div>
            
            {/* Symbol Filter */}
            <div className="filter-group">
              <label className="filter-label">Symbol</label>
              <input
                type="text"
                className="filter-input"
                placeholder="e.g. AAPL"
                value={filterSymbol}
                onChange={(e) => setFilterSymbol(e.target.value)}
                // TODO: Add autocomplete functionality with stock symbol suggestions
                // TODO: Add validation to ensure valid stock symbol format
              />
            </div>
            
            {/* Filter Action Buttons */}
            <div className="filter-actions">
              {/* TODO: Implement actual filter application logic */}
              <button className="filter-button" title="Apply Filters">
                <Filter size={16} />
                Apply
              </button>
              <button className="filter-button-reset" onClick={resetFilters} title="Reset Filters">
                <RotateCcw size={16} />
                Reset
              </button>
              {/* TODO: Add "Save Filter" functionality for frequently used filters */}
            </div>
          </div>
        </div>

        {/* ======================== TRANSACTION TABLE SECTION ======================== */}
        <div className="transactions-section">
          <h3 className="section-title">
            Transaction Details
            <div className="section-title-actions">
              <span className="transaction-count">{filteredTrades.length} transactions</span>
              {/* TODO: Add total value summary of filtered transactions */}
            </div>
          </h3>
          
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  {/* TODO: Add sorting functionality - click headers to sort columns */}
                  <th className="table-header-cell">Date & Time</th>
                  <th className="table-header-cell">Symbol</th>
                  <th className="table-header-cell">Type</th>
                  <th className="table-header-cell">Quantity</th>
                  <th className="table-header-cell">Price</th>
                  <th className="table-header-cell">Total Value</th>
                  <th className="table-header-cell">Status</th>
                  {/* TODO: Add more columns: Fees, Order ID, Market/Limit, etc. */}
                </tr>
              </thead>
              <tbody className="table-body">
                {currentTrades.length > 0 ? (
                  // Map through paginated and filtered transactions
                  currentTrades.map((trade) => {
                    // Calculate transaction metrics
                    // TODO: Move calculations to backend for better performance
                    const totalValue = (trade.quantity || 0) * (trade.price || 0);
                    const tradeType = trade.type || 'unknown';
                    const isBuy = tradeType.toLowerCase() === 'buy';
                    
                    return (
                      <tr key={trade.id || Math.random()} className="table-row">
                        {/* Date and Time Column */}
                        <td className="table-cell">
                          <div className="date-cell">
                            <span className="date-primary">{formatDate(trade.date || new Date())}</span>
                            <span className="date-secondary">{trade.time || '09:30 AM'}</span>
                          </div>
                        </td>
                        
                        {/* Stock Symbol Column */}
                        <td className="table-cell">
                          <div className="symbol-cell">
                            {/* TODO: Replace with actual company logos from API */}
                            <div className="symbol-icon">{(trade.symbol || 'N/A').charAt(0)}</div>
                            <div className="symbol-text">
                              <span className="symbol-code">{trade.symbol || 'N/A'}</span>
                              {/* TODO: Get full company name from stock info API */}
                              <span className="symbol-name">{trade.name || 'Unknown'}</span>
                            </div>
                          </div>
                        </td>
                        
                        {/* Transaction Type Badge */}
                        <td className="table-cell">
                          <span className={`trade-badge ${isBuy ? 'buy-badge' : 'sell-badge'}`}>
                            {tradeType.toUpperCase()}
                          </span>
                        </td>
                        
                        {/* Quantity Column */}
                        <td className="table-cell amount-cell">
                          {(trade.quantity || 0).toLocaleString()}
                          {/* TODO: Add partial fill indicators for partially executed orders */}
                        </td>
                        
                        {/* Price Column */}
                        <td className="table-cell price-cell">
                          ${(trade.price || 0).toFixed(2)}
                          {/* TODO: Add order type indicator (Market/Limit/Stop) */}
                        </td>
                        
                        {/* Total Value Column */}
                        <td className="table-cell price-cell">
                          <div className="total-value-cell">
                            <span className="total-amount">${totalValue.toFixed(2)}</span>
                            <span className={`total-indicator ${isBuy ? 'buy-indicator' : 'sell-indicator'}`}>
                              {isBuy ? 'Purchased' : 'Sold'}
                            </span>
                          </div>
                        </td>
                        
                        {/* Status Column */}
                        <td className="table-cell">
                          <span className={`status-badge ${getStatusClass(trade.status)}`}>
                            {trade.status || 'Completed'}
                          </span>
                          {/* TODO: Add status timestamp (when status last changed) */}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  // Empty state when no transactions match filters
                  <tr>
                    <td colSpan="7" className="empty-message">
                      <FileText size={48} className="empty-icon" />
                      <span>No transactions found matching your criteria.</span>
                      <button className="empty-action-button" onClick={resetFilters}>
                        Clear Filters
                      </button>
                      {/* TODO: Add link to make first trade if no transactions exist */}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ======================== PAGINATION SECTION ======================== */}
          {/* Only show pagination if there are multiple pages */}
          {totalPages > 1 && (
            <div className="pagination">
              {/* Pagination Info */}
              <div className="pagination-info">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTrades.length)} of {filteredTrades.length} transactions
              </div>
              
              {/* Pagination Controls */}
              <div className="pagination-controls">
                {/* First Page Button */}
                <button 
                  className="pagination-button pagination-nav" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  title="First page"
                >
                  ««
                </button>
                
                {/* Previous Page Button */}
                <button 
                  className="pagination-button pagination-nav" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  title="Previous page"
                >
                  ‹
                </button>
                
                {/* Page Number Buttons */}
                {pageNumbers.map(number => (
                  <button
                    key={number}
                    className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                    onClick={() => setCurrentPage(number)}
                  >
                    {number}
                  </button>
                ))}
                
                {/* Next Page Button */}
                <button 
                  className="pagination-button pagination-nav" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  title="Next page"
                >
                  ›
                </button>
                
                {/* Last Page Button */}
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