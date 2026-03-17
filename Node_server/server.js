const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const env = require('./config/env');
const db = require('./config/db'); // Will log connection status

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Can be restricted later to frontend url
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Apply Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API and Database are connected!' });
});

// Socket.io connection placeholder
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Create global io instance to use in controllers if needed
app.set('io', io);

// Start server
server.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
