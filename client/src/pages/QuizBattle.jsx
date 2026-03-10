function QuizBattle() {
    return (
        <div className="max-w-[1100px] text-white pt-6 pb-20">

            {/* Top Banner */}
            <div className="w-full bg-gradient-to-r from-[#4f46e5] via-[#2f277a] to-[#040914] rounded-[20px] p-10 mb-10 shadow-y-xl relative overflow-hidden flex flex-col justify-center min-h-[160px]">
                <h1 className="font-bold text-3xl md:text-[32px] text-white mb-3 tracking-wide drop-shadow-md">
                    Step into the Arena: Outsmart Your Rivals and Climb the Global Ranks
                </h1>
                <p className="text-[#818cf8] text-sm font-medium tracking-wide">
                    Match with students across the country and test your speed in a high-stakes knowledge showdown
                </p>
            </div>

            <div className="px-1">
                <h2 className="text-xl font-bold mb-6 tracking-wide text-white drop-shadow-sm">
                    Join / Create battle
                </h2>

                {/* Form Container */}
                <div className="border-[1.5px] border-gray-600/80 rounded-2xl p-8 md:p-12 w-full max-w-[900px] bg-[#0b1220]/50 shadow-lg backdrop-blur-sm">

                    <div className="w-full max-w-[400px] space-y-7 ml-4">

                        {/* Field: Choose Subject */}
                        <div className="flex items-center gap-6">
                            <div className="border-[1.5px] border-gray-300 rounded-md px-4 py-1.5 font-bold text-[13px] tracking-wide w-[160px]">
                                Choose Subject :
                            </div>
                            <div className="flex-1 text-center border-b-[2px] border-gray-500 pb-1 text-white font-bold text-[15px] cursor-pointer hover:border-gray-300 transition-colors">
                                Select
                            </div>
                        </div>

                        {/* Field: Choose Topic */}
                        <div className="flex items-center gap-6">
                            <div className="border-[1.5px] border-gray-300 rounded-md px-4 py-1.5 font-bold text-[13px] tracking-wide w-[160px]">
                                Choose Topic <span className="float-right">:</span>
                            </div>
                            <div className="flex-1 text-center border-b-[2px] border-gray-500 pb-1 text-white font-bold text-[15px] cursor-pointer hover:border-gray-300 transition-colors">
                                Select
                            </div>
                        </div>

                        {/* Field: No of Questions */}
                        <div className="flex items-center gap-6">
                            <div className="border-[1.5px] border-gray-300 rounded-md px-4 py-1.5 font-bold text-[13px] tracking-wide w-[160px]">
                                No of Questions :
                            </div>
                            <input
                                type="text"
                                placeholder="ex 20"
                                className="w-[120px] bg-transparent border-[1.5px] border-gray-500 rounded-full px-4 py-1 text-center text-[13px] text-gray-300 placeholder-gray-500 focus:outline-none focus:border-gray-300 transition-colors"
                            />
                        </div>

                        {/* Field: Choose Time */}
                        <div className="flex items-center gap-6">
                            <div className="border-[1.5px] border-gray-300 rounded-md px-4 py-1.5 font-bold text-[13px] tracking-wide w-[160px]">
                                Choose Time <span className="float-right">:</span>
                            </div>
                            <input
                                type="text"
                                placeholder="ex. 20 mins"
                                className="w-[140px] bg-transparent border-[1.5px] border-gray-500 rounded-full px-4 py-1 text-center text-[13px] text-gray-300 placeholder-gray-500 focus:outline-none focus:border-gray-300 transition-colors"
                            />
                        </div>

                    </div>

                    {/* Mode Selection Buttons */}
                    <div className="mt-12 flex flex-col sm:flex-row gap-6 items-center">
                        <button className="w-full sm:w-[220px] bg-[#3730a3] hover:bg-[#4338ca] text-[#818cf8] border-[1.5px] border-[#6366f1] rounded-full py-2 text-[14px] font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all tracking-wide">
                            Solo
                        </button>
                        <button className="w-full sm:w-[220px] bg-transparent hover:bg-white/5 text-gray-300 border-[1.5px] border-gray-500 rounded-full py-2 text-[14px] font-bold transition-all tracking-wide">
                            1 v 1
                        </button>
                    </div>

                    {/* Play Now Button */}
                    <div className="mt-8 flex justify-center sm:justify-start sm:ml-[110px]">
                        <button className="bg-[#4c1d95] hover:bg-[#5b21b6] border-2 border-white rounded-full px-12 py-1.5 text-white font-bold text-[15px] shadow-lg transition-all tracking-wide">
                            Play Now
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default QuizBattle;