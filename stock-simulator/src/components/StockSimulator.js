import { useState } from 'react';
import { TrendingUp, TrendingDown, PieChart, Clock, DollarSign, Briefcase, Search } from 'lucide-react';

export default function StockSimulator() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  
  // These will be populated from API data
  const portfolio = [];
  const watchlist = [];
  const marketMovers = [];
  const recentTrades = [];

  // Calculate portfolio metrics - these will use real data from API
  const portfolioValue = 0;
  const totalGainLoss = 0;
  const gainLossPercent = 0;
  const availableCash = 0;
  
  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <TrendingUp className="text-blue-600" />
          <h1 className="text-xl font-bold">StockSim Pro</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for stocks..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-lg">
            Balance: ${availableCash.toFixed(2)}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm p-4">
          <nav className="space-y-1">
            <button 
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <PieChart size={20} />
              <span className="font-medium">Dashboard</span>
            </button>
            
            <button 
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg ${activeTab === 'portfolio' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('portfolio')}
            >
              <Briefcase size={20} />
              <span className="font-medium">Portfolio</span>
            </button>
            
            <button 
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg ${activeTab === 'market' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('market')}
            >
              <TrendingUp size={20} />
              <span className="font-medium">Market</span>
            </button>
            
            <button 
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg ${activeTab === 'history' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('history')}
            >
              <Clock size={20} />
              <span className="font-medium">History</span>
            </button>
          </nav>
        </aside>
        
        {/* Main content area */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'dashboard' && (
            <>
              {/* Portfolio Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">Portfolio Value</h3>
                  <div className="flex items-end space-x-2">
                    <span className="text-2xl font-bold">${portfolioValue.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">Total Gain/Loss</h3>
                  <div className="flex items-end space-x-2">
                    <span className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalGainLoss >= 0 ? '+' : ''}${Math.abs(totalGainLoss).toFixed(2)}
                    </span>
                    <span className={`text-sm font-medium ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {gainLossPercent >= 0 ? '+' : ''}{gainLossPercent}%
                    </span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">Available Cash</h3>
                  <div className="flex items-end space-x-2">
                    <span className="text-2xl font-bold">${availableCash.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Holdings */}
              <div className="bg-white rounded-xl shadow-sm mb-6">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold">Your Holdings</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Value</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {portfolio.length > 0 ? (
                        portfolio.map((stock) => (
                          <tr key={stock.symbol}>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">{stock.symbol}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{stock.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{stock.shares}</td>
                            <td className="px-6 py-4 whitespace-nowrap">${stock.avgPrice.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">${stock.currentPrice.toFixed(2)}</td>
                            <td className={`px-6 py-4 whitespace-nowrap ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              <div className="flex items-center">
                                {stock.change >= 0 ? 
                                  <TrendingUp className="h-4 w-4 mr-1" /> : 
                                  <TrendingDown className="h-4 w-4 mr-1" />
                                }
                                {stock.change >= 0 ? '+' : ''}{stock.change}%
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              ${(stock.shares * stock.currentPrice).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex justify-end space-x-2">
                                <button className="bg-green-100 text-green-800 py-1 px-3 rounded-lg hover:bg-green-200">Buy</button>
                                <button className="bg-red-100 text-red-800 py-1 px-3 rounded-lg hover:bg-red-200">Sell</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                            No holdings found. Start building your portfolio!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Watchlist and Market Movers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold">Watchlist</h2>
                  </div>
                  <div className="p-4">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                          <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                          <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                          <th className="pb-2 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {watchlist.length > 0 ? (
                          watchlist.map((stock) => (
                            <tr key={stock.symbol} className="border-t">
                              <td className="py-3 font-medium">{stock.symbol}</td>
                              <td className="py-3">{stock.name}</td>
                              <td className="py-3">${stock.price.toFixed(2)}</td>
                              <td className={`py-3 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                <div className="flex items-center">
                                  {stock.change >= 0 ? 
                                    <TrendingUp className="h-4 w-4 mr-1" /> : 
                                    <TrendingDown className="h-4 w-4 mr-1" />
                                  }
                                  {stock.change >= 0 ? '+' : ''}{stock.change}%
                                </div>
                              </td>
                              <td className="py-3 text-right">
                                <button className="bg-blue-100 text-blue-800 py-1 px-3 rounded-lg hover:bg-blue-200">Trade</button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="py-4 text-center text-gray-500 border-t">
                              No stocks in watchlist. Add stocks to track them!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold">Market Movers</h2>
                  </div>
                  <div className="p-4">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                          <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                          <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                          <th className="pb-2 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marketMovers.length > 0 ? (
                          marketMovers.map((stock) => (
                            <tr key={stock.symbol} className="border-t">
                              <td className="py-3 font-medium">{stock.symbol}</td>
                              <td className="py-3">{stock.name}</td>
                              <td className="py-3">${stock.price.toFixed(2)}</td>
                              <td className={`py-3 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                <div className="flex items-center">
                                  {stock.change >= 0 ? 
                                    <TrendingUp className="h-4 w-4 mr-1" /> : 
                                    <TrendingDown className="h-4 w-4 mr-1" />
                                  }
                                  {stock.change >= 0 ? '+' : ''}{stock.change}%
                                </div>
                              </td>
                              <td className="py-3 text-right">
                                <button className="bg-blue-100 text-blue-800 py-1 px-3 rounded-lg hover:bg-blue-200">Trade</button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="py-4 text-center text-gray-500 border-t">
                              Loading market movers...
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'portfolio' && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Portfolio Management</h2>
              </div>
              <div className="p-6">
                {/* Portfolio management functionality will go here */}
                <p className="text-gray-500">Add your API integration for portfolio management here.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'market' && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Market Data</h2>
              </div>
              <div className="p-6">
                {/* Market data functionality will go here */}
                <p className="text-gray-500">Add your API integration for market data here.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'history' && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Transaction History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentTrades.length > 0 ? (
                      recentTrades.map((trade, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">{trade.date}</td>
                          <td className={`px-6 py-4 whitespace-nowrap font-medium ${trade.action === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                            {trade.action}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{trade.symbol}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{trade.shares}</td>
                          <td className="px-6 py-4 whitespace-nowrap">${trade.price.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">${(trade.shares * trade.price).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          No transaction history found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Trade Modal Component (Hidden by default) */}
      {/* In a real implementation, this would be conditionally rendered based on state */}
      <div className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold mb-4">Trade Stock</h2>
          
          <div className="flex space-x-4 mb-6">
            <button className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium">Buy</button>
            <button className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium">Sell</button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <div className="flex">
              <button className="bg-gray-200 px-3 rounded-l-lg">-</button>
              <input type="text" className="w-full text-center border-t border-b" value="1" />
              <button className="bg-gray-200 px-3 rounded-r-lg">+</button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
            <select className="w-full p-2 border rounded-lg">
              <option>Market Order</option>
              <option>Limit Order</option>
              <option>Stop Order</option>
            </select>
          </div>
          
          <div className="py-4 border-t border-b mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Current Price</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Total Value</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Fee</span>
              <span className="font-medium">$0.00</span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium">
              Cancel
            </button>
            <button className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium">
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}