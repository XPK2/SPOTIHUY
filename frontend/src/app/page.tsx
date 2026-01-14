'use client'

import { useState } from 'react'
import { Music, Users, Play, Pause } from 'lucide-react'

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [queue, setQueue] = useState<string[]>([])

  const handleSubmitLink = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const link = formData.get('link') as string

    if (link.trim()) {
      setQueue(prev => [...prev, link])
      setCurrentTrack(link)
      setIsPlaying(true)
      e.currentTarget.reset()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary to-background-tertiary">
      {/* Header */}
      <header className="bg-background-secondary border-b border-border-primary px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Music className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-text-primary">Spotihuy</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-text-muted" />
            <span className="text-text-secondary text-sm">5 members online</span>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Link Input */}
          <div className="bg-background-secondary rounded-lg p-6 mb-6 border border-border-primary">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">Share a Song</h2>
            <form onSubmit={handleSubmitLink} className="space-y-4">
              <div className="flex space-x-3">
                <input
                  type="url"
                  name="link"
                  placeholder="Paste YouTube or SoundCloud link here..."
                  className="flex-1 px-4 py-3 bg-background-tertiary border border-border-secondary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Play</span>
                </button>
              </div>
            </form>
          </div>

          {/* Now Playing */}
          {currentTrack && (
            <div className="bg-background-secondary rounded-lg p-6 mb-6 border border-border-primary">
              <h3 className="text-lg font-semibold mb-4 text-text-primary">Now Playing</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-background-tertiary rounded-lg flex items-center justify-center">
                    <Music className="w-8 h-8 text-text-muted" />
                  </div>
                  <div>
                    <p className="text-text-primary font-medium truncate max-w-md">
                      {currentTrack}
                    </p>
                    <p className="text-text-secondary text-sm">Added by you</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Queue */}
          <div className="bg-background-secondary rounded-lg p-6 border border-border-primary">
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Queue ({queue.length})</h3>
            {queue.length === 0 ? (
              <p className="text-text-muted text-center py-8">
                No songs in queue. Add a link above to get started!
              </p>
            ) : (
              <div className="space-y-3">
                {queue.map((track, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-3 bg-background-tertiary rounded-lg hover:bg-background-tertiary/80 transition-colors duration-200"
                  >
                    <div className="w-10 h-10 bg-background-primary rounded flex items-center justify-center text-text-muted font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-text-primary truncate max-w-md">{track}</p>
                      <p className="text-text-secondary text-sm">Added by you</p>
                    </div>
                    <button className="text-text-muted hover:text-blue-500 transition-colors duration-200">
                      <Play className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}