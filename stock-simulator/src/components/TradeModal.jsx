import React from 'react';
import { X, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Minus, Plus } from 'lucide-react';
import './styles/TradeModal.css';

export default function TradeModal({ 
  isOpen, 
  onClose, 
  selectedStock, 
  tradeAction, 
  tradeQuantity, 
  updateTradeQuantity, 
  confirmTrade, 
  availableCash, 
  portfolio 
}) {
  if (!isOpen || !selectedStock) return null;

  // Helper function to safely get numeric values
  const safeNumber = (value, fallback = 0) => {
    const num = Number(value);
    return isNaN(num) || !isFinite(num) ? fallback : num;
  };

  const availableShares = portfolio.find(stock => stock.symbol === selectedStock.symbol)?.shares || 0;
  const stockPrice = safeNumber(selectedStock.price, 0);
  const safeQuantity = Math.max(1, safeNumber(tradeQuantity, 1));
  const estimatedTotal = safeQuantity * stockPrice;
  
  const isInsufficientFunds = tradeAction === 'BUY' && estimatedTotal > availableCash;
  const isInsufficientShares = tradeAction === 'SELL' && availableShares < safeQuantity;
  const isDisabled = isInsufficientFunds || isInsufficientShares || safeQuantity <= 0;

  const maxBuyQuantity = stockPrice > 0 ? Math.floor(availableCash / stockPrice) : 0;
  const maxSellQuantity = availableShares;

  const handleMaxQuantity = () => {
    const maxQty = tradeAction === 'BUY' ? maxBuyQuantity : maxSellQuantity;
    if (maxQty > 0) {
      updateTradeQuantity(maxQty);
    }
  };

  const handleQuantityChange = (e) => {
    const inputValue = e.target.value;
    
    // Allow empty string for user to clear input
    if (inputValue === '') {
      updateTradeQuantity(1);
      return;
    }
    
    // Parse and validate the input
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue) && isFinite(numValue) && numValue > 0) {
      const clampedValue = Math.max(1, Math.min(numValue, 999999)); // Reasonable upper limit
      updateTradeQuantity(clampedValue);
    }
  };

  const handleQuantityIncrement = (increment) => {
    const newQuantity = safeQuantity + increment;
    if (newQuantity >= 1 && newQuantity <= 999999) {
      updateTradeQuantity(newQuantity);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-backdrop"></div>
        
        <div className="modal-header">
          <div className="modal-title-section">
            <div className={`trade-type-badge ${tradeAction.toLowerCase()}`}>
              {tradeAction === 'BUY' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{tradeAction}</span>
            </div>
            <h2 className="modal-title">{selectedStock.symbol}</h2>
          </div>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          <div className="stock-info-grid">
            <div className="info-card">
              <div className="info-label">Current Price</div>
              <div className="info-value price">${stockPrice.toFixed(2)}</div>
            </div>
            <div className="info-card">
              <div className="info-label">Available Cash</div>
              <div className="info-value cash">
                ${safeNumber(availableCash, 0).toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </div>
            </div>
            <div className="info-card">
              <div className="info-label">Owned Shares</div>
              <div className="info-value shares">{availableShares.toLocaleString()}</div>
            </div>
          </div>

          <div className="quantity-section">
            <div className="quantity-header">
              <label className="quantity-label">Quantity</label>
              <button 
                className="max-button" 
                onClick={handleMaxQuantity}
                disabled={(tradeAction === 'BUY' ? maxBuyQuantity : maxSellQuantity) <= 0}
              >
                Max: {tradeAction === 'BUY' ? maxBuyQuantity : maxSellQuantity}
              </button>
            </div>
            
            <div className="quantity-input-wrapper">
              <button
                type="button"
                onClick={() => handleQuantityIncrement(-1)}
                className="quantity-btn decrease"
                disabled={safeQuantity <= 1}
              >
                <Minus size={16} />
              </button>
              
              <input
                type="number"
                value={safeQuantity}
                onChange={handleQuantityChange}
                className="quantity-input"
                min="1"
                max="999999"
                step="1"
              />
              
              <button
                type="button"
                onClick={() => handleQuantityIncrement(1)}
                className="quantity-btn increase"
                disabled={safeQuantity >= 999999}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Order Value</span>
              <span className="summary-value">${estimatedTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Estimated Fee</span>
              <span className="summary-value">$0.00</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total {tradeAction === 'BUY' ? 'Cost' : 'Proceeds'}</span>
              <span className="summary-value total-value">${estimatedTotal.toFixed(2)}</span>
            </div>
          </div>

          {(isInsufficientFunds || isInsufficientShares) && (
            <div className="error-alert">
              <AlertCircle size={16} />
              <span>
                {isInsufficientFunds && 'Insufficient funds for this purchase'}
                {isInsufficientShares && 'Insufficient shares for this sale'}
              </span>
            </div>
          )}

          <div className="modal-actions">
            <button onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button
              onClick={confirmTrade}
              disabled={isDisabled}
              className={`confirm-button ${tradeAction.toLowerCase()} ${isDisabled ? 'disabled' : ''}`}
            >
              {!isDisabled && <CheckCircle size={16} />}
              <span>
                {tradeAction === 'BUY' ? 'Buy' : 'Sell'} {safeQuantity} Share{safeQuantity !== 1 ? 's' : ''}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}