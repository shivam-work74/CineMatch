// --- Main Server Entry Point (FINAL - MERGED WITH SOCKETS) ---
// This file connects all our modules together.

require('dotenv').config(); // Load environment variables from .env file
const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

// --- Import our new files ---
const { protect } = require('./src/middleware');
const authRouter = require('./src/auth');
const sessionsRouter = require('./src/sessions');
// --- 1. WE IMPORT OUR NEW SOCKET HANDLER ---
const initializeSocket = require('./src/socketHandler');

// --- Initialization ---
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// --- Database Connection ---
mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:');
    console.error(error);
    process.exit(1);
  });

// --- Socket.io Setup ---
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/api/auth', authRouter);
app.use('/api', sessionsRouter);

// 2. Test Route (Public)
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the CineMatch backend!' });
});

// 3. Protected Test Route (Private)
app.get('/api/protected-test', protect, (req, res) => {
  res.json({
    message: `Success! You are logged in.`,
    user: req.user
  });
});

// --- Other Protected Route Stubs (Placeholder) ---
// ... (this section is fine)


// --- 4. SOCKET.IO LOGIC IS NOW PLUGGED IN ---
// We pass our 'io' server to the handler file,
// which contains all the 'io.on("connection", ...)' logic.
initializeSocket(io);


// --- Start Server ---
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

