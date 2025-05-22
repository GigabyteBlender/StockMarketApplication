import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart2, RotateCcw} from 'lucide-react';
import axios from 'axios';
import './styles/Market.css';

const MarketTab = ({ marketMovers, openTradeModal, handleSelectStock }) => {
  const [marketIndices, setMarketIndices] = useState({
    sp500: { price: 5304.12, change: 0.87 },
    dowJones: { price: 39651.87, change: 0.56 },
    nasdaq: { price: 16802.36, change: -0.22 }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketIndices();
  }, []);

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

  const handleRefresh = () => {
    setLoading(true);
    // Re-fetch market data
    fetchMarketIndices();
  };

  return (
    <div className="market-container">
        <div className="market-header">
            <h2 className="market-title">
                <BarChart2 className="market-title-icon" />
                Market Overview
            </h2>
            <div className="market-header-actions">
                <button className="market-refresh-button" onClick={handleRefresh}>
                    <RotateCcw size={16} />
                </button>
            </div>
        </div>
        <div className="market-body">
            {/* Market summary */}
            <div className="market-indices-container">
                <div className="market-index-card">
                    <h3 className="market-index-title">S&P 500</h3>
                    <div className="market-index-value">
                        {loading ? (
                          <span className="loading-text">
                            <div className="loading-spinner"></div>
                            Loading...
                          </span>
                        ) : (
                          <>
                            <span className="index-price">{marketIndices.sp500.price.toFixed(2)}</span>
                            <span className={`index-change ${marketIndices.sp500.change >= 0 ? 'index-change-up' : 'index-change-down'}`}>
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
                <div className="market-index-card">
                    <h3 className="market-index-title">Dow Jones</h3>
                    <div className="market-index-value">
                        {loading ? (
                          <span className="loading-text">
                            <div className="loading-spinner"></div>
                            Loading...
                          </span>
                        ) : (
                          <>
                            <span className="index-price">{marketIndices.dowJones.price.toFixed(2)}</span>
                            <span className={`index-change ${marketIndices.dowJones.change >= 0 ? 'index-change-up' : 'index-change-down'}`}>
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
                <div className="market-index-card">
                    <h3 className="market-index-title">NASDAQ</h3>
                    <div className="market-index-value">
                        {loading ? (
                          <span className="loading-text">
                            <div className="loading-spinner"></div>
                            Loading...
                          </span>
                        ) : (
                          <>
                            <span className="index-price">{marketIndices.nasdaq.price.toFixed(2)}</span>
                            <span className={`index-change ${marketIndices.nasdaq.change >= 0 ? 'index-change-up' : 'index-change-down'}`}>
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
            <div className="table-section">
                <div className="table-section-header">
                    <h3 className="table-section-title">Top Gainers</h3>
                    <div className="table-section-controls">
                        <button className="table-section-button active">Day</button>
                        <button className="table-section-button">Week</button>
                    </div>
                </div>
                <div className="market-table-container">
                    <table className="market-table">
                        <thead className="market-table-header">
                            <tr>
                                <th className="market-table-header-cell">Symbol</th>
                                <th className="market-table-header-cell">Name</th>
                                <th className="market-table-header-cell">Price</th>
                                <th className="market-table-header-cell">Change</th>
                                <th className="market-table-header-cell">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="market-table-body">
                            {loading ? (
                              <tr>
                                <td colSpan="5" className="loading-message">
                                  <div className="loading-spinner"></div>
                                  Loading market data...
                                </td>
                              </tr>
                            ) : (
                              marketMovers
                                .filter(stock => stock.changePercent > 0)
                                .sort((a, b) => b.changePercent - a.changePercent)
                                .slice(0, 5)
                                .map((stock) => (
                                    <tr key={stock.symbol} className="market-table-row">
                                        <td className="market-table-cell">
                                            <div className="symbol-cell">
                                                <div className="symbol-icon">{stock.symbol.charAt(0)}</div>
                                                <div className="symbol-text">
                                                    {stock.symbol}
                                                    <span className="symbol-name">{stock.name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="market-table-cell">{stock.name}</td>
                                        <td className="market-table-cell price-cell">${stock.price.toFixed(2)}</td>
                                        <td className="market-table-cell">
                                            <div className="gain-loss-values">
                                                <div className="trend-up">
                                                    <TrendingUp className="h-4 w-4" />
                                                    +{stock.changePercent.toFixed(2)}%
                                                </div>
                                            </div>
                                        </td>
                                        <td className="market-table-cell">
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    className="btn-trade"
                                                    onClick={() => openTradeModal(stock.symbol, 'BUY')}
                                                >
                                                    Trade
                                                </button>
                                                <button
                                                    className="btn-view"
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
            <div className="table-section">
                <div className="table-section-header">
                    <h3 className="table-section-title">Top Losers</h3>
                    <div className="table-section-controls">
                        <button className="table-section-button active">Day</button>
                        <button className="table-section-button">Week</button>
                    </div>
                </div>
                <div className="market-table-container">
                    <table className="market-table">
                        <thead className="market-table-header">
                            <tr>
                                <th className="market-table-header-cell">Symbol</th>
                                <th className="market-table-header-cell">Name</th>
                                <th className="market-table-header-cell">Price</th>
                                <th className="market-table-header-cell">Change</th>
                                <th className="market-table-header-cell">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="market-table-body">
                            {loading ? (
                              <tr>
                                <td colSpan="5" className="loading-message">
                                  <div className="loading-spinner"></div>
                                  Loading market data...
                                </td>
                              </tr>
                            ) : (
                              marketMovers
                                .filter(stock => stock.changePercent < 0)
                                .sort((a, b) => a.changePercent - b.changePercent)
                                .slice(0, 5)
                                .map((stock) => (
                                    <tr key={stock.symbol} className="market-table-row">
                                        <td className="market-table-cell">
                                            <div className="symbol-cell">
                                                <div className="symbol-icon">{stock.symbol.charAt(0)}</div>
                                                <div className="symbol-text">
                                                    {stock.symbol}
                                                    <span className="symbol-name">{stock.name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="market-table-cell">{stock.name}</td>
                                        <td className="market-table-cell price-cell">${stock.price.toFixed(2)}</td>
                                        <td className="market-table-cell">
                                            <div className="gain-loss-values">
                                                <div className="trend-down">
                                                    <TrendingDown className="h-4 w-4" />
                                                    {stock.changePercent.toFixed(2)}%
                                                </div>
                                            </div>
                                        </td>
                                        <td className="market-table-cell">
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    className="btn-trade"
                                                    onClick={() => openTradeModal(stock.symbol, 'BUY')}
                                                >
                                                    Trade
                                                </button>
                                                <button
                                                    className="btn-view"
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