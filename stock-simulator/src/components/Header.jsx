import React, { useState } from 'react';
import { Search, DollarSign, X } from 'lucide-react';
import './styles/Header.css';

export default function Header({
  searchTerm,
  setSearchTerm,
  handleSearchKeyPress,
  availableCash
}) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-wrapper">
            <DollarSign className="logo-icon" />
            <span className="logo-glow" />
          </div>
          <div className="brand-text">
            <span className="app-title">StockSim</span>
            <span className="app-subtitle">Virtual Trading</span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Mobile Search Toggle */}
          <button
            className="search-mobile-toggle"
            onClick={() => setShowMobileSearch(true)}
            aria-label="Open search"
          >
            <Search className="search-mobile-icon" />
          </button>

          {/* Desktop Search */}
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              aria-label="Search"
            />
          </div>

          {/* Balance Card */}
          <div className="balance-card">
            <div className="balance-icon-wrapper">
              <DollarSign className="balance-icon" />
            </div>
            <div className="balance-content">
              <span className="balance-label">Balance</span>
              <span className="balance-amount">${availableCash.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <div className={`search-expanded${showMobileSearch ? ' active' : ''}`}>
        <div className="search-expanded-header">
          <span className="search-expanded-title">Search Stocks</span>
          <button
            className="search-close-button"
            onClick={() => setShowMobileSearch(false)}
            aria-label="Close search"
          >
            <X className="search-mobile-icon" />
          </button>
        </div>
        
        <div className="search-expanded-input-wrapper">
          <input
            className="search-input"
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            autoFocus
            aria-label="Search"
          />
        </div>
      </div>
    </header>
  );
}