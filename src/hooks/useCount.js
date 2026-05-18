import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export function useCount() {
  const [count, setCount] = useState(null)   // null = still loading
  const [status, setStatus] = useState('connecting') // 'connecting' | 'live' | 'error'

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'stats', 'count'),
      (snap) => {
        setCount(snap.exists() ? (snap.data().total ?? 0) : 0)
        setStatus('live')
      },
      (err) => {
        console.error('[useCount]', err.code, err.message)
        setStatus('error')
      }
    )
    return unsub
  }, [])

  return { count, status }
}
