import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export function useSigners(n = 25) {
  const [signers, setSigners] = useState([])
  const [status, setStatus] = useState('connecting')

  useEffect(() => {
    const q = query(
      collection(db, 'signatures'),
      orderBy('createdAt', 'desc'),
      limit(n)
    )
    const unsub = onSnapshot(
      q,
      (snap) => {
        setSigners(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setStatus('live')
      },
      (err) => {
        console.error('[useSigners]', err.code, err.message)
        setStatus('error')
      }
    )
    return unsub
  }, [n])

  return { signers, status }
}
