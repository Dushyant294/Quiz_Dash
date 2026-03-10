function Profile() {
    const historyData = [
        { srNo: 1, quiz: "Math", category: "JEE", totalMarks: 30, earnedMarks: 23 },
        { srNo: 2, quiz: "Math", category: "JEE", totalMarks: 30, earnedMarks: 26 },
        { srNo: 3, quiz: "Math", category: "JEE", totalMarks: 20, earnedMarks: 22 },
        { srNo: 4, quiz: "Chemistry", category: "JEE", totalMarks: 40, earnedMarks: 37 },
    ];

    return (
        <div className="max-w-[1000px] mx-auto text-black dark:text-white pb-12 pt-4">
            {/* Title Bar */}
            <div className="w-full max-w-3xl mx-auto bg-gradient-to-r from-blue-500 to-indigo-900 dark:from-[#6366f1] dark:to-[#0f172a] rounded-md py-3 mb-8 border border-blue-400 dark:border-[#334155] shadow-md">
                <h1 className="text-center font-bold tracking-widest text-sm md:text-base text-white uppercase">ACCOUNT SETTINGS</h1>
            </div>

            {/* Account Settings Box */}
            <div className="border border-gray-300 dark:border-[#334155] rounded-xl p-8 mb-12 bg-white/50 dark:bg-transparent">
                {/* User Info */}
                <div className="flex justify-center mb-10">
                    <div className="border border-dashed border-gray-400 dark:border-gray-500 p-4 rounded-lg flex items-center justify-center gap-4 min-w-[280px]">
                        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-400 rounded-full flex items-center justify-center shrink-0">
                            {/* Fallback avatar icon */}
                            <svg className="w-8 h-8 text-gray-100" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-sm text-gray-800 dark:text-gray-100">Soham Thummar</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">@COCO_9105</div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400">sthummar444@rku.ac.in</div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="max-w-xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
                        <div>
                            <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-200">Edit your name :</label>
                            <input type="text" className="w-full bg-gray-100 dark:bg-[#374151] border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#5b5bff] text-gray-800 dark:text-gray-200" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-200">Change your username :</label>
                            <input type="text" className="w-full bg-gray-100 dark:bg-[#374151] border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#5b5bff] text-gray-800 dark:text-gray-200" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-200">Current Password :</label>
                            <input type="password" className="w-full bg-gray-100 dark:bg-[#374151] border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#5b5bff] text-gray-800 dark:text-gray-200" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-200">New Password :</label>
                            <input type="password" className="w-full bg-gray-100 dark:bg-[#374151] border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#5b5bff] text-gray-800 dark:text-gray-200" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 mt-8">
                        <button className="bg-gray-400 hover:bg-gray-500 dark:bg-gray-500 dark:hover:bg-gray-400 text-white text-xs px-5 py-1.5 rounded-md transition-colors font-medium">
                            save changes
                        </button>
                        <button className="bg-[#b32626] hover:bg-red-700 text-white shadow-lg text-sm font-semibold w-full max-w-[300px] py-2 rounded-md transition-colors mt-2 tracking-wide">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* History Section */}
            <div className="px-4">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">History :</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-300 dark:border-[#334155] text-gray-600 dark:text-gray-300 text-sm tracking-wide">
                                <th className="py-4 px-2 font-semibold">SR NO.</th>
                                <th className="py-4 px-2 font-semibold">QUIZES</th>
                                <th className="py-4 px-2 font-semibold text-center">CATEGORY</th>
                                <th className="py-4 px-2 font-semibold text-center">TOTAL MARKS</th>
                                <th className="py-4 px-2 font-semibold text-center">EARNED MARKS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyData.map((item) => (
                                <tr key={item.srNo} className="border-b border-gray-200 dark:border-[#334155] text-sm hover:bg-gray-50 dark:hover:bg-[#1b2230] transition-colors">
                                    <td className="py-5 px-2 font-semibold text-gray-800 dark:text-gray-200">{item.srNo}</td>
                                    <td className="py-5 px-2 font-bold text-gray-700 dark:text-gray-300">{item.quiz}</td>
                                    <td className="py-5 px-2 font-medium text-center text-gray-600 dark:text-gray-400">{item.category}</td>
                                    <td className="py-5 px-2 font-medium text-center text-gray-600 dark:text-gray-400">{item.totalMarks}</td>
                                    <td className="py-5 px-2 font-medium text-center text-gray-600 dark:text-gray-400">{item.earnedMarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Profile;
