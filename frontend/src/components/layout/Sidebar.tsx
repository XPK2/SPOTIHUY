import { Music, Users, MessageSquare, Settings, Volume2 } from 'lucide-react'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={`w-64 bg-background-secondary border-r border-border-primary flex flex-col ${className}`}>
      {/* Server Header */}
      <div className="p-4 border-b border-border-primary">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-text-primary font-semibold text-lg">Spotihuy</h2>
            <p className="text-text-muted text-xs">Music for Teams</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-text-primary bg-blue-600/20 rounded-lg hover:bg-blue-600/30 transition-colors">
            <Volume2 className="w-5 h-5" />
            <span className="font-medium">Now Playing</span>
          </button>

          <button className="w-full flex items-center space-x-3 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-background-tertiary rounded-lg transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span>Chat</span>
          </button>

          <button className="w-full flex items-center space-x-3 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-background-tertiary rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </nav>

      {/* Online Users */}
      <div className="p-4 border-t border-border-primary">
        <div className="flex items-center space-x-2 mb-3">
          <Users className="w-4 h-4 text-text-muted" />
          <span className="text-text-secondary text-sm font-medium">ONLINE — 5</span>
        </div>

        <div className="space-y-2">
          {['You', 'Alice', 'Bob', 'Charlie', 'David'].map((user, index) => (
            <div key={user} className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background-secondary rounded-full"></div>
              </div>
              <span className="text-text-primary text-sm">{user}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}