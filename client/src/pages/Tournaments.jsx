function Tournaments() {
    const tournaments = [
        {
            title: "NDA-HUNT",
            ends: "30/3/2026",
            tags: ["MODERN HISTORY", "CHEMISTRY", "PHYSICS"],
            bg: "bg-gradient-to-r from-[#2f3f1e] to-[#12120e]",
            border: "border-gray-500",
            btn1Bg: "bg-[#4f46e5]",
            btn2Bg: "bg-[#4a044e]"
        },
        {
            title: "NEET-HUNT",
            ends: "30/3/2026",
            tags: ["ECOLOGY", "COMMON MEDICINES", "HUMAN ANATOMY"],
            bg: "bg-gradient-to-r from-[#064e3b] to-[#020617]",
            border: "border-[#059669]",
            btn1Bg: "bg-[#4f46e5]",
            btn2Bg: "bg-[#4a044e]"
        },
        {
            title: "JEE-HUNT",
            ends: "30/3/2026",
            tags: ["TRIGONOMETRY", "ALGEBRA", "INTEGRATION"],
            bg: "bg-gradient-to-r from-[#1e1b4b] to-[#040914]",
            border: "border-[#4f46e5]",
            btn1Bg: "bg-[#4f46e5]",
            btn2Bg: "bg-[#4a044e]"
        }
    ];

    return (
        <div className="max-w-[1100px] text-white pt-6 pb-20">

            {/* Top Banner */}
            <div className="w-full bg-gradient-to-r from-[#4f46e5] via-[#2a2468] to-[#040914] rounded-2xl p-10 mb-10 shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[160px]">
                <h1 className="font-bold text-3xl md:text-[34px] text-white mb-3 tracking-wide drop-shadow-md">
                    Active Tournaments
                </h1>
                <p className="text-[#818cf8] text-sm font-medium tracking-wide mb-6">
                    Join a live battle to earn points or practice specific topics to sharpen your skills
                </p>

                <div>
                    <span className="inline-block border border-[#818cf8]/80 text-[#c7d2fe] rounded-full px-6 py-1.5 text-xs font-semibold">
                        Your Rank : #47
                    </span>
                </div>
            </div>

            {/* Tournament Cards */}
            <div className="space-y-6">
                {tournaments.map((tourney, idx) => (
                    <div
                        key={idx}
                        className={`${tourney.bg} border-[1.5px] ${tourney.border} rounded-xl p-6 shadow-lg hover:-translate-y-1 transition-transform duration-300 relative`}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-[22px] font-bold text-white tracking-wide">{tourney.title}</h2>
                            <span className="text-[11px] font-bold text-white mt-1">Ends: {tourney.ends}</span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-4 mb-8">
                            {tourney.tags.map((tag, tIdx) => (
                                <span
                                    key={tIdx}
                                    className="border border-white/60 text-white rounded-full px-5 py-1 text-[10px] font-bold tracking-wider"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-6">
                            <button
                                className={`${tourney.btn1Bg} border border-white/40 hover:opacity-90 text-white rounded-full px-16 py-1.5 text-sm font-bold shadow-md transition-opacity`}
                            >
                                Practice
                            </button>
                            <button
                                className={`${tourney.btn2Bg} border border-white/40 hover:opacity-90 text-white rounded-full px-16 py-1.5 text-sm font-bold shadow-md transition-opacity`}
                            >
                                Play
                            </button>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}

export default Tournaments;