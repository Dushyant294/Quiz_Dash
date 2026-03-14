import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Explore from "./pages/Explore";
import Leaderboard from "./pages/Leaderboard";
import News from "./pages/News";
import CreateQuiz from "./pages/CreateQuiz";
import MyQuizzes from "./pages/MyQuizzes";
import Profile from "./pages/Profile";
import QuizBattle from "./pages/QuizBattle";
import QuizPlayView from "./pages/QuizPlayView";
import Tournaments from "./pages/Tournaments";
import ReportBug from "./pages/ReportBug";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageContent from "./pages/admin/ManageContent";
import CreateTournament from "./pages/admin/CreateTournament";
import ManageTournaments from "./pages/admin/ManageTournaments";
import BugReports from "./pages/admin/BugReports";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <HashRouter>
      <Routes>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/explore/:category" element={<Explore />} />

          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/news" element={<News />} />
          <Route path="/create" element={<CreateQuiz />} />
          <Route path="/my-quizzes" element={<MyQuizzes />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/battle" element={<QuizBattle />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/report-bug" element={<ReportBug />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/content" element={<ManageContent />} />
          <Route path="/admin/create-tournament" element={<CreateTournament />} />
          <Route path="/admin/tournaments" element={<ManageTournaments />} />
          <Route path="/admin/reports" element={<BugReports />} />

        </Route>

        <Route path="/play" element={<QuizPlayView />} />
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </HashRouter>
  );
}

export default App;