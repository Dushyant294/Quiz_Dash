import { useNavigate } from "react-router-dom";

function ManageTournaments() {
    const navigate = useNavigate();

    const tournaments = [
        { id: 1, name: "NDA-HUNT", subject: "NDA", participants: "15,840", action2: "UPDATE TIME" },
        { id: 2, name: "NEET-HUNT", subject: "NEET", participants: "14,840", action2: "UPDATE TIME" },
        { id: 4, name: "JEE-HUNT", subject: "JEE", participants: "12,840", action2: "UPDATE DATE" },
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
                    <button onClick={() => navigate('/admin/users')} className="px-6 py-1.5 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white/10 transition">
                        mange users
                    </button>
                    <button onClick={() => navigate('/admin/content')} className="px-6 py-1.5 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white/10 transition">
                        manage Q's
                    </button>
                    <button onClick={() => navigate('/admin/tournaments')} className="px-6 py-1.5 rounded-full border-2 border-[#818cf8] bg-[#5b5bff] text-white font-semibold text-sm shadow-md">
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
                <h2 className="text-[17px] font-bold mb-6 tracking-wider uppercase text-gray-800 dark:text-white">
                    MANAGE TOURNAMENT
                </h2>

                <div className="w-full overflow-x-auto">
                    <table className="w-full text-center border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-gray-300 dark:border-gray-600 text-gray-500 dark:text-[#a1a1aa] text-[13px] font-bold tracking-wider uppercase">
                                <th className="py-3 px-4 w-[100px] text-left">Sr . no</th>
                                <th className="py-3 px-4 w-[250px]">QUIZ NAME</th>
                                <th className="py-3 px-4 w-[200px]">SUBJECT</th>
                                <th className="py-3 px-4 w-[200px] text-center">PARTICIPANTS</th>
                                <th className="py-3 px-4 text-center">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tournaments.map((t) => (
                                <tr key={t.id} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="py-5 px-4 font-bold text-[15px] text-gray-700 dark:text-gray-300 text-left">{t.id}</td>
                                    <td className="py-5 px-4 font-bold text-[15px] text-gray-700 dark:text-gray-300 uppercase">{t.name}</td>
                                    <td className="py-5 px-4 font-bold text-[15px] text-gray-700 dark:text-gray-300">{t.subject}</td>
                                    <td className="py-5 px-4 font-bold text-[15px] text-gray-700 dark:text-gray-300 text-center">{t.participants}</td>
                                    <td className="py-5 px-4">
                                        <div className="flex items-center justify-center gap-4">
                                            <button className="px-8 py-2 w-[140px] rounded-full border-[1.5px] border-white bg-[#5b5bff]/80 dark:bg-[#4f46e5]/90 text-white font-bold text-[13px] uppercase tracking-wide hover:bg-[#5b5bff] transition shadow-md">
                                                END
                                            </button>
                                            <button className="px-6 py-2 w-[140px] rounded-full border-[1.5px] border-white bg-transparent text-gray-800 dark:text-white font-bold text-[13px] uppercase tracking-wide hover:bg-gray-100 dark:hover:bg-white/10 transition">
                                                {t.action2}
                                            </button>
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

export default ManageTournaments;