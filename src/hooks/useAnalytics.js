import { useState } from 'react'

const useAnalytics = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyzeWallet = async (address, apiKey) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        address: address,
        apikey: apiKey
      })
      const res = await fetch(`/api/analyze?${params.toString()}`)
      if (!res.ok) throw new Error('Server error ' + res.status)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setLoading(false)
      return data
    } catch (err) {
      let msg = 'An error occurred during analysis'
      if (err.message.includes('429')) msg = 'Rate limit exceeded. Please try again later.'
      else if (err.message) msg = err.message
      setError(msg)
      setLoading(false)
      return null
    }
  }

  return { analyzeWallet, loading, error }
}

export default useAnalytics