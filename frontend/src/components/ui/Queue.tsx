import { Play, MoreVertical, Trash2, Clock } from 'lucide-react'

interface Track {
  id: string
  url: string
  title?: string
  addedBy: string
  addedAt: string
  duration?: string
}

interface QueueProps {
  tracks: Track[]
  currentTrackId?: string
  onPlayTrack: (trackId: string) => void
  onRemoveTrack?: (trackId: string) => void
  className?: string
}

export function Queue({ tracks, currentTrackId, onPlayTrack, onRemoveTrack, className }: QueueProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPlatformIcon = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return '🎵'
    } else if (url.includes('soundcloud.com')) {
      return '🌊'
    }
    return '🎵'
  }

  return (
    <div className={`bg-background-secondary rounded-xl border border-border-primary ${className}`}>
      <div className="p-6 border-b border-border-primary">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold text-text-primary">Queue</h3>
            <span className="bg-background-tertiary px-2 py-1 rounded-full text-sm text-text-secondary">
              {tracks.length}
            </span>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {tracks.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-background-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-text-muted" />
            </div>
            <p className="text-text-muted text-lg font-medium mb-2">Queue is empty</p>
            <p className="text-text-secondary text-sm">Add a song above to get started!</p>
          </div>
        ) : (
          <div className="divide-y divide-border-primary">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className={`p-4 hover:bg-background-tertiary transition-colors group ${
                  track.id === currentTrackId ? 'bg-blue-500/10 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  {/* Track Number / Play Button */}
                  <div className="flex-shrink-0">
                    {track.id === currentTrackId ? (
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Play className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <button
                        onClick={() => onPlayTrack(track.id)}
                        className="w-10 h-10 bg-background-tertiary hover:bg-background-primary rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                      >
                        {index + 1}
                      </button>
                    )}
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">{getPlatformIcon(track.url)}</span>
                      <p className="text-text-primary font-medium truncate">
                        {track.title || `Track ${index + 1}`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-text-secondary">
                      <span>Added by {track.addedBy}</span>
                      <span>•</span>
                      <span>{formatTime(track.addedAt)}</span>
                      {track.duration && (
                        <>
                          <span>•</span>
                          <span>{track.duration}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onPlayTrack(track.id)}
                      className="p-2 text-text-secondary hover:text-blue-500 hover:bg-background-tertiary rounded-lg transition-colors"
                    >
                      <Play className="w-4 h-4" />
                    </button>

                    {onRemoveTrack && (
                      <button
                        onClick={() => onRemoveTrack(track.id)}
                        className="p-2 text-text-secondary hover:text-red-500 hover:bg-background-tertiary rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-background-tertiary rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}