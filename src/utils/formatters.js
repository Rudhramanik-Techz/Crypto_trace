export const truncateAddress = (address, start = 8, end = 5) => {
  if (!address) return ''
  if (address.length <= start + end) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

export const formatEthValue = (weiValue) => {
  const eth = parseFloat(weiValue) / 1e18
  if (eth === 0) return '0 ETH'
  if (eth < 0.0001) return '<0.0001 ETH'
  return `${eth.toFixed(6)} ETH`
}

export const timeAgo = (timestamp) => {
  const diff = Date.now() - parseInt(timestamp) * 1000
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (days > 0) return `${days}d ago`
  if (hrs > 0) return `${hrs}h ago`
  if (mins > 0) return `${mins}m ago`
  return 'just now'
}