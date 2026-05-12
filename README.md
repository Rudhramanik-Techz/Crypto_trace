# ChainTrace - Blockchain Risk Analytics System

A full-stack blockchain analytics web application that analyzes Ethereum transaction data to detect suspicious behavior patterns using advanced heuristic algorithms.



## 🚀 Features

- **Real-time Blockchain Analysis**: Fetches live Ethereum transaction data from Etherscan API
- **Advanced Risk Detection**: Implements 5 sophisticated heuristic algorithms:
  - Rapid Transaction Detection
  - High Volume Analysis
  - Circular Flow Detection (Money Laundering)
  - Equal Amount Splitting (Mixer Behavior)
  - Address Clustering Analysis
- **Interactive Transaction Graph**: Visualize transaction flows with D3.js force-directed graphs
- **Modern UI**: Dark theme with glassmorphism effects and neon accents
- **Risk Scoring**: Comprehensive risk assessment with color-coded alerts
- **Transaction History**: Detailed transaction table with Etherscan integration

## 🛠 Tech Stack

### Frontend
- **React 18** + **Vite** - Modern React development
- **Tailwind CSS** - Utility-first styling
- **react-force-graph-2d** - Interactive graph visualization
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** + **Express** - RESTful API server
- **Etherscan API** - Real blockchain data source
- **Advanced Algorithms** - Custom heuristic implementations

## 📋 Prerequisites

- Node.js 16+ and npm
- Etherscan API key (free from [etherscan.io/apis](https://etherscan.io/apis))

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd blockchain-analytics
npm install
cd server && npm install && cd ..
```

### 2. Get Etherscan API Key

1. Visit [etherscan.io/apis](https://etherscan.io/apis)
2. Create a free account
3. Generate an API key
4. Keep it handy for the application

### 3. Start the Application

```bash
npm run dev
```

This starts both the frontend (port 5173) and backend (port 3001) concurrently.

### 4. Access the Application

Open your browser to `http://localhost:5173`

## 📖 Usage Guide

### Analyzing a Wallet

1. **Enter Wallet Address**: Input a valid Ethereum address (0x...)
2. **Add API Key**: Enter your Etherscan API key
3. **Click Analyze**: The system will:
   - Fetch up to 100 recent transactions
   - Build an in-memory transaction graph
   - Apply all 5 heuristic algorithms
   - Calculate risk score (0-100)
   - Generate interactive visualizations

### Understanding Risk Scores

- **0-29**: 🟢 **Low Risk** - Normal transaction patterns
- **30-60**: 🟡 **Medium Risk** - Some suspicious patterns detected
- **61-100**: 🔴 **High Risk** - Multiple risk factors identified

### Risk Flags Explained

| Flag | Description | Risk Points |
|------|-------------|-------------|
| **Rapid Transfers** | Transactions < 60 seconds apart | +30 |
| **High Volume** | More than 50 transactions | +20 |
| **Circular Flow** | Money laundering patterns | +40 |
| **Equal Splitting** | Mixer-like behavior | +25 |
| **Address Clustering** | Coordinated activity | +15 |

## 🔧 API Reference

### Analyze Wallet Endpoint

```http
GET /api/analyze?address={wallet}&apikey={key}
```

**Parameters:**
- `address` - Ethereum wallet address (0x...)
- `apikey` - Etherscan API key

**Response:**
```json
{
  "wallet": "0x...",
  "riskScore": 75,
  "status": "High Risk",
  "flags": ["Rapid Transfers Detected", "Circular Flow Detected"],
  "transactions": [...],
  "graphData": {
    "nodes": [...],
    "links": [...]
  },
  "stats": {
    "totalTransactions": 87,
    "totalVolume": "12.4 ETH",
    "uniqueAddresses": 23,
    "timeSpan": "45 days"
  }
}
```

## 🏗 Project Structure

```
blockchain-analytics/
├── server/
│   ├── index.js          # Express API server
│   ├── heuristics.js     # Risk detection algorithms
│   └── package.json      # Backend dependencies
├── src/
│   ├── components/       # React components
│   │   ├── Header.jsx
│   │   ├── SearchPanel.jsx
│   │   ├── RiskScore.jsx
│   │   ├── TransactionGraph.jsx
│   │   ├── StatsRow.jsx
│   │   ├── FlagsPanel.jsx
│   │   └── TransactionTable.jsx
│   ├── hooks/
│   │   └── useAnalytics.js
│   ├── utils/
│   │   └── formatters.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json          # Frontend dependencies
├── vite.config.js        # Vite configuration
└── tailwind.config.js    # Tailwind CSS config
```

## 🎨 Design System

### Colors
- **Background**: `#0a0a0f` (Dark)
- **Cards**: `#0f1729` (Dark Blue)
- **Accent Colors**:
  - Cyan: `#00d4ff`
  - Purple: `#7c3aed`
  - Green: `#00ff88`
  - Red: `#ff4444`

### Typography
- **Headers**: Inter font family
- **Addresses**: Monaco/Menlo monospace
- **Body**: Inter regular

## 🔒 Security & Privacy

- **No Data Storage**: Completely stateless application
- **API Key Security**: Keys are only used client-side, never stored
- **HTTPS Only**: All external API calls use secure connections
- **No Personal Data**: Only analyzes public blockchain transactions

## 🚨 Rate Limits & Limitations

- **Etherscan API**: 5 calls/second (free tier)
- **Transaction Limit**: 100 most recent transactions per analysis
- **Supported Networks**: Ethereum mainnet only
- **Real-time Data**: Analysis reflects current blockchain state

## 🛠 Development

### Available Scripts

```bash
npm run dev        # Start development servers
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Adding New Heuristics

1. Create algorithm in `server/heuristics.js`
2. Add to analysis pipeline in `server/index.js`
3. Update risk calculation logic
4. Add flag descriptions in `FlagsPanel.jsx`

## 📊 Sample Wallets for Testing

Try these well-known Ethereum addresses:

- **Vitalik Buterin**: `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`
- **Uniswap V3**: `0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests if applicable
5. Submit a pull request


## 🙏 Acknowledgments

- **Etherscan** for providing free blockchain data API
- **D3.js** community for graph visualization inspiration
- **Chainalysis** for risk analysis methodology insights

---

**⚠️ Disclaimer**: This tool is for educational and research purposes. Risk scores are based on heuristic analysis and should not be the sole basis for financial or legal decisions.
