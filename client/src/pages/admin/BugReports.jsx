import { useNavigate } from "react-router-dom";

function BugReports() {
    const navigate = useNavigate();
    const reports = [
        { id: 1, reportedBy: "@abc_here", email: "abc_4@ex.com", msg: "failing to submit Q file" },
        { id: 2, reportedBy: "@Siddhi_T", email: "coco10@ex.com", msg: "wrong option in Q2 neet" },
        { id: 3, reportedBy: "@xyz_T", email: "xyz_67@ex.com", msg: "wont save points" },
        { id: 4, reportedBy: "@unknown_here", email: "unk_90@ex.com", msg: "profile pic not updating" },
        { id: 5, reportedBy: "@aakash_e", email: "aaa_97@ex.com", msg: "searching is failing" },
        { id: 6, reportedBy: "@somone_h", email: "sum_78@ex.com", msg: "problem in theme change" },
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
                    <button onClick={() => navigate('/admin/tournaments')} className="px-6 py-1.5 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white/10 transition">
                        manage tournaments
                    </button>
                    <button onClick={() => navigate('/admin/reports')} className="px-6 py-1.5 rounded-full border-2 border-[#818cf8] bg-[#5b5bff] text-white font-semibold text-sm shadow-md">
                        Reports
                    </button>
                </div>

                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#5b5bff]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
            </div>

            {/* Table Section */}
            <div>
                <h2 className="text-lg font-bold mb-4 tracking-wider uppercase text-gray-800 dark:text-white">
                    Manage Bug Reports
                </h2>

                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-500 dark:text-[#a1a1aa] text-[13px] font-bold tracking-wider uppercase">
                                <th className="py-3 px-2 w-[80px]">Sr . no</th>
                                <th className="py-3 px-4 w-[200px]">Reported By</th>
                                <th className="py-3 px-4 w-[220px]">Email</th>
                                <th className="py-3 px-4 w-[240px]">Bug Msg</th>
                                <th className="py-3 px-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report.id} className="border-b border-gray-200 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-2 font-bold text-[15px] text-gray-700 dark:text-gray-300">{report.id}</td>
                                    <td className="py-4 px-4 font-semibold text-[15px]">{report.reportedBy}</td>
                                    <td className="py-4 px-4 font-medium text-[15px] text-gray-600 dark:text-gray-400">{report.email}</td>
                                    <td className="py-4 px-4 font-semibold text-[15px] text-gray-700 dark:text-gray-300">{report.msg}</td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center justify-center gap-4">
                                            <button className="px-6 py-1.5 rounded-full border-2 border-gray-400 dark:border-gray-300 text-gray-800 dark:text-white font-bold text-[13px] hover:bg-gray-100 dark:hover:bg-white/10 transition-colors tracking-wide">
                                                unresolved
                                            </button>
                                            <button className="px-8 py-1.5 rounded-full border-2 border-[#5b5bff] bg-[#5b5bff]/20 dark:bg-[#4f46e5] text-[#5b5bff] dark:text-white font-bold text-[13px] hover:bg-[#5b5bff] hover:text-white transition-colors tracking-wide">
                                                resolved
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

export default BugReports;