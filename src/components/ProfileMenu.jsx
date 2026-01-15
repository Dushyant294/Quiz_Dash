import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const { dark, setDark } = useTheme();

  return (
    <div className="relative">
      {/* Profile Avatar */}
      <img
        src="https://i.pravatar.cc/40"
        alt="profile"
        className="w-10 h-10 rounded-full cursor-pointer"
        onClick={() => setOpen(!open)}
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-[#0b1220] rounded-xl shadow-xl z-50 overflow-hidden">
          
          {/* User Info */}
          <div className="flex items-center gap-4 p-4 border-b border-gray-300 dark:border-white/10">
            <img
              src="https://i.pravatar.cc/56"
              alt="user"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-base">Jonathan Doe</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">@johndoe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">info@quizhub.com</p>
            </div>
          </div>

          {/* Menu */}
          <ul className="p-2 space-y-0.5 text-sm">

            <li className="flex gap-3 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer">
              <div className="w-8 h-8 flex items-center justify-center bg-blue-500/20 rounded-md">
                👤
              </div>
              <div>
                <p className="font-medium leading-tight">My Profile</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Account settings</p>
              </div>
            </li>

            <li className="flex gap-3 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer">
              <div className="w-8 h-8 flex items-center justify-center bg-purple-500/20 rounded-md">
                📊
              </div>
              <div>
                <p className="font-medium leading-tight">Dashboard</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Your activity and stats</p>
              </div>
            </li>

            <li className="flex gap-3 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer">
              <div className="w-8 h-8 flex items-center justify-center bg-indigo-500/20 rounded-md">
                📝
              </div>
              <div>
                <p className="font-medium leading-tight">My Quizzes</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Your created quizzes</p>
              </div>
            </li>

            {/* Dark Mode */}
            <li className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
              <div className="flex gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-purple-500/20 rounded-md">
                  🌙
                </div>
                <div>
                  <p className="font-medium leading-tight">Dark Mode</p>
                  <p className="text-xs text-gray-400">Toggle theme</p>
                </div>
              </div>

              <button
                onClick={() => setDark(!dark)}
                className={`w-9 h-5 rounded-full relative transition focus:outline-none
                  ${dark ? "bg-indigo-500" : "bg-gray-600"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition
                    ${dark ? "translate-x-4" : ""}`}
                />
              </button>
            </li>
          </ul>

          {/* Logout */}
          <div className="p-3 border-t border-gray-300 dark:border-white/10">
            <button className="w-full bg-red-800 hover:bg-red-700 py-2.5 rounded-lg font-medium">
              ⎋ Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
