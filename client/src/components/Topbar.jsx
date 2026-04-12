import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MessagesPanel from "./MessagesPanel";
import NotificationsPanel from "./NotificationsPanel";
import ProfileMenu from "./ProfileMenu";
import { useTheme } from "../context/ThemeContext";
import { useSearch } from "../context/SearchContext";
import { API_BASE } from "../config/api";


function Topbar() {
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { dark, setDark } = useTheme();
  const { searchQuery, setSearchQuery } = useSearch();
  const [latestNews, setLatestNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${API_BASE}/news/latest`);
        const data = await res.json();
        if (data.success && data.data) {
          setLatestNews(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch latest news:", err);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="fixed top-0 left-64 right-0 h-20 bg-white dark:bg-[#0b1220] border-b border-gray-300 dark:border-white/10 px-8 flex items-center justify-between z-40">

      <div className="flex-1 max-w-md flex flex-col justify-center">
        <input
          placeholder="Search quizzes, categories, creators..."
          className="bg-gray-100 dark:bg-[#1b2230] px-4 py-2 rounded-lg w-full outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Icons */}
      <div className="flex items-center gap-4">

        {/* Report Bug Button */}
        <Link
          to="/report-bug"
          className="bg-[#5b5bff] hover:bg-[#4f4fe5] text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors mr-2 shadow-md shadow-[#5b5bff]/20"
        >
          report bug 🐞
        </Link>

        {/* Messages */}
        <button
          onClick={() => {
            setShowMessages(!showMessages);
            setShowNotifications(false);
          }}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-2xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          💬
        </button>

        {/* Notifications */}
        <button
          onClick={() => {
            setShowNotifications(!showNotifications);
            setShowMessages(false);
          }}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-2xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          🔔
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-2xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {dark ? "🌞" : "🌜"}
        </button>

        {/* Profile */}
        <ProfileMenu />
      </div>

      {showMessages && <MessagesPanel onClose={() => setShowMessages(false)} latestNews={latestNews} />}
      {showNotifications && (
        <NotificationsPanel onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
}

export default Topbar;