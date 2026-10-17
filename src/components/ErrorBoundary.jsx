import { Component } from 'react'
import { colors, fonts } from '../lib/theme'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info?.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
          style={{ background: colors.bg, fontFamily: fonts.body }}
        >
          <p className="text-6xl mb-6">⚠️</p>
          <h1 className="text-white font-black text-3xl mb-3">የስህተት መልእክት</h1>
          <p className="text-gray-500 text-sm mb-8 max-w-md">
            ገጹን ማሳየት አልተቻለም። እባክዎን ገጹን አድስ ወይም ቆይታ ቆይተው እንደገና ይሞክሩ።
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl text-white font-bold transition-opacity hover:opacity-90"
            style={{ background: colors.brand }}
          >
            ገጹን አድስ
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
