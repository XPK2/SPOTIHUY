'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { MusicPlayer } from '@/components/player/MusicPlayer'
import { SongInput } from '@/components/ui/SongInput'
import { Queue } from '@/components/ui/Queue'
import { apiService, Track } from '@/lib/api'
import toast, { Toaster } from 'react-hot-toast'

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [queue, setQueue] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load queue on component mount
  useEffect(() => {
    loadQueue()
  }, [])

  const loadQueue = async () => {
    try {
      setIsLoading(true)
      const tracks = await apiService.getQueue()
      setQueue(tracks)
    } catch (error) {
      console.error('Failed to load queue:', error)
      toast.error('Failed to load music queue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitLink = async (url: string) => {
    try {
      const trackData = {
        url,
        addedBy: 'You' // In production, get from user auth
      }

      const newTrack = await apiService.addTrack(trackData)

      // Update local state
      setQueue(prev => [...prev, newTrack])

      if (!currentTrack) {
        setCurrentTrack(newTrack)
        setIsPlaying(true)
      }

      toast.success('Song added to queue!')
    } catch (error) {
      console.error('Failed to add track:', error)
      toast.error('Failed to add song. Please check the URL and try again.')
    }
  }

  const handlePlayTrack = async (trackId: number) => {
    try {
      const track = queue.find(t => t.id === trackId)
      if (track) {
        setCurrentTrack(track)
        setIsPlaying(true)
        toast.success(`Now playing: ${track.title}`)
      }
    } catch (error) {
      console.error('Failed to play track:', error)
      toast.error('Failed to play track')
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    if (currentTrack && queue.length > 1) {
      const currentIndex = queue.findIndex(t => t.id === currentTrack.id)
      const nextIndex = (currentIndex + 1) % queue.length
      const nextTrack = queue[nextIndex]
      setCurrentTrack(nextTrack)
      toast.success(`Next: ${nextTrack.title}`)
    }
  }

  const handlePrevious = () => {
    if (currentTrack && queue.length > 1) {
      const currentIndex = queue.findIndex(t => t.id === currentTrack.id)
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1
      const prevTrack = queue[prevIndex]
      setCurrentTrack(prevTrack)
      toast.success(`Previous: ${prevTrack.title}`)
    }
  }

  const handleRemoveTrack = async (trackId: number) => {
    try {
      await apiService.removeTrack(trackId)

      // Update local state
      setQueue(prev => prev.filter(t => t.id !== trackId))

      if (currentTrack?.id === trackId) {
        const remainingTracks = queue.filter(t => t.id !== trackId)
        if (remainingTracks.length > 0) {
          setCurrentTrack(remainingTracks[0])
        } else {
          setCurrentTrack(null)
          setIsPlaying(false)
        }
      }

      toast.success('Song removed from queue')
    } catch (error) {
      console.error('Failed to remove track:', error)
      toast.error('Failed to remove song')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-primary flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading music queue...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-primary flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-primary rounded-xl p-8 text-white animate-fade-in">
              <h1 className="text-3xl font-bold mb-2">Welcome to Spotihuy! 🎵</h1>
              <p className="text-blue-100 mb-4">
                Share music with your team without worrying about IP blocks. Just paste a link and enjoy!
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-soft"></div>
                  <span>Backend connected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🎵</span>
                  <span>{queue.length} songs in queue</span>
                </div>
              </div>
            </div>

            {/* Song Input */}
            <SongInput onSubmit={handleSubmitLink} />

            {/* Queue */}
            <Queue
              tracks={queue.map(track => ({
                id: track.id.toString(),
                url: track.url,
                title: track.title,
                addedBy: track.addedBy,
                addedAt: track.addedAt,
                duration: track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : undefined
              }))}
              currentTrackId={currentTrack?.id.toString()}
              onPlayTrack={(id) => handlePlayTrack(parseInt(id))}
              onRemoveTrack={(id) => handleRemoveTrack(parseInt(id))}
            />
          </div>
        </main>

        {/* Music Player */}
        <MusicPlayer
          track={currentTrack?.streamUrl || currentTrack?.url || null}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={queue.length > 1 ? handleNext : undefined}
          onPrevious={queue.length > 1 ? handlePrevious : undefined}
        />
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#36393f',
            color: '#dcddde',
            border: '1px solid #202225',
          },
        }}
      />
    </div>
  )
}