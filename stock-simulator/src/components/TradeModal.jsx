import React from 'react';
import { X } from 'lucide-react';
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

  // Check if trade is valid
  const isInsufficientFunds = tradeAction === 'BUY' && tradeQuantity * (selectedStock.price || 0) > availableCash;
  const availableShares = portfolio.find(stock => stock.symbol === selectedStock.symbol)?.shares || 0;
  const isInsufficientShares = tradeAction === 'SELL' && availableShares < tradeQuantity;
  const isDisabled = isInsufficientFunds || isInsufficientShares;
  
  // Calculate estimated total
  const estimatedTotal = tradeQuantity * (selectedStock.price || 0);

  // Determine button class based on trade action and validity
  const getConfirmButtonClass = () => {
    const baseClass = 'confirm-button';
    
    if (tradeAction === 'BUY') {
      return `${baseClass} buy ${isInsufficientFunds ? 'disabled' : ''}`;
    } else {
      return `${baseClass} sell ${isInsufficientShares ? 'disabled' : ''}`;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            {tradeAction === 'BUY' ? 'Buy' : 'Sell'} {selectedStock.symbol}
          </h2>
          <button
            onClick={onClose}
            className="close-button"
          >
            <X size={20} />
          </button>
        </div>
        <div className="modal-content">
          <div className="trade-info">
            <div className="info-item">
              <p className="info-label">Current Price</p>
              <p className="info-value">${selectedStock.price?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="info-item">
              <p className="info-label">Available Cash</p>
              <p className="info-value">${availableCash.toFixed(2)}</p>
            </div>
            <div className="info-item">
              <p className="info-label">Available Shares</p>
              <p className="info-value">{availableShares}</p>
            </div>
          </div>

          <div className="quantity-section">
            <label className="quantity-label">Quantity</label>
            <div className="quantity-controls">
              <button
                onClick={() => updateTradeQuantity(-1)}
                className="quantity-button decrease"
              >
                -
              </button>
              <input
                type="number"
                value={tradeQuantity}
                onChange={(e) => updateTradeQuantity(Math.max(1, parseInt(e.target.value) || 1) - tradeQuantity)}
                className="quantity-input"
                min="1"
              />
              <button
                onClick={() => updateTradeQuantity(1)}
                className="quantity-button increase"
              >
                +
              </button>
            </div>
          </div>

          <div className="total-section">
            <div className="total-info">
              <p className="total-label">Estimated Total</p>
              <p className="total-value">${estimatedTotal.toFixed(2)}</p>
            </div>
            {isInsufficientFunds && (
              <p className="error-message">Insufficient funds</p>
            )}
            {isInsufficientShares && (
              <p className="error-message">Insufficient shares</p>
            )}
          </div>

          <button
            onClick={confirmTrade}
            disabled={isDisabled}
            className={getConfirmButtonClass()}
          >
            Confirm {tradeAction === 'BUY' ? 'Purchase' : 'Sale'}
          </button>
        </div>
      </div>
    </div>
  );
}