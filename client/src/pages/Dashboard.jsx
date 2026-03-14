import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

function Dashboard() {

    const chartSegments = [
        { name: "Physics", quizzes: 45, color: "#22c55e" },
        { name: "Biology", quizzes: 20, color: "#06b6d4" },
        { name: "Mathematics", quizzes: 33, color: "#f59e0b" },
        { name: "Chemistry", quizzes: 63, color: "#3b82f6" },
        { name: "Aptitude", quizzes: 82, color: "#f472b6" }
    ];

    const legendItems = [
        { name: "Aptitude", quizzes: 82, color: "#f472b6" },
        { name: "Chemistry", quizzes: 63, color: "#3b82f6" },
        { name: "Physics", quizzes: 45, color: "#22c55e" },
        { name: "Mathematics", quizzes: 33, color: "#f59e0b" },
        { name: "Biology", quizzes: 20, color: "#06b6d4" }
    ];

    const highestScoreCards = [
        { title: "NEET Mock #4 - Physics", score: "175/180", rank: "Rank 1st" },
        { title: "NEET Mock #4 - Physics", score: "175/180", rank: "Rank 1st" }
    ];

    const contestCards = [
        { name: "PHY-HUNT", score: "328 points", rank: "Rank 4th" },
        { name: "CHEM-HUNT", score: "234 points", rank: "Rank 6th" },
        { name: "Maths-HUNT", score: "204 points", rank: "Rank 5th" }
    ];

    const totalQuizzes = chartSegments.reduce((sum, s) => sum + s.quizzes, 0);

    return (
        <div className="max-w-[1200px] mx-auto text-white pb-16 pt-4 px-4">

            {/* Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-gradient-to-r from-[#4f46e5] via-[#1e1b4b] to-[#0a0e18] rounded-2xl p-8 mb-8 shadow-2xl border border-white/10"
            >
                <h1 className="text-3xl font-bold">Welcome Back</h1>
                <p className="text-gray-300 text-sm mb-6">Here is your report card</p>

                <div className="flex gap-3 flex-wrap">
                    <span className="border border-white/40 bg-white/5 rounded-lg px-4 py-1.5 text-sm">
                        Total Quizzes : 253
                    </span>

                    <span className="border border-white/40 bg-white/5 rounded-lg px-4 py-1.5 text-sm">
                        Global Rank : #14
                    </span>

                    <span className="border border-white/40 bg-white/5 rounded-lg px-4 py-1.5 text-sm">
                        Current Points : 15,320
                    </span>
                </div>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* Donut Chart */}
                <div className="flex-[3]">

                    <h2 className="text-lg font-bold mb-6">
                        Quiz Activity by Subject
                    </h2>

                    <div className="flex flex-col md:flex-row items-center gap-8">

                        {/* Chart */}
                        <div className="relative w-[280px] h-[280px]">

                            <ResponsiveContainer>

                                <PieChart>

                                    <Pie
                                        data={chartSegments}
                                        dataKey="quizzes"
                                        nameKey="name"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={4}
                                        animationDuration={900}
                                    >

                                        {chartSegments.map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={entry.color}
                                            />
                                        ))}

                                    </Pie>

                                    <Tooltip
                                        contentStyle={{
                                            background: "#0f172a",
                                            border: "1px solid #1e293b",
                                            borderRadius: "8px",
                                            color: "white"
                                        }}
                                    />

                                </PieChart>

                            </ResponsiveContainer>

                            {/* Center Stats */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold">{totalQuizzes}</span>
                                <span className="text-xs text-gray-400">
                                    Total Quizzes
                                </span>
                            </div>

                        </div>

                        {/* Legend */}
                        <div className="flex flex-col gap-3">

                            {legendItems.map((s) => (

                                <div
                                    key={s.name}
                                    className="flex items-center gap-3"
                                >

                                    <span
                                        className="w-3 h-3 rounded-full"
                                        style={{ background: s.color }}
                                    />

                                    <span className="font-semibold w-[100px]">
                                        {s.name}
                                    </span>

                                    <span className="text-gray-400 text-xs">
                                        — {s.quizzes} Quizzes
                                    </span>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

                {/* Right Column */}
                <div className="flex-[2] flex flex-col gap-6">

                    {/* Highest Score */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="border border-white/10 rounded-xl p-5 bg-[#0d1220]/60 backdrop-blur-sm"
                    >

                        <h3 className="text-lg font-bold mb-1">
                            Highest Score Highlight
                        </h3>

                        <p className="text-green-400 font-bold text-sm mb-4">
                            Physics (92%)
                        </p>

                        <div className="flex flex-col gap-3">

                            {highestScoreCards.map((card, idx) => (

                                <div
                                    key={idx}
                                    className="bg-[#1a1d30] hover:bg-[#212642] transition border border-white/10 rounded-lg p-3 flex gap-3"
                                >

                                    <Trophy className="text-yellow-400" size={18} />

                                    <div>

                                        <div className="font-bold text-sm">
                                            {card.title}
                                        </div>

                                        <div className="text-gray-400 text-xs">
                                            Score : {card.score}
                                        </div>

                                        <div className="text-gray-400 text-xs">
                                            {card.rank}
                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </motion.div>

                    {/* Contest Scores */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="border border-white/10 rounded-xl p-5 bg-[#0d1220]/60 backdrop-blur-sm"
                    >

                        <h3 className="text-lg font-bold mb-1">
                            Contests Score Highlight
                        </h3>

                        <p className="text-green-400 font-bold text-sm mb-4">
                            PHY-HUNT : 328 points
                        </p>

                        <div className="grid grid-cols-3 gap-3">

                            {contestCards.map((card, idx) => (

                                <div
                                    key={idx}
                                    className="bg-[#1a1d30] hover:bg-[#212642] transition border border-white/10 rounded-lg p-3"
                                >

                                    <div className="flex items-center gap-2 mb-1">

                                        <span className="text-xs font-bold">
                                            {card.name}
                                        </span>

                                        <Trophy size={14} className="text-yellow-400" />

                                    </div>

                                    <div className="text-gray-400 text-[11px]">
                                        Score : {card.score}
                                    </div>

                                    <div className="text-gray-400 text-[11px]">
                                        {card.rank}
                                    </div>

                                </div>

                            ))}

                        </div>

                    </motion.div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;
