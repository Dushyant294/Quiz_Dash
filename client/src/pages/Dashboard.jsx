import React from 'react';

function Dashboard() {
    // Donut chart data — order matches clockwise from top in the design
    const chartSegments = [
        { name: 'Physics', quizzes: 45, color: '#22c55e', percent: 18 },
        { name: 'Biology', quizzes: 20, color: '#06b6d4', percent: 12 },
        { name: 'Mathematics', quizzes: 33, color: '#f59e0b', percent: 13 },
        { name: 'Chemistry', quizzes: 63, color: '#3b82f6', percent: 25 },
        { name: 'Aptitude', quizzes: 82, color: '#f472b6', percent: 32 },
    ];

    // Legend order matches the design
    const legendItems = [
        { name: 'Aptitude', quizzes: 82, color: '#f472b6' },
        { name: 'Chemistry', quizzes: 63, color: '#3b82f6' },
        { name: 'Physics', quizzes: 45, color: '#22c55e' },
        { name: 'Mathematics', quizzes: 33, color: '#f59e0b' },
        { name: 'Biology', quizzes: 20, color: '#06b6d4' },
    ];

    // Build conic-gradient
    let gradientParts = [];
    let cumulative = 0;
    chartSegments.forEach((s) => {
        gradientParts.push(`${s.color} ${cumulative}% ${cumulative + s.percent}%`);
        cumulative += s.percent;
    });
    const conicGradient = `conic-gradient(from 0deg, ${gradientParts.join(', ')})`;

    const highestScoreCards = [
        { title: 'NEET Mock #4 - Physics', score: '175/180', rank: 'Rank 1st' },
        { title: 'NEET Mock #4 - Physics', score: '175/180', rank: 'Rank 1st' },
    ];

    const contestCards = [
        { name: 'PHY-HUNT', score: '328 points', rank: 'Rank 4th', emoji: '🏆' },
        { name: 'CHEM-HUNT', score: '234 points', rank: 'Rank 6th', emoji: '🏆' },
        { name: 'Maths-HUNT', score: '204 points', rank: 'Rank 5th', emoji: '🏆' },
    ];

    return (
        <div className="max-w-[1200px] mx-auto text-white pb-16 pt-4 px-4 lg:px-0">

            {/* Welcome Banner */}
            <div className="w-full bg-gradient-to-r from-[#4f46e5] via-[#1e1b4b] to-[#0a0e18] rounded-2xl p-8 md:p-10 mb-8 shadow-2xl relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-[#4f46e5]/15 blur-[100px] rounded-full pointer-events-none"></div>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-1 relative z-10">Welcome Back ,</h1>
                <p className="text-gray-300 text-sm mb-6 relative z-10">Here is your report card</p>

                <div className="flex flex-wrap gap-3 relative z-10">
                    <span className="border border-white/40 bg-white/5 rounded-lg px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
                        Total Quizzes : 253
                    </span>
                    <span className="border border-white/40 bg-white/5 rounded-lg px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
                        Global Rank : #14
                    </span>
                    <span className="border border-white/40 bg-white/5 rounded-lg px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
                        Current Points : 15,320
                    </span>
                </div>
            </div>

            {/* Main Dashboard Content */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* Left: Donut Chart */}
                <div className="flex-[3]">
                    <h2 className="text-lg font-bold mb-6">Quiz Activity by Subject</h2>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Donut Chart (CSS) */}
                        <div className="relative shrink-0">
                            <div
                                className="w-[260px] h-[260px] rounded-full relative"
                                style={{ background: conicGradient }}
                            >
                                <div className="absolute inset-[50px] bg-[#0b1220] rounded-full"></div>
                            </div>

                            {/* Labels positioned to match segment positions */}
                            <span className="absolute top-[-12px] left-[28%] text-[10px] text-gray-300 font-medium">Physics</span>
                            <span className="absolute top-[5px] right-[-12px] text-[10px] text-gray-300 font-medium">Biology</span>
                            <span className="absolute top-[42%] right-[-40px] text-[10px] text-gray-300 font-medium">Mathematics</span>
                            <span className="absolute bottom-[5px] right-[25%] text-[10px] text-gray-300 font-medium">Chemistry</span>
                            <span className="absolute bottom-[15px] left-[-5px] text-[10px] text-gray-300 font-medium">Aptitude</span>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-col gap-3">
                            {legendItems.map((s) => (
                                <div key={s.name} className="flex items-center gap-3">
                                    <span
                                        className="w-3 h-3 rounded-full shrink-0"
                                        style={{ backgroundColor: s.color }}
                                    ></span>
                                    <span className="text-white text-sm font-semibold w-[100px]">{s.name}</span>
                                    <span className="text-gray-400 text-xs">— {s.quizzes} Quizzes</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex-[2] flex flex-col gap-6">

                    {/* Highest Score Highlight */}
                    <div className="border border-white/10 rounded-xl p-5 bg-[#0d1220]/50">
                        <h3 className="text-lg font-bold mb-1">Highest Score Highlight :</h3>
                        <p className="text-green-400 font-bold text-sm mb-4">Physics (92%)</p>

                        <div className="flex flex-col gap-3">
                            {highestScoreCards.map((card, idx) => (
                                <div
                                    key={idx}
                                    className="bg-[#1a1d30] border border-white/10 rounded-lg p-3 flex items-center gap-3"
                                >
                                    <span className="text-lg">🏆</span>
                                    <div>
                                        <div className="text-white text-sm font-bold">{card.title}</div>
                                        <div className="text-gray-400 text-xs">Score : {card.score}</div>
                                        <div className="text-gray-400 text-xs">{card.rank}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contests Score Highlight */}
                    <div className="border border-white/10 rounded-xl p-5 bg-[#0d1220]/50">
                        <h3 className="text-lg font-bold mb-1">Contests Score Highlight :</h3>
                        <p className="text-green-400 font-bold text-sm mb-4">PHY-HUNT : 328 points</p>

                        <div className="grid grid-cols-3 gap-3">
                            {contestCards.map((card, idx) => (
                                <div
                                    key={idx}
                                    className="bg-[#1a1d30] border border-white/10 rounded-lg p-3"
                                >
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className="text-white text-xs font-bold">{card.name}</span>
                                        <span className="text-xs">{card.emoji}</span>
                                    </div>
                                    <div className="text-gray-400 text-[11px]">Score : {card.score}</div>
                                    <div className="text-gray-400 text-[11px]">{card.rank}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;