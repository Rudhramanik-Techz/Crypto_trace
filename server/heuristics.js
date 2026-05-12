// Heuristic algorithms for blockchain risk analysis

export function rapidTransactionHeuristic(transactions) {
  let risk = 0;
  const flags = [];
  
  // Sort transactions by timestamp
  const sortedTxs = [...transactions].sort((a, b) => parseInt(a.timeStamp) - parseInt(b.timeStamp));
  
  for (let i = 1; i < sortedTxs.length; i++) {
    const timeDiff = parseInt(sortedTxs[i].timeStamp) - parseInt(sortedTxs[i-1].timeStamp);
    if (timeDiff < 60) { // Less than 60 seconds apart
      risk += 30;
      flags.push("Rapid Transfers Detected");
      break; // Only flag once
    }
  }
  
  return { risk, flags };
}

export function highVolumeHeuristic(transactions) {
  let risk = 0;
  const flags = [];
  
  if (transactions.length > 50) {
    risk += 20;
    flags.push("High Transaction Volume");
  }
  
  return { risk, flags };
}

export function circularFlowHeuristic(graph) {
  let risk = 0;
  const flags = [];
  
  function detectCycle(graph) {
    const visited = new Set();
    
    function dfs(node, path) {
      if (path.has(node)) return true;
      if (visited.has(node)) return false;
      
      visited.add(node);
      path.add(node);
      
      for (let neighbor of graph[node] || []) {
        if (dfs(neighbor.to, path)) return true;
      }
      
      path.delete(node);
      return false;
    }
    
    return Object.keys(graph).some(node => dfs(node, new Set()));
  }
  
  if (detectCycle(graph)) {
    risk += 40;
    flags.push("Circular Flow Detected");
  }
  
  return { risk, flags };
}

export function equalAmountSplittingHeuristic(graph) {
  let risk = 0;
  const flags = [];
  
  // Group outgoing transactions by value
  const valueGroups = {};
  
  Object.keys(graph).forEach(address => {
    graph[address].forEach(tx => {
      const value = tx.value;
      if (!valueGroups[value]) valueGroups[value] = new Set();
      valueGroups[value].add(tx.to);
    });
  });
  
  // Check if any value appears in 3+ different destination wallets
  Object.keys(valueGroups).forEach(value => {
    if (valueGroups[value].size >= 3 && value !== "0") { // Ignore zero-value transactions
      risk += 25;
      flags.push("Equal Amount Splitting (Mixer Behavior)");
    }
  });
  
  return { risk, flags };
}

export function addressClusteringHeuristic(transactions) {
  let risk = 0;
  const flags = [];
  
  // Count interactions between each pair of addresses
  const interactions = {};
  
  transactions.forEach(tx => {
    const pair = [tx.from, tx.to].sort().join('-');
    interactions[pair] = (interactions[pair] || 0) + 1;
  });
  
  // Check if any pair has > 3 interactions
  Object.values(interactions).forEach(count => {
    if (count > 3) {
      risk += 15;
      flags.push("Suspicious Address Clustering");
    }
  });
  
  return { risk, flags };
}

export function buildTransactionGraph(transactions) {
  const graph = {};
  
  transactions.forEach(tx => {
    if (!graph[tx.from]) graph[tx.from] = [];
    graph[tx.from].push({
      to: tx.to,
      value: tx.value,
      timeStamp: tx.timeStamp,
      hash: tx.hash
    });
  });
  
  return graph;
}

export function generateGraphData(transactions, targetWallet) {
  const nodes = new Map();
  const links = [];
  
  // Add target wallet as main node
  nodes.set(targetWallet.toLowerCase(), {
    id: targetWallet.toLowerCase(),
    type: 'target',
    txCount: 0
  });
  
  transactions.forEach(tx => {
    const from = tx.from.toLowerCase();
    const to = tx.to.toLowerCase();
    
    // Add nodes
    if (!nodes.has(from)) {
      nodes.set(from, {
        id: from,
        type: tx.from === targetWallet ? 'target' : (tx.input === '0x' ? 'wallet' : 'contract'),
        txCount: 0
      });
    }
    
    if (!nodes.has(to)) {
      nodes.set(to, {
        id: to,
        type: tx.to === targetWallet ? 'target' : (tx.input === '0x' ? 'wallet' : 'contract'),
        txCount: 0
      });
    }
    
    // Increment transaction counts
    nodes.get(from).txCount++;
    nodes.get(to).txCount++;
    
    // Add link
    const valueInEth = (parseInt(tx.value) / 1e18).toFixed(4);
    links.push({
      source: from,
      target: to,
      value: `${valueInEth} ETH`,
      timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
      hash: tx.hash
    });
  });
  
  return {
    nodes: Array.from(nodes.values()),
    links
  };
}