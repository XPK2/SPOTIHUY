import { useState } from 'react'
import { Send, Link2, Loader2 } from 'lucide-react'

interface SongInputProps {
  onSubmit: (url: string) => Promise<void>
  className?: string
}

export function SongInput({ onSubmit, className }: SongInputProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return string.includes('youtube.com') || string.includes('youtu.be') || string.includes('soundcloud.com')
    } catch (_) {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    if (!isValidUrl(url)) {
      setError('Please enter a valid YouTube or SoundCloud URL')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      await onSubmit(url)
      setUrl('')
    } catch (err) {
      setError('Failed to add song. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`bg-background-secondary rounded-xl p-6 border border-border-primary ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        <Link2 className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold text-text-primary">Share a Song</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              if (error) setError('')
            }}
            placeholder="Paste YouTube or SoundCloud link here..."
            className={`w-full px-4 py-3 bg-background-tertiary border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-border-secondary focus:border-transparent'
            }`}
            disabled={isLoading}
          />
          {error && (
            <p className="text-red-400 text-sm mt-1">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!url.trim() || isLoading}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Adding Song...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Add to Queue</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-4 p-3 bg-background-tertiary rounded-lg">
        <p className="text-text-secondary text-sm">
          <span className="font-medium text-text-primary">Supported platforms:</span> YouTube, SoundCloud
        </p>
      </div>
    </div>
  )
}