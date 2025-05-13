import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';

const MarketTab = ({ marketMovers, openTradeModal, handleSelectStock }) => {
  const [marketIndices, setMarketIndices] = useState({
    sp500: { price: 5304.12, change: 0.87 },
    dowJones: { price: 39651.87, change: 0.56 },
    nasdaq: { price: 16802.36, change: -0.22 }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketIndices = async () => {
      const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;
      
      try {
        // Fetch data for market indices
        const [sp500Response, dowResponse, nasdaqResponse] = await Promise.all([
          axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=${API_KEY}`),
          axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=DIA&apikey=${API_KEY}`),
          axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=QQQ&apikey=${API_KEY}`)
        ]);

        // Parse responses
        const sp500Data = sp500Response.data['Global Quote'];
        const dowData = dowResponse.data['Global Quote'];
        const nasdaqData = nasdaqResponse.data['Global Quote'];

        if (sp500Data && dowData && nasdaqData) {
          setMarketIndices({
            sp500: { 
              price: parseFloat(sp500Data['05. price']),
              change: parseFloat(sp500Data['10. change percent'].replace('%', ''))
            },
            dowJones: { 
              price: parseFloat(dowData['05. price']),
              change: parseFloat(dowData['10. change percent'].replace('%', ''))
            },
            nasdaq: { 
              price: parseFloat(nasdaqData['05. price']),
              change: parseFloat(nasdaqData['10. change percent'].replace('%', ''))
            }
          });
        }
      } catch (error) {
        console.error('Error fetching market indices:', error);
        // Keep the default values in case of API failures
      } finally {
        setLoading(false);
      }
    };

    fetchMarketIndices();
  }, []);

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
                        {loading ? (
                          <span className="text-gray-400">Loading...</span>
                        ) : (
                          <>
                            <span className="text-xl font-semibold mr-2">{marketIndices.sp500.price.toFixed(2)}</span>
                            <span className={`${marketIndices.sp500.change >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center text-sm`}>
                                {marketIndices.sp500.change >= 0 ? 
                                  <TrendingUp className="h-4 w-4 mr-1" /> : 
                                  <TrendingDown className="h-4 w-4 mr-1" />
                                }
                                {marketIndices.sp500.change >= 0 ? '+' : ''}{marketIndices.sp500.change.toFixed(2)}%
                            </span>
                          </>
                        )}
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                    <h3 className="text-sm text-gray-500 mb-1">Dow Jones</h3>
                    <div className="flex items-center">
                        {loading ? (
                          <span className="text-gray-400">Loading...</span>
                        ) : (
                          <>
                            <span className="text-xl font-semibold mr-2">{marketIndices.dowJones.price.toFixed(2)}</span>
                            <span className={`${marketIndices.dowJones.change >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center text-sm`}>
                                {marketIndices.dowJones.change >= 0 ? 
                                  <TrendingUp className="h-4 w-4 mr-1" /> : 
                                  <TrendingDown className="h-4 w-4 mr-1" />
                                }
                                {marketIndices.dowJones.change >= 0 ? '+' : ''}{marketIndices.dowJones.change.toFixed(2)}%
                            </span>
                          </>
                        )}
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                    <h3 className="text-sm text-gray-500 mb-1">NASDAQ</h3>
                    <div className="flex items-center">
                        {loading ? (
                          <span className="text-gray-400">Loading...</span>
                        ) : (
                          <>
                            <span className="text-xl font-semibold mr-2">{marketIndices.nasdaq.price.toFixed(2)}</span>
                            <span className={`${marketIndices.nasdaq.change >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center text-sm`}>
                                {marketIndices.nasdaq.change >= 0 ? 
                                  <TrendingUp className="h-4 w-4 mr-1" /> : 
                                  <TrendingDown className="h-4 w-4 mr-1" />
                                }
                                {marketIndices.nasdaq.change >= 0 ? '+' : ''}{marketIndices.nasdaq.change.toFixed(2)}%
                            </span>
                          </>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Gainers */}
            <div className="mb-6">
                <h3 className="text-md font-medium mb-3">Top Gainers</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                              <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                  Loading market data...
                                </td>
                              </tr>
                            ) : (
                              marketMovers
                                .filter(stock => stock.changePercent > 0)
                                .sort((a, b) => b.changePercent - a.changePercent)
                                .slice(0, 5)
                                .map((stock) => (
                                    <tr key={stock.symbol}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{stock.symbol}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{stock.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">${stock.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-green-600">
                                            <div className="flex items-center">
                                                <TrendingUp className="h-4 w-4 mr-1" />
                                                +{stock.changePercent.toFixed(2)}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-center space-x-2">
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
                                ))
                            )}
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
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                              <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                  Loading market data...
                                </td>
                              </tr>
                            ) : (
                              marketMovers
                                .filter(stock => stock.changePercent < 0)
                                .sort((a, b) => a.changePercent - b.changePercent)
                                .slice(0, 5)
                                .map((stock) => (
                                    <tr key={stock.symbol}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{stock.symbol}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{stock.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">${stock.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-red-600">
                                            <div className="flex items-center">
                                                <TrendingDown className="h-4 w-4 mr-1" />
                                                {stock.changePercent.toFixed(2)}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-center space-x-2">
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
)};

export default MarketTab;