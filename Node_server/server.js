app.use(cors());
app.use(express.json());

// Routes
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

// Apply Routes
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