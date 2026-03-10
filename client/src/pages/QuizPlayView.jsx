function QuizPlayView() {
    return (
        <div className="bg-white dark:bg-[#0b1220] text-black dark:text-white min-h-screen p-4 md:p-8 flex flex-col">
            <div className="max-w-[1000px] w-full mx-auto flex-1 flex flex-col relative">
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
                    <div>
                        <h1 className="text-xl font-bold">Fundamental Physics & Mechanics</h1>
                        <p className="text-sm text-gray-500">Question 3 of 10</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm font-medium">Score</span>
                            <span className="text-[#5b5bff] font-bold text-xl">250</span>
                        </div>
                        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg font-mono font-bold flex items-center gap-2 border border-red-200 dark:border-red-800">
                            ⏳ 00:45
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    <div className="bg-white dark:bg-[#1b2230] p-8 md:p-12 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 mb-8">
                        <h2 className="text-2xl md:text-3xl font-medium leading-relaxed mb-8">
                            An object is thrown straight up into the air. At its highest point, its acceleration is:
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <button className="p-4 md:p-6 text-left border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#5b5bff] hover:bg-blue-50 dark:hover:bg-[#5b5bff]/10 transition-all font-medium text-lg relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-500 group-hover:bg-[#5b5bff] group-hover:text-white transition-colors">A</span>
                                <span className="pl-12">Zero.</span>
                            </button>
                            <button className="p-4 md:p-6 text-left border-2 border-[#5b5bff] bg-blue-50 dark:bg-[#5b5bff]/10 rounded-xl transition-all font-medium text-lg relative group shadow-sm">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#5b5bff] text-white flex items-center justify-center font-bold">B</span>
                                <span className="pl-12">Directed downwards.</span>
                            </button>
                            <button className="p-4 md:p-6 text-left border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#5b5bff] hover:bg-blue-50 dark:hover:bg-[#5b5bff]/10 transition-all font-medium text-lg relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-500 group-hover:bg-[#5b5bff] group-hover:text-white transition-colors">C</span>
                                <span className="pl-12">Directed upwards.</span>
                            </button>
                            <button className="p-4 md:p-6 text-left border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#5b5bff] hover:bg-blue-50 dark:hover:bg-[#5b5bff]/10 transition-all font-medium text-lg relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-500 group-hover:bg-[#5b5bff] group-hover:text-white transition-colors">D</span>
                                <span className="pl-12">Equal to its mass.</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-auto pt-4">
                    <button className="hidden text-gray-500 hover:text-gray-800 dark:hover:text-white font-medium transiton-colors">
                        Exit Quiz
                    </button>
                    <button className="text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2">
                        💡 Get Hint (uses 5 coins)
                    </button>
                    <button className="bg-[#5b5bff] hover:bg-[#4f4fe5] text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-[#5b5bff]/30 transition-colors">
                        Lock Answer & Next &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuizPlayView;