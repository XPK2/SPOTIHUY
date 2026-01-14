import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle } from 'lucide-react'

interface MusicPlayerProps {
  track: string | null
  isPlaying: boolean
  onPlayPause: () => void
  onNext?: () => void
  onPrevious?: () => void
}

export function MusicPlayer({ track, isPlaying, onPlayPause, onNext, onPrevious }: MusicPlayerProps) {
  const [volume, setVolume] = useState(75)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Audio play failed:', error)
          // For demo: use a sample audio URL
          if (track && track.includes('youtube.com')) {
            console.log('Demo: YouTube streaming will be implemented. Using sample audio.')
            audioRef.current.src = "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"
            audioRef.current.play()
          }
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, track])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration || 0)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  if (!track) return null

  // For YouTube URLs, show embed player
  const isYouTubeUrl = track && (track.includes('youtube.com') || track.includes('youtu.be'))
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[7].length === 11) ? match[7] : null
  }

  if (isYouTubeUrl) {
    const videoId = getYouTubeVideoId(track)
    if (videoId) {
      return (
        <div className="bg-background-secondary border-t border-border-primary p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-text-primary font-medium">YouTube Video</p>
                <p className="text-text-secondary text-sm">Embedded Player</p>
              </div>
            </div>
            <div className="text-text-secondary text-sm">
              {isPlaying ? 'Playing' : 'Paused'}
            </div>
          </div>

          <div className="aspect-video w-full max-w-2xl mx-auto">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=0`}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )
    }
  }

  return (
    <div className="bg-background-secondary border-t border-border-primary p-4">
      <audio
        ref={audioRef}
        src={track || "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        preload="metadata"
      />

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-background-tertiary rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-text-muted mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Track Info */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-background-tertiary rounded-lg flex items-center justify-center flex-shrink-0">
            <Volume2 className="w-6 h-6 text-text-muted" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-text-primary font-medium truncate text-sm">
              {track.length > 50 ? `${track.substring(0, 50)}...` : track}
            </p>
            <p className="text-text-secondary text-xs">YouTube • Added by you</p>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-2 rounded-lg transition-colors ${
              isShuffle ? 'text-blue-500 bg-blue-500/20' : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
            }`}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={onPrevious}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-background-tertiary rounded-lg transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onPlayPause}
            className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          <button
            onClick={onNext}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-background-tertiary rounded-lg transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsRepeat(!isRepeat)}
            className={`p-2 rounded-lg transition-colors ${
              isRepeat ? 'text-blue-500 bg-blue-500/20' : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
            }`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <button
            onClick={toggleMute}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-background-tertiary rounded-lg transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-20 h-1 bg-background-tertiary rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>
    </div>
  )
}