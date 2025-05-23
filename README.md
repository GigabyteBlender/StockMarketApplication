# Stock Simulator

A modern, responsive stock market simulator built with React and Node.js that allows users to practice trading stocks with virtual money.

![Stock Simulator Screenshot](example.png)

## Features

- Dashboard with portfolio summary and key metrics
- Real-time stock tracking and market data
- Watchlist for monitoring favorite stocks
- Transaction history and performance analysis
- Responsive design for desktop and mobile

## File Structure

```
stock-simulator/src/
├── components/
│   │   ├── styles/           # styles for components
│   │   ├── Dashboard.jsx      
│   │   ├── Portfolio.jsx      
│   │   ├── Market.jsx         
│   │   ├── History.jsx        
│   │   ├── Header.jsx         
│   │   ├── Sidebar.jsx        
│   │   ├── TradeModal.jsx     
│   │   └── StockSimulator.jsx # main component
│   ├── services/
│   │   └── stockService.js     
│   ├── App.css
│   ├── App.js                 # initilises the stock simulator
│   ├── index.js
│   ├── reportWebVital.js
```

## Useful code snippets
 
```jsx
// Calculate portfolio metrics (include in StockSimulator.jsx)
const portfolioValue = portfolio.reduce((total, stock) => total + (stock.shares * stock.currentPrice), 0);
const totalCost = portfolio.reduce((total, stock) => total + (stock.shares * stock.avgPrice), 0);
const totalGainLoss = portfolioValue - totalCost;
const gainLossPercent = totalCost > 0 ? ((portfolioValue / totalCost - 1) * 100).toFixed(2) : 0;
const availableCash = 10000; // Starting amount - would be tracked in a real app
```

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.x or later)
- [npm](https://www.npmjs.com/) (v6.x or later)

## Installation

### Step 1: Clone the repository

```bash
git clone https://github.com/yourusername/stock-simulator.git
cd stock-simulator
```

### Step 2: Install dependencies

```bash
npm install
```

This will install all required dependencies including:
- React
- React DOM
- Lucide React (for icons)
- Axios (for API requests)

### Step 3: Configure environment variables

Create a `.env` file in the root directory of project and add your Finnhub API key:

```
REACT_APP_FINNHUB_API_KEY=your_finnhub_api_key_here
```

**To get your Finnhub API key:**
1. Visit [Finnhub.io](https://finnhub.io/)
2. Sign up for a free account
3. Go to your dashboard and copy your API key
4. Paste it in the `.env` file

## Running the Application

### Development mode

```bash
npm start
```

This will start the development server. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Production build

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Troubleshooting Common Issues

### "Cannot find module 'lucide-react'"

If you get this error, make sure you've installed the Lucide React package:

```bash
npm install lucide-react
```

### API Rate Limits

The free Finnhub API has the following limits:
- 60 API calls/minute
- 30 symbols/minute for real-time data

If you hit rate limits, the application will fall back to mock data. Consider upgrading to a paid plan for higher limits if needed.

### No Stock Data Returned

If you're getting "No data returned from API" errors:
1. Verify your API key is correct in the `.env` file
2. Check that the stock symbol exists and is valid
3. Ensure you're not hitting API rate limits
4. Check the browser console for detailed error messages

## Setting Up the Backend (Optional)

For a complete experience with user accounts and saved portfolios:

### Step 1: Create a server directory

```bash
mkdir server
cd server
npm init -y
```

### Step 2: Install server dependencies

```bash
npm install express cors mongoose dotenv
```

### Step 3: Create the server file

Create a `server.js` file in the server directory with your backend logic.

### Step 4: Run the server

```bash
node server.js
```

## API Information

This application uses [Finnhub.io](https://finnhub.io/) for real-time stock market data. Finnhub provides:

- Real-time stock quotes
- Company profiles and information
- Historical stock data (candles)
- Market data for major exchanges

### Finnhub API Endpoints Used:
- `/quote` - Real-time stock quotes
- `/stock/profile2` - Company profiles
- `/stock/candle` - Historical price data

### Alternative APIs

If you prefer to use a different stock data provider, you can easily modify the `stockService.js` file. Other popular options include:
- [Alpha Vantage](https://www.alphavantage.co/)
- [IEX Cloud](https://iexcloud.io/)
- [Polygon.io](https://polygon.io/)
- [Yahoo Finance API](https://rapidapi.com/apidojo/api/yahoo-finance1/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Stock data provided by [Finnhub.io](https://finnhub.io/)
- Icons provided by [Lucide React](https://lucide.dev/)
- UI styling with [Tailwind CSS](https://tailwindcss.com/)