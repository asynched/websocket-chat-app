import { useState } from 'react'

/**
 * Helper hook for using a counter
 * @param { number } initialValue Initial counter value
 * @returns { [number, () => void, () => void] } A tuple containing the state, an increment and decrement function
 */
export default function useCounter(initialValue = 0) {
  const [counter, setCounter] = useState(initialValue)

  const increment = () => setCounter((c) => c + 1)
  const decrement = () => setCounter((c) => c - 1)

  return [counter, increment, decrement]
}
