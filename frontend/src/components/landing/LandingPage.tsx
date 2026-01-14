'use client'

import { useState } from 'react'
import { Music, Users, Zap, Shield, Play, Star, ArrowRight } from 'lucide-react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

export function LandingPage() {
  const [showAuth, setShowAuth] = useState<'login' | 'register' | null>(null)

  const features = [
    {
      icon: <Music className="w-8 h-8 text-blue-500" />,
      title: 'Stream Anywhere',
      description: 'Bypass IP restrictions and stream music from YouTube and SoundCloud anywhere, anytime.'
    },
    {
      icon: <Users className="w-8 h-8 text-green-500" />,
      title: 'Team Collaboration',
      description: 'Share music with your team in real-time. Create shared playlists and enjoy together.'
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: 'Lightning Fast',
      description: 'Optimized streaming with minimal latency. No buffering, just pure music enjoyment.'
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-500" />,
      title: 'Secure & Private',
      description: 'Your music preferences stay private. Secure authentication and data protection.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Developer',
      content: 'Finally, I can listen to my favorite music at work without restrictions. Spotihuy is a game changer!',
      avatar: 'SC'
    },
    {
      name: 'Mike Johnson',
      role: 'Designer',
      content: 'The team feature is amazing. We share music during our remote sessions and it keeps everyone motivated.',
      avatar: 'MJ'
    },
    {
      name: 'Alex Rodriguez',
      role: 'Project Manager',
      content: 'Clean interface, easy to use, and works perfectly. No more blocked music at the office!',
      avatar: 'AR'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Spotihuy</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
            <a href="#testimonials" className="text-white/80 hover:text-white transition-colors">Testimonials</a>
            <a href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAuth('login')}
              className="text-white/80 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setShowAuth('register')}
              className="bg-white text-background-primary px-6 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Music Without
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"> Limits</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed">
              Bypass IP restrictions and stream music from YouTube and SoundCloud with your team.
              Professional-grade music streaming for modern workplaces.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => setShowAuth('register')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Streaming Free
              <ArrowRight className="w-5 h-5 inline ml-2" />
            </button>
            <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-white/60 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1M+</div>
              <div className="text-white/60 text-sm">Songs Streamed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-white/60 text-sm">Teams</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-white/60 text-sm">Uptime</div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-background-secondary/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Spotihuy?</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Experience music streaming like never before with features designed for modern teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-background-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Loved by Teams Worldwide</h2>
            <p className="text-white/70 text-lg">See what our users say about Spotihuy</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-background-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/80 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-white/60 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Stream Without Limits?</h2>
          <p className="text-white/80 text-lg mb-8">
            Join thousands of teams already enjoying unrestricted music streaming.
          </p>
          <button
            onClick={() => setShowAuth('register')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 inline ml-2" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-background-secondary/50 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Spotihuy</span>
              </div>
              <p className="text-white/60 text-sm">
                Music streaming without boundaries for modern teams.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-white/60 text-sm">
                <div>Features</div>
                <div>Pricing</div>
                <div>Security</div>
                <div>API</div>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-white/60 text-sm">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-white/60 text-sm">
                <div>Help Center</div>
                <div>Community</div>
                <div>Status</div>
                <div>Privacy</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/60 text-sm mb-4 md:mb-0">
              © 2026 Spotihuy. All rights reserved.
            </div>
            <div className="flex space-x-6 text-white/60 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background-secondary rounded-2xl border border-white/10 max-w-md w-full">
            {showAuth === 'login' ? (
              <LoginForm onClose={() => setShowAuth(null)} onSwitchToRegister={() => setShowAuth('register')} />
            ) : (
              <RegisterForm onClose={() => setShowAuth(null)} onSwitchToLogin={() => setShowAuth('login')} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}