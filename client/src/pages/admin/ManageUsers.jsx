import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ManageUsers() {
    const navigate = useNavigate();
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const users = [
        { id: 1, username: "@Siddharth_V", email: "sidd34@ex.com", points: "15,840" },
        { id: 2, username: "@Siddhi_T", email: "sidt74@ex.com", points: "14,840" },
        { id: 3, username: "@Soham_T", email: "coco10@ex.com", points: "13,840" },
        { id: 4, username: "@Tannu_W", email: "yayy45@ex.com", points: "12,840" },
        { id: 5, username: "@Dushyant_D", email: "dd_pro67@ex.com", points: "11,840" },
        { id: 6, username: "@Disha_D", email: "abbc44@ex.com", points: "10,840" },
        { id: 7, username: "@Yash_M", email: "Cr_67@ex.com", points: "9,840" },
    ];

    return (
        <div className="max-w-[1200px] mx-auto text-black dark:text-white pb-12 pt-6">

            {/* Banner */}
            <div className="w-full bg-gradient-to-r from-[#5b5bff]/90 via-[#312e81] to-[#0b1220]/50 dark:to-[#090e17] rounded-2xl py-12 px-10 mb-10 shadow-lg relative overflow-hidden">
                <h1 className="font-bold text-3xl md:text-[34px] text-white mb-8 tracking-wide relative z-10">
                    One Centralized Panel for Management
                </h1>

                {/* Banner Buttons */}
                <div className="flex flex-wrap gap-4 relative z-10">
                    <button onClick={() => navigate('/admin/users')} className="px-6 py-1.5 rounded-full border-2 border-[#818cf8] bg-[#5b5bff] text-white font-semibold text-sm shadow-md">
                        mange users
                    </button>
                    <button onClick={() => navigate('/admin/content')} className="px-6 py-1.5 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white/10 transition">
                        manage Q's
                    </button>
                    <button onClick={() => navigate('/admin/tournaments')} className="px-6 py-1.5 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white/10 transition">
                        manage tournaments
                    </button>
                    <button onClick={() => navigate('/admin/reports')} className="px-6 py-1.5 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white/10 transition">
                        Reports
                    </button>
                </div>

                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#5b5bff]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
            </div>

            {/* Table Section */}
            <div>
                <h2 className="text-lg font-bold mb-4 tracking-wider uppercase text-gray-800 dark:text-white">
                    User Management
                </h2>

                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-500 dark:text-[#a1a1aa] text-[13px] font-bold tracking-wider uppercase">
                                <th className="py-3 px-2 w-[80px]">Sr . no</th>
                                <th className="py-3 px-4 w-[200px]">Username</th>
                                <th className="py-3 px-4 w-[220px]">Email</th>
                                <th className="py-3 px-4 w-[160px]">Total Points</th>
                                <th className="py-3 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-gray-200 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-2 font-bold text-[15px] text-gray-700 dark:text-gray-300">{user.id}</td>
                                    <td className="py-4 px-4 font-semibold text-[15px]">{user.username}</td>
                                    <td className="py-4 px-4 font-medium text-[15px] text-gray-600 dark:text-gray-400">{user.email}</td>
                                    <td className="py-4 px-4 font-semibold text-[15px] text-gray-700 dark:text-gray-300">{user.points}</td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3 relative">
                                            <button className="px-4 py-1.5 rounded-full border-2 border-[#5b5bff] bg-[#5b5bff]/20 dark:bg-[#4f46e5] text-[#5b5bff] dark:text-white font-bold text-[12px] hover:bg-[#5b5bff] hover:text-white transition-colors tracking-wide">
                                                upgrade to instructor
                                            </button>
                                            <button className="px-4 py-1.5 rounded-full border-2 border-gray-800 dark:border-gray-300 text-gray-800 dark:text-white font-bold text-[12px] hover:bg-gray-100 dark:hover:bg-white/10 transition-colors tracking-wide">
                                                downgrade to student
                                            </button>

                                            {/* Plus button with Dropdown */}
                                            <div className="relative" ref={openDropdownId === user.id ? dropdownRef : null}>
                                                <button
                                                    onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#5b5bff] bg-[#5b5bff]/20 dark:bg-[#4f46e5] text-[#5b5bff] dark:text-white font-bold hover:bg-[#5b5bff] hover:text-white transition-colors"
                                                >
                                                    +
                                                </button>

                                                {/* Dropdown Menu */}
                                                {openDropdownId === user.id && (
                                                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#1e2333] border-2 border-white rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col p-2 gap-2">
                                                        <button
                                                            className="w-full text-center px-4 py-2 border border-white text-white font-bold text-[13px] bg-[#312e81] hover:bg-[#4338ca] transition-colors rounded-[4px]"
                                                            onClick={() => setOpenDropdownId(null)}
                                                        >
                                                            Inactive user
                                                        </button>
                                                        <button
                                                            className="w-full text-center px-4 py-2 border border-white text-white font-bold text-[13px] bg-[#312e81] hover:bg-[#4338ca] transition-colors rounded-[4px]"
                                                            onClick={() => setOpenDropdownId(null)}
                                                        >
                                                            Remove user
                                                        </button>
                                                        <button
                                                            className="w-full text-center px-4 py-2 border border-white text-white font-bold text-[13px] bg-[#312e81] hover:bg-[#4338ca] transition-colors rounded-[4px]"
                                                            onClick={() => setOpenDropdownId(null)}
                                                        >
                                                            Change password
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default ManageUsers;
