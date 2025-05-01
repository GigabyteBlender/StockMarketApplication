import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketTab = ({ marketMovers, openTradeModal, handleSelectStock }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Market Overview</h2>
        </div>
        <div className="p-6">
            {/* Market summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                    <h3 className="text-sm text-gray-500 mb-1">S&P 500</h3>
                    <div className="flex items-center">
                        <span className="text-xl font-semibold mr-2">5,304.12</span>
                        <span className="text-green-600 flex items-center text-sm">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            +0.87%
                        </span>
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                    <h3 className="text-sm text-gray-500 mb-1">Dow Jones</h3>
                    <div className="flex items-center">
                        <span className="text-xl font-semibold mr-2">39,651.87</span>
                        <span className="text-green-600 flex items-center text-sm">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            +0.56%
                        </span>
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                    <h3 className="text-sm text-gray-500 mb-1">NASDAQ</h3>
                    <div className="flex items-center">
                        <span className="text-xl font-semibold mr-2">16,802.36</span>
                        <span className="text-red-600 flex items-center text-sm">
                            <TrendingDown className="h-4 w-4 mr-1" />
                            -0.22%
                        </span>
                    </div>
                </div>
            </div>
            <div className="mb-6">
                <h3 className="text-md font-medium mb-3">Top Gainers</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {marketMovers
                                .filter(stock => stock.change > 0)
                                .sort((a, b) => b.change - a.change)
                                .slice(0, 5)
                                .map((stock) => (
                                    <tr key={stock.symbol}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{stock.symbol}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{stock.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">${stock.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-green-600">
                                            <div className="flex items-center">
                                                <TrendingUp className="h-4 w-4 mr-1" />
                                                +{stock.change}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    className="bg-blue-100 text-blue-800 py-1 px-3 rounded-lg hover:bg-blue-200"
                                                    onClick={() => openTradeModal(stock.symbol, 'BUY')}
                                                >
                                                    Trade
                                                </button>
                                                <button
                                                    className="bg-gray-100 text-gray-800 py-1 px-3 rounded-lg hover:bg-gray-200"
                                                    onClick={() => handleSelectStock(stock.symbol)}
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top Losers */}
            <div>
                <h3 className="text-md font-medium mb-3">Top Losers</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {marketMovers
                                .filter(stock => stock.change < 0)
                                .sort((a, b) => a.change - b.change)
                                .slice(0, 5)
                                .map((stock) => (
                                    <tr key={stock.symbol}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{stock.symbol}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{stock.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">${stock.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-red-600">
                                            <div className="flex items-center">
                                                <TrendingDown className="h-4 w-4 mr-1" />
                                                {stock.change}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    className="bg-blue-100 text-blue-800 py-1 px-3 rounded-lg hover:bg-blue-200"
                                                    onClick={() => openTradeModal(stock.symbol, 'BUY')}
                                                >
                                                    Trade
                                                </button>
                                                <button
                                                    className="bg-gray-100 text-gray-800 py-1 px-3 rounded-lg hover:bg-gray-200"
                                                    onClick={() => handleSelectStock(stock.symbol)}
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
)}

export default MarketTab;