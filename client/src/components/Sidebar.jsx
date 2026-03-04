import { NavLink } from "react-router-dom";

const getMenuItems = (role) => {
  // Base items for all users
  const items = [
    { name: "Home", path: "/" },
  ];

  if (role === 'admin') {
    items.push(
      { name: "Manage Users", path: "/admin/users" },
      { name: "Manage Questions", path: "/admin/content" },
      { name: "Manage Tournament", path: "/admin/tournaments" },
      { name: "Create Tournament", path: "/admin/create-tournament" },
      { name: "Create Quiz", path: "/create" }
    );
  }

  // Common items for everyone
  items.push(
    { name: "Categories", path: "/categories" },
    { name: "Explore Q's", path: "/explore" },
    { name: "Quiz Tournament", path: "/tournaments" },
    { name: "Quiz Battle", path: "/battle" },
    { name: "News & Update", path: "/news" },
    { name: "Leaderboard", path: "/leaderboard" }
  );

  // admin reports
  if (role === 'admin') {
    items.push({ name: "Reports", path: "/admin/reports" })
  }

  return items;
};

function Sidebar() {
  // Mock role for now. Change this to test ('user', 'instructor', 'admin')
  const userRole = 'admin';
  const menuItems = getMenuItems(userRole);

  return (
    <aside className="w-64 bg-gray-200 dark:bg-[#0e1628] p-5 text-black dark:text-white fixed left-0 top-0 h-screen overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-8 text-[#5b5bff]">QuizDash</h2>

      <nav className="flex flex-col justify-between h-[calc(100%-80px)]">
        <ul className="space-y-1 text-[13px] font-medium px-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg transition-colors text-center ${isActive
                    ? "bg-[#5b5bff] text-white shadow-md shadow-[#5b5bff]/20"
                    : "hover:bg-gray-300 dark:hover:bg-white/10 text-gray-700 dark:text-[#a1a1aa]"
                  }`
                }
              >
                {/* Add standard line break for long names matching design */}
                {item.name === "Manage Questions" ? (
                  <>Manage<br />Questions</>
                ) : item.name === "Manage Tournament" ? (
                  <>Manage<br />Tournament</>
                ) : item.name === "Create Tournament" ? (
                  <>Create<br />Tournament</>
                ) : (
                  item.name
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="pt-4 mt-auto">
          <NavLink
            to="/login"
            className="block px-4 py-2.5 rounded-lg text-gray-700 dark:text-[#a1a1aa] hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors text-[13px] font-medium text-center"
          >
            Logout
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
