import { useState } from "react";
import MessagesPanel from "./MessagesPanel";
import NotificationsPanel from "./NotificationsPanel";
import ProfileMenu from "./ProfileMenu";
import { useTheme } from "../context/ThemeContext";


function Topbar() {
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { dark, setDark } = useTheme();

  return (
    <div className="fixed top-0 left-64 right-0 h-20 bg-white dark:bg-[#0b1220] border-b border-gray-300 dark:border-white/10 px-8 flex items-center justify-between z-40">
      
      {/* Search */}
      <input
        placeholder="Search quizzes, categories, creators..."
        className="bg-gray-100 dark:bg-[#1b2230] px-4 py-2 rounded-lg w-1/3 outline-none"
      />

      {/* Icons */}
      <div className="flex items-center gap-6">
        
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

      {showMessages && <MessagesPanel onClose={() => setShowMessages(false)} />}
      {showNotifications && (
        <NotificationsPanel onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
}

export default Topbar;
