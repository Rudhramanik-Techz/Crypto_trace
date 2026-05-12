import express from 'express';
import cors from 'cors';
import axios from 'axios';
import {
  rapidTransactionHeuristic,
  highVolumeHeuristic,
  circularFlowHeuristic,
  equalAmountSplittingHeuristic,
  addressClusteringHeuristic,
  buildTransactionGraph,
  generateGraphData
} from './heuristics.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// TEST endpoint to validate API key
app.get('/api/test-key', async (req, res) => {
  const { apikey } = req.query;
  
  if (!apikey || apikey.trim() === '') {
    return res.status(400).json({ error: 'API key is required' });
  }

  const cleanKey = apikey.trim();
  console.log(`🔑 Testing API key: ${cleanKey.substring(0, 10)}...${cleanKey.substring(cleanKey.length - 5)}`);

  try {
    const response = await axios.get('https://api.etherscan.io/v2/api', {
      params: {
        module: 'account',
        action: 'balance',
        address: '0x0000000000000000000000000000000000000000',
        tag: 'latest',
        apikey: cleanKey,
        chainid: 1
      },
      timeout: 10000
    });

    console.log(`📊 Etherscan Response:`, response.data);
    
    if (response.data.status === '0') {
      return res.status(400).json({ 
        valid: false,
        message: response.data.message || 'API key validation failed',
        etherscanResponse: response.data
      });
    }

    return res.json({ 
      valid: true,
      message: 'API key is valid!',
      etherscanResponse: response.data
    });
  } catch (err) {
    console.error(`❌ API Key Test Error:`, err.message);
    return res.status(500).json({ 
      error: `Failed to test API key: ${err.message}`,
      valid: false 
    });
  }
});

// Main analysis endpoint
app.get('/api/analyze', async (req, res) => {
  const { address, apikey } = req.query;

  // Check 1: both params present
  if (!address || !apikey) {
    return res.status(400).json({ error: 'Both address and apikey query params are required' });
  }

  // Check 2: apikey not empty string
  if (apikey.trim() === '') {
    return res.status(400).json({ error: 'API key is empty. Add VITE_ETHERSCAN_API_KEY to your .env file.' });
  }

  // Check 3: valid Ethereum address format
  if (!/^0x[0-9a-fA-F]{40}$/.test(address.trim())) {
    return res.status(400).json({ error: `Invalid Ethereum address format: "${address}". Must be 0x followed by 40 hex characters (42 total).` });
  }

  const cleanAddress = address.trim();
  const cleanKey = apikey.trim();

  console.log(`📍 Analyzing: ${cleanAddress}`);
  console.log(`🔑 Using API key: ${cleanKey.substring(0, 10)}...${cleanKey.substring(cleanKey.length - 5)}`);

  try {
    const response = await axios.get('https://api.etherscan.io/v2/api', {
      params: {
        module: 'account',
        action: 'txlist',
        address: cleanAddress,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 100,
        sort: 'asc',
        apikey: cleanKey,
        chainid: 1
      },
      timeout: 15000
    });

    console.log(`✅ Etherscan Response Status: ${response.data.status}`);
    console.log(`📝 Response Message: ${response.data.message}`);
    console.log(`📊 Full Response:`, JSON.stringify(response.data, null, 2));

    // Check 4: Etherscan returned an error
    if (response.data.status === '0') {
      const msg = response.data.message || 'Unknown Etherscan error';
      const result = response.data.result;

      console.error(`❌ Etherscan returned status 0`);
      console.error(`   Message: ${msg}`);
      console.error(`   Result: ${result}`);

      // No transactions is not an error
      if (result === 'No transactions found') {
        console.log(`✅ No transactions but this is OK`);
        return res.json({
          wallet: cleanAddress,
          riskScore: 0,
          status: 'Low Risk',
          flags: [],
          transactions: [],
          graphData: { nodes: [], links: [] },
          stats: {
            totalTransactions: 0,
            totalVolume: '0 ETH',
            uniqueAddresses: 0,
            timeSpan: '0 days'
          }
        });
      }

      // Real Etherscan API error
      console.error(`❌ Real API error detected`);
      return res.status(400).json({ error: `Etherscan error: ${msg}. Check your API key is valid and not rate-limited.` });
    }

    const transactions = response.data.result;
    console.log(`📈 Received ${transactions.length ? transactions.length : 0} transactions`);

    if (!Array.isArray(transactions)) {
      console.error(`❌ Response result is not an array:`, typeof transactions);
      return res.status(500).json({ error: 'Unexpected response from Etherscan API' });
    }

    console.log(`Analyzing wallet: ${cleanAddress}, ${transactions.length} transactions`);

    // Build transaction graph
    const graph = buildTransactionGraph(transactions);

    // Apply all heuristic algorithms
    let totalRisk = 0;
    let allFlags = [];

    const rapidResult = rapidTransactionHeuristic(transactions);
    totalRisk += rapidResult.risk;
    allFlags.push(...rapidResult.flags);

    const volumeResult = highVolumeHeuristic(transactions);
    totalRisk += volumeResult.risk;
    allFlags.push(...volumeResult.flags);

    const circularResult = circularFlowHeuristic(graph);
    totalRisk += circularResult.risk;
    allFlags.push(...circularResult.flags);

    const splittingResult = equalAmountSplittingHeuristic(graph);
    totalRisk += splittingResult.risk;
    allFlags.push(...splittingResult.flags);

    const clusteringResult = addressClusteringHeuristic(transactions);
    totalRisk += clusteringResult.risk;
    allFlags.push(...clusteringResult.flags);

    const riskScore = Math.min(100, Math.max(0, totalRisk));

    let status;
    if (riskScore < 30) status = 'Low Risk';
    else if (riskScore <= 60) status = 'Medium Risk';
    else status = 'High Risk';

    const uniqueAddresses = new Set();
    let totalVolume = 0;
    transactions.forEach(tx => {
      uniqueAddresses.add(tx.from.toLowerCase());
      if (tx.to) uniqueAddresses.add(tx.to.toLowerCase());
      totalVolume += parseInt(tx.value) || 0;
    });

    const totalVolumeEth = (totalVolume / 1e18).toFixed(4);

    const timestamps = transactions.map(tx => parseInt(tx.timeStamp));
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);
    const timeSpanDays = Math.ceil((maxTime - minTime) / (24 * 60 * 60));

    const graphData = generateGraphData(transactions, cleanAddress);

    const result = {
      wallet: cleanAddress,
      riskScore,
      status,
      flags: [...new Set(allFlags)],
      transactions,
      graphData,
      stats: {
        totalTransactions: transactions.length,
        totalVolume: `${totalVolumeEth} ETH`,
        uniqueAddresses: uniqueAddresses.size,
        timeSpan: `${timeSpanDays} days`
      }
    };

    console.log(`Analysis complete. Risk Score: ${riskScore}, Status: ${status}`);
    res.json(result);

  } catch (error) {
    console.error(`❌ Error during analysis:`, error.message);
    console.error(`   Error Code: ${error.code}`);
    console.error(`   Error Type: ${error.constructor.name}`);

    if (error.response) {
      console.error(`   HTTP Status: ${error.response.status}`);
      console.error(`   Response Data:`, error.response.data);
    }

    if (error.code === 'ECONNABORTED') {
      console.error(`❌ Timeout - Etherscan took too long to respond`);
      return res.status(504).json({ error: 'Etherscan request timed out. Try again.' });
    }
    if (error.response?.status === 429) {
      console.error(`❌ Rate limited by Etherscan`);
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }
    if (error.response) {
      console.error(`❌ Etherscan API unreachable`);
      return res.status(502).json({ error: `Etherscan API unreachable: ${error.response.status}` });
    }

    console.error(`❌ Other error:`, error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Blockchain Analytics Server running on port ${PORT}`);
  console.log(`📊 Ready to analyze Ethereum transactions`);
});