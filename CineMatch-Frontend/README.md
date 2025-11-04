# CineMatch

CineMatch is a real-time movie matching application that allows users to create sessions, swipe on movies, and find matches with their friends. The app uses The Movie Database (TMDB) API to provide a rich collection of movies for users to browse and match.

## Features

- User authentication (login/register)
- Create and join movie swiping sessions
- Real-time swiping with WebSockets
- Movie matching algorithm
- Responsive design with modern UI

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB with Mongoose
- **Real-time Communication**: Socket.IO
- **API**: The Movie Database (TMDB) API

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- MongoDB database (local or Atlas)
- TMDB API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install backend dependencies:
   ```bash
   cd CineMatch-Backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../CineMatch-Frontend
   npm install
   ```

4. Set up environment variables (see .env.example files in both directories)

5. Run the development servers:
   ```bash
   # In CineMatch-Backend directory
   npm run dev
   
   # In CineMatch-Frontend directory
   npm run dev
   ```

## Deployment

### Render Deployment

1. Fork this repository to your GitHub account
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure environment variables:
   - DATABASE_URL: Your MongoDB connection string
   - TMDB_API_KEY: Your TMDB API key
   - JWT_SECRET: A strong secret for JWT tokens
   - FRONTEND_URL: Your frontend URL (e.g., https://your-app.onrender.com)
5. Set the build command: `cd CineMatch-Backend && npm install`
6. Set the start command: `cd CineMatch-Backend && npm start`
7. Deploy!

### Environment Variables

#### Backend (.env)
```
DATABASE_URL=your_mongodb_connection_string
TMDB_API_KEY=your_tmdb_api_key
JWT_SECRET=your_strong_jwt_secret
FRONTEND_URL=your_frontend_url
PORT=3001
```

## Project Structure

```
├── CineMatch-Backend/
│   ├── src/
│   │   ├── models/     # Database models
│   │   ├── auth.js     # Authentication routes
│   │   ├── sessions.js # Session routes
│   │   ├── middleware.js # Authentication middleware
│   │   └── socketHandler.js # WebSocket handling
│   ├── .env            # Environment variables
│   └── server.js       # Main server file
└── CineMatch-Frontend/
    ├── src/
    │   ├── components/ # React components
    │   ├── lib/        # API and socket utilities
    │   ├── pages/      # Page components
    │   ├── store/      # State management (Zustand)
    │   └── App.jsx     # Main app component
    └── vite.config.js  # Vite configuration
```

## Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Learn More

To learn more about the technologies used in this project:

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Socket.IO](https://socket.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)