import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const ToastContext = createContext({ toast: () => {} })

const TOAST_MS = 4500

const STYLES = {
  error:   { background: '#2a0f0f', border: '1px solid #CC0000', icon: '⚠️' },
  success: { background: '#0f2a14', border: '1px solid #1a4a1a', icon: '✓' },
  info:    { background: '#1a1a1a', border: '1px solid #333', icon: 'ℹ️' },
}

let nextId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef(new Map())

  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach((t) => clearTimeout(t))
  }, [])

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const toast = useCallback((message, type = 'info') => {
    const id = ++nextId
    setToasts((t) => [...t, { id, message, type }])
    timersRef.current.set(id, setTimeout(() => dismiss(id), TOAST_MS))
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:max-w-sm z-50 space-y-2"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const style = STYLES[t.type] ?? STYLES.info
          return (
            <div
              key={t.id}
              className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm shadow-xl"
              style={{ background: style.background, border: style.border }}
            >
              <span aria-hidden="true">{style.icon}</span>
              <p className="flex-1 text-white leading-snug break-words">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="ዝጋ"
                className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
