// --- Main Server Entry Point (FINAL CORS FIX) ---

require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors'); // Import cors
const mongoose = require('mongoose');
const { Server } = require('socket.io');

// Import all our logic
const { protect } = require('./src/middleware');
const authRouter = require('./src/auth');
const sessionsRouter = require('./src/sessions');
const initializeSocket = require('./src/socketHandler');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 10000;

// --- Database Connection ---
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1);
  });

// --- THIS IS THE FINAL, CORRECT CORS FIX ---
const corsOptions = {
  origin: function (origin, callback) {
    // 'origin' is the URL of the frontend trying to connect
    // (e.g., https://cine-match-5o9bjrtey-shivam-s-projects-6c11e3bb.vercel.app)

    // We allow:
    // 1. No origin (like Postman requests)
    // 2. Localhost for development
    // 3. ANY of your Vercel deployment URLs
    if (!origin || 
        origin.startsWith("http://localhost:") || 
        origin.endsWith(".vercel.app")
    ) {
      callback(null, true);
    } else {
      console.error(`CORS Error: Origin ${origin} not allowed.`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
};

// --- Middleware ---
app.use(cors(corsOptions)); // Use the new, flexible CORS options
app.use(express.json());

// --- Socket.io Setup ---
const io = new Server(server, {
  cors: corsOptions, // Socket.io MUST use the same options
});

// --- API Routes ---
app.use('/api/auth', authRouter);
app.use('/api', sessionsRouter);
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the CineMatch API!' });
});

// --- Plug in Socket.io Logic ---
initializeSocket(io);

// --- Start Server ---
server.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});