import React from 'react';
import { X } from 'lucide-react';

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {tradeAction === 'BUY' ? 'Buy' : 'Sell'} {selectedStock.symbol}
          </h2>
          <button
            onClick={onClose}
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
                onChange={(e) => updateTradeQuantity(Math.max(1, parseInt(e.target.value) || 1) - tradeQuantity)}
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
  );
}