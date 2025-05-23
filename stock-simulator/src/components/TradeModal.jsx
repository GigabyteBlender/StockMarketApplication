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

  const availableShares = portfolio.find(stock => stock.symbol === selectedStock.symbol)?.shares || 0;
  const stockPrice = selectedStock.price || 0;
  const estimatedTotal = tradeQuantity * stockPrice;
  
  const isInsufficientFunds = tradeAction === 'BUY' && estimatedTotal > availableCash;
  const isInsufficientShares = tradeAction === 'SELL' && availableShares < tradeQuantity;
  const isDisabled = isInsufficientFunds || isInsufficientShares || tradeQuantity <= 0;

  const maxBuyQuantity = Math.floor(availableCash / stockPrice);
  const maxSellQuantity = availableShares;

  const handleMaxQuantity = () => {
    const maxQty = tradeAction === 'BUY' ? maxBuyQuantity : maxSellQuantity;
    updateTradeQuantity(maxQty - tradeQuantity);
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
              <div className="info-value cash">${availableCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="info-card">
              <div className="info-label">Owned Shares</div>
              <div className="info-value shares">{availableShares.toLocaleString()}</div>
            </div>
          </div>

          <div className="quantity-section">
            <div className="quantity-header">
              <label className="quantity-label">Quantity</label>
              <button className="max-button" onClick={handleMaxQuantity}>
                Max: {tradeAction === 'BUY' ? maxBuyQuantity : maxSellQuantity}
              </button>
            </div>
            
            <div className="quantity-input-wrapper">
              <button
                type="button"
                onClick={() => updateTradeQuantity(-1)}
                className="quantity-btn decrease"
                disabled={tradeQuantity <= 1}
              >
                <Minus size={16} />
              </button>
              
              <input
                type="number"
                value={tradeQuantity}
                onChange={(e) => {
                  const value = Math.max(1, parseInt(e.target.value) || 1);
                  updateTradeQuantity(value - tradeQuantity);
                }}
                className="quantity-input"
                min="1"
              />
              
              <button
                type="button"
                onClick={() => updateTradeQuantity(1)}
                className="quantity-btn increase"
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
                {tradeAction === 'BUY' ? 'Buy' : 'Sell'} {tradeQuantity} Share{tradeQuantity !== 1 ? 's' : ''}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}