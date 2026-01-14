'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { MusicPlayer } from '@/components/player/MusicPlayer'
import { SongInput } from '@/components/ui/SongInput'
import { Queue } from '@/components/ui/Queue'

interface Track {
  id: string
  url: string
  title?: string
  addedBy: string
  addedAt: string
  duration?: string
}

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [queue, setQueue] = useState<Track[]>([])

  const handleSubmitLink = async (url: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newTrack: Track = {
      id: Date.now().toString(),
      url,
      title: `Track ${queue.length + 1}`,
      addedBy: 'You',
      addedAt: new Date().toISOString(),
      duration: '3:24'
    }

    setQueue(prev => [...prev, newTrack])

    if (!currentTrack) {
      setCurrentTrack(newTrack)
      setIsPlaying(true)
    }
  }

  const handlePlayTrack = (trackId: string) => {
    const track = queue.find(t => t.id === trackId)
    if (track) {
      setCurrentTrack(track)
      setIsPlaying(true)
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    if (currentTrack) {
      const currentIndex = queue.findIndex(t => t.id === currentTrack.id)
      const nextIndex = (currentIndex + 1) % queue.length
      setCurrentTrack(queue[nextIndex])
    }
  }

  const handlePrevious = () => {
    if (currentTrack) {
      const currentIndex = queue.findIndex(t => t.id === currentTrack.id)
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1
      setCurrentTrack(queue[prevIndex])
    }
  }

  const handleRemoveTrack = (trackId: string) => {
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
                  <span>5 members online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🔥</span>
                  <span>12 songs played today</span>
                </div>
              </div>
            </div>

            {/* Song Input */}
            <SongInput onSubmit={handleSubmitLink} />

            {/* Queue */}
            <Queue
              tracks={queue}
              currentTrackId={currentTrack?.id}
              onPlayTrack={handlePlayTrack}
              onRemoveTrack={handleRemoveTrack}
            />
          </div>
        </main>

        {/* Music Player */}
        <MusicPlayer
          track={currentTrack?.url || null}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={queue.length > 1 ? handleNext : undefined}
          onPrevious={queue.length > 1 ? handlePrevious : undefined}
        />
      </div>
    </div>
  )
}