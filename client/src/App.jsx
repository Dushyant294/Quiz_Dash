import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Categories from "./pages/Categories";
import Explore from "./pages/Explore";
import Leaderboard from "./pages/Leaderboard";
import QuizBattle from "./pages/QuizBattle";
import Tournaments from "./pages/Tournaments";
import QuizPlayView from "./pages/QuizPlayView";
import Profile from "./pages/Profile";
import ReportBug from "./pages/ReportBug";
import News from "./pages/News";
import CreateQuiz from "./pages/CreateQuiz";
import MyQuizzes from "./pages/MyQuizzes";
import Dashboard from "./pages/Dashboard";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageContent from "./pages/admin/ManageContent";
import BugReports from "./pages/admin/BugReports";
import ManageTournaments from "./pages/admin/ManageTournaments";
import CreateTournament from "./pages/admin/CreateTournament";

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        {/* Forgot Password Route - Without AuthLayout since it has its own UI structure */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Main App Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/battle" element={<QuizBattle />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/report-bug" element={<ReportBug />} />
          <Route path="/news" element={<News />} />
          <Route path="/create" element={<CreateQuiz />} />
          <Route path="/my-quizzes" element={<MyQuizzes />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/content" element={<ManageContent />} />
          <Route path="/admin/reports" element={<BugReports />} />
          <Route path="/admin/tournaments" element={<ManageTournaments />} />
          <Route path="/admin/create-tournament" element={<CreateTournament />} />
        </Route>

        {/* Play Quiz Route */}
        <Route path="/play/:sessionId" element={<QuizPlayView />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;