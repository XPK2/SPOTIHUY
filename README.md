# Spotihuy - Music Streaming Proxy

A web application that acts as a proxy to bypass IP blocks for SoundCloud and YouTube, allowing teams to listen to music together. Built with Spring Boot backend and Next.js frontend.

## Architecture

- **Backend**: Java 21 + Spring Boot (JWT Auth, Media Proxy, PostgreSQL)
- **Frontend**: Next.js 14 + React + Tailwind CSS + Lucide Icons
- **Database**: PostgreSQL
- **Deployment**: Vercel (Frontend), Render/Railway/Fly.io (Backend)

## Project Structure

```
/spotihuy/
├── backend/                    # Spring Boot Application
│   ├── src/main/java/com/spotihuy/backend/
│   │   ├── controller/         # REST Controllers
│   │   ├── service/           # Business Logic
│   │   ├── entity/            # JPA Entities
│   │   ├── repository/        # Data Access Layer
│   │   ├── config/            # Configuration Classes
│   │   └── security/          # Security Configuration
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/                   # Next.js Application
│   ├── src/
│   │   ├── app/               # Next.js App Router
│   │   ├── components/        # React Components
│   │   ├── lib/              # Utilities
│   │   └── styles/           # Global Styles
│   ├── package.json
│   ├── next.config.js
│   └── tailwind.config.js
├── docker-compose.yml         # Local PostgreSQL Setup
└── README.md
```

## Quick Start

### Prerequisites

- Java 21
- Node.js 18+
- Docker & Docker Compose
- Maven (or use Maven wrapper)

### Local Development Setup

1. **Start PostgreSQL Database**
   ```bash
   docker-compose up -d
   ```

2. **Backend Setup**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```
   Backend will be available at `http://localhost:8080`

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will be available at `http://localhost:3000`

## Features

### Backend Features
- **Authentication**: JWT-based user registration and login
- **Media Proxy**: Stream audio from YouTube/SoundCloud without client IP restrictions
- **Playlist Management**: Store and manage music history in PostgreSQL
- **Real-time Updates**: WebSocket support for live queue updates

### Frontend Features
- **Discord-like UI**: Dark theme with modern design
- **Audio Player**: HTML5 audio player with custom controls
- **Queue Management**: Real-time queue display for all group members
- **Responsive Design**: Works on desktop and mobile devices

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Media
- `POST /api/media/stream` - Get stream URL from YouTube/SoundCloud
- `GET /api/media/queue` - Get current queue
- `POST /api/media/queue` - Add song to queue

### Playlist
- `GET /api/playlists` - Get user's playlists
- `POST /api/playlists` - Create new playlist
- `GET /api/playlists/{id}/tracks` - Get playlist tracks

## Deployment

### Backend Deployment (Render/Railway/Fly.io)

1. **Build JAR**
   ```bash
   cd backend
   mvn clean package -DskipTests
   ```

2. **Dockerfile** (create in backend/)
   ```dockerfile
   FROM openjdk:21-jdk-slim
   COPY target/*.jar app.jar
   ENTRYPOINT ["java","-jar","/app.jar"]
   ```

3. **Environment Variables**
   ```
   DATABASE_URL=your_postgres_connection_string
   JWT_SECRET=your_jwt_secret
   SPRING_PROFILES_ACTIVE=prod
   ```

### Frontend Deployment (Vercel)

1. **Build Command**: `npm run build`
2. **Output Directory**: `.next`
3. **Environment Variables**:
   ```
   API_URL=https://your-backend-url.com/api
   ```

## Development Notes

### Media Proxy Implementation
The backend uses yt-dlp (via ProcessBuilder) to extract audio streams from YouTube/SoundCloud. This approach:
- Bypasses client-side IP restrictions
- Provides direct audio stream URLs
- Supports multiple formats and quality options

### Security Considerations
- JWT tokens expire in 24 hours
- CORS configured for frontend domain
- Input validation on all endpoints
- Rate limiting for media requests

### Performance
- Database connection pooling with HikariCP
- Redis caching for frequently accessed data (future enhancement)
- Optimized queries with JPA specifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.