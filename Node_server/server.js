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

// ──────────────────────────────────────────
// Import ALL Routes
// ──────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const battleRoutes = require('./routes/battleRoutes');
const tournamentRoutes = require('./routes/tournamentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const bugReportRoutes = require('./routes/bugReportRoutes');
const newsRoutes = require('./routes/newsRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Category hierarchy controllers (special routes)
const categoryController = require('./controllers/categoryController');

// ──────────────────────────────────────────
// Apply ALL Routes
// ──────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/battle', battleRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/bug-reports', bugReportRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/admin', adminRoutes);

// Category hierarchy — separate mount points
app.get('/api/subjects/:id/topics', categoryController.getTopics);
app.get('/api/topics/:id/micro-topics', categoryController.getMicroTopics);

// Health check
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
