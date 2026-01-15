import { useState } from "react";

const menuItems = [
  "Home",
  "Today's Challenge",
  "Categories",
  "Quiz Battle",
  "News & Updates",
  "Explore Quizzes",
  "Quiz Tournament",
  "Leaderboard",
  "Quiz Creator Tips",
  "Quiz Discussions",
  "Create Quiz",
  "AI Quiz Generator",
];

function Sidebar() {
  const [active, setActive] = useState("Home");

  return (
    <aside className="w-64 bg-gray-200 dark:bg-[#0e1628] p-5 text-black dark:text-white fixed left-0 top-0 h-screen">

      <h2 className="text-2xl font-semibold mb-8">QuizHub</h2>

      <ul className="space-y-2 text-sm">
        {menuItems.map((item) => (
          <li
            key={item}
            onClick={() => setActive(item)}
            className={`px-4 py-2 rounded-lg cursor-pointer transition
              ${
                active === item
                  ? "bg-[#5b5bff]"
                  : "hover:bg-gray-300 dark:hover:bg-white/10"
              }`}
          >
            {item}
          </li>
        ))}

        <li className="pt-6 opacity-70 cursor-pointer">Logout</li>
      </ul>
    </aside>
  );
}

export default Sidebar;
