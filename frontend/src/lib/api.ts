import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export interface Track {
  id: number
  url: string
  title: string
  artist?: string
  thumbnailUrl?: string
  duration?: number
  platform: 'YOUTUBE' | 'SOUNDCLOUD'
  addedBy: string
  addedAt: string
  streamUrl?: string
}

export interface AddTrackRequest {
  url: string
  addedBy: string
}

class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Get all tracks in queue
  async getQueue(): Promise<Track[]> {
    try {
      const response = await this.api.get<Track[]>('/tracks')
      return response.data
    } catch (error) {
      console.error('Failed to get queue:', error)
      throw error
    }
  }

  // Add a track to queue
  async addTrack(trackData: AddTrackRequest): Promise<Track> {
    try {
      const response = await this.api.post<Track>('/tracks', trackData)
      return response.data
    } catch (error) {
      console.error('Failed to add track:', error)
      throw error
    }
  }

  // Get track by ID
  async getTrack(id: number): Promise<Track> {
    try {
      const response = await this.api.get<Track>(`/tracks/${id}`)
      return response.data
    } catch (error) {
      console.error('Failed to get track:', error)
      throw error
    }
  }

  // Get stream URL for track
  async getStreamUrl(trackId: number): Promise<string> {
    try {
      const response = await this.api.get<string>(`/tracks/${trackId}/stream`)
      return response.data
    } catch (error) {
      console.error('Failed to get stream URL:', error)
      throw error
    }
  }

  // Remove track from queue
  async removeTrack(id: number): Promise<void> {
    try {
      await this.api.delete(`/tracks/${id}`)
    } catch (error) {
      console.error('Failed to remove track:', error)
      throw error
    }
  }

  // Get tracks by user
  async getTracksByUser(addedBy: string): Promise<Track[]> {
    try {
      const response = await this.api.get<Track[]>(`/tracks/user/${addedBy}`)
      return response.data
    } catch (error) {
      console.error('Failed to get user tracks:', error)
      throw error
    }
  }
}

export const apiService = new ApiService()