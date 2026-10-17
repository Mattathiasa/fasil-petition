import { createContext, useContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

const CountContext = createContext({ count: null, status: 'connecting' })

export function CountProvider({ children }) {
  const [count, setCount] = useState(null)
  const [status, setStatus] = useState('connecting')

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'stats', 'count'),
      (snap) => {
        setCount(snap.exists() ? (snap.data().total ?? 0) : 0)
        setStatus('live')
      },
      (err) => {
        console.error('[CountProvider]', err.code, err.message)
        setStatus('error')
      }
    )
    return unsub
  }, [])

  return (
    <CountContext.Provider value={{ count, status }}>
      {children}
    </CountContext.Provider>
  )
}

export function useCount() {
  return useContext(CountContext)
}
