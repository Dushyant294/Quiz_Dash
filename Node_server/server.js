const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io configuration for real-time features (1v1 battles)
const io = new Server(server, {
  cors: {
    origin: '*', // Allows all origins; restrict to frontend URL in production
    methods: ['GET', 'POST']
  }
});

// Make io accessible globally if needed (e.g. in controllers)
app.set('io', io);

// Middleware configuration
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads

// Logging middleware for development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'QuizHub API is running perfectly!' 
  });
});


// Global 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error' 
  });
});

const PORT = process.env.PORT || 5000;

// Start the HTTP Server (which handles Express and Socket.io)
server.listen(PORT, () => {
  console.log(`[SERVER] Node.js server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
