import React, { useState, useEffect } from 'react';
import { API_BASE } from '../config/api';

function Dashboard() {
    const [stats, setStats] = useState({
        total_quizzes_taken: 0,
        total_score_earned: 0,
        highest_score: 0,
        completed_quizzes: 0,
        global_rank: null,
        subjectActivity: [],
        highestScores: [],
        contestScores: []
    });
    const [user, setUser] = useState({ full_name: 'Guest' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            const fetchDashboardData = async () => {
                try {
                    const [dashboardRes, rankRes] = await Promise.all([
                        fetch(`${API_BASE}/users/dashboard/${parsedUser.user_id}`),
                        fetch(`${API_BASE}/leaderboard/rank/${parsedUser.user_id}`)
                    ]);
                    
                    const data = await dashboardRes.json();
                    const rankData = await rankRes.json();
                    
                    if (data.success) {
                        const newStats = { ...data.data };
                        if (rankData.success && rankData.data) {
                            newStats.global_rank = rankData.data.rank;
                        }
                        setStats(newStats);
                    }
                } catch (err) {
                    console.error("Failed to fetch dashboard data", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchDashboardData();
        } else {
            setLoading(false);
        }
    }, []);

    // Dynamic chart data from DB
    const subjectActivity = stats.subjectActivity || [];
    const chartColors = ['#22c55e', '#06b6d4', '#f59e0b', '#3b82f6', '#f472b6'];

    // Calculate chart percentages
    const totalQuizzes = subjectActivity.reduce((sum, s) => sum + parseInt(s.quiz_count || 0), 0) || 1;
    const chartSegments = subjectActivity.map((s, i) => ({
        name: s.subject_name || 'Unknown',
        quizzes: parseInt(s.quiz_count || 0),
        color: chartColors[i % chartColors.length],
        percent: Math.round((parseInt(s.quiz_count || 0) / totalQuizzes) * 100)
    }));

    // Build conic-gradient (only if we have data)
    let conicGradient = 'conic-gradient(from 0deg, #2a2d3e 0% 100%)'; // default gray
    if (chartSegments.length > 0) {
        let gradientParts = [];
        let cumulative = 0;
        chartSegments.forEach((s) => {
            gradientParts.push(`${s.color} ${cumulative}% ${cumulative + s.percent}%`);
            cumulative += s.percent;
        });
        if (cumulative < 100) {
            gradientParts.push(`#2a2d3e ${cumulative}% 100%`);
        }
        conicGradient = `conic-gradient(from 0deg, ${gradientParts.join(', ')})`;
    }

    // Dynamic highest score highlights
    const highestScores = stats.highestScores || [];
    const contestScores = stats.contestScores || [];

    return (
        <div className="max-w-[1200px] mx-auto text-black dark:text-white pb-16 pt-4 px-4 lg:px-0">

            {/* Welcome Banner */}
            <div className="w-full bg-gradient-to-r from-primary via-brand-indigoDark to-[#0a0e18] rounded-2xl p-8 md:p-10 mb-8 shadow-2xl relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-primary/15 blur-[100px] rounded-full pointer-events-none"></div>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-1 relative z-10">Welcome Back, {user.full_name}</h1>
                <p className="text-gray-300 text-sm mb-6 relative z-10">Here is your report card</p>

                <div className="flex flex-wrap gap-3 relative z-10">
                    <span className="border border-white/40 bg-white/5 rounded-lg px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
                        Total Quizzes : {stats.total_quizzes_taken}
                    </span>
                    <span className="border border-white/40 bg-white/5 rounded-lg px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
                        Global Rank : #{stats.global_rank || 'N/A'}
                    </span>
                    <span className="border border-white/40 bg-white/5 rounded-lg px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
                        Current Points : {stats.total_score_earned}
                    </span>
                </div>
            </div>

            {/* Main Dashboard Content */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* Left: Donut Chart */}
                <div className="flex-[3]">
                    <h2 className="text-lg font-bold mb-6">Quiz Activity by Subject</h2>

                    {loading ? (
                        <div className="text-gray-400 text-sm">Loading chart data...</div>
                    ) : chartSegments.length === 0 ? (
                        <div className="text-gray-400 text-sm border border-white/10 rounded-xl p-8 text-center">
                            <p className="text-lg mb-2">📊</p>
                            <p>No quiz activity yet. Take some quizzes to see your breakdown here!</p>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Donut Chart (CSS) */}
                            <div className="relative shrink-0">
                                <div
                                    className="w-[260px] h-[260px] rounded-full relative shadow-sm dark:shadow-none"
                                    style={{ background: conicGradient }}
                                >
                                    <div className="absolute inset-[50px] bg-white dark:bg-brand-dark rounded-full shadow-sm dark:shadow-none flex items-center justify-center">
                                        <span className="text-gray-900 dark:text-white text-xl font-bold">{totalQuizzes}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex flex-col gap-3">
                                {chartSegments.map((s) => (
                                    <div key={s.name} className="flex items-center gap-3">
                                        <span
                                            className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                                            style={{ backgroundColor: s.color }}
                                        ></span>
                                        <span className="text-gray-800 dark:text-white text-sm font-semibold w-[100px]">{s.name}</span>
                                        <span className="text-gray-500 text-xs">— {s.quizzes} Quizzes</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="flex-[2] flex flex-col gap-6">

                    {/* Highest Score Highlight */}
                    <div className="border border-black/10 dark:border-white/10 rounded-xl p-5 bg-gray-50 dark:bg-[#0d1220]/50 shadow-sm dark:shadow-none">
                        <h3 className="text-lg font-bold mb-1">Highest Score Highlight :</h3>
                        {highestScores.length > 0 ? (
                            <>
                                <p className="text-green-600 dark:text-green-400 font-bold text-sm mb-4">
                                    {highestScores[0]?.category_name || 'Quiz'} ({highestScores[0]?.score_percent || 0}%)
                                </p>
                                <div className="flex flex-col gap-3">
                                    {highestScores.map((card, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white dark:bg-brand-surface border border-black/5 dark:border-white/10 shadow-sm dark:shadow-none rounded-lg p-3 flex items-center gap-3"
                                        >
                                            <span className="text-lg">🏆</span>
                                            <div>
                                                <div className="text-gray-900 dark:text-white text-sm font-bold">{card.file_name || card.category_name || 'Quiz'}</div>
                                                <div className="text-gray-500 dark:text-gray-400 text-xs">Score : {card.correct_answers}/{card.total_questions}</div>
                                                <div className="text-gray-500 dark:text-gray-400 text-xs">{card.score_percent}%</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Complete quizzes to see your best scores here!</p>
                        )}
                    </div>

                    {/* Contests Score Highlight */}
                    <div className="border border-black/10 dark:border-white/10 rounded-xl p-5 bg-gray-50 dark:bg-[#0d1220]/50 shadow-sm dark:shadow-none">
                        <h3 className="text-lg font-bold mb-1">Contests Score Highlight :</h3>
                        {contestScores.length > 0 ? (
                            <>
                                <p className="text-green-600 dark:text-green-400 font-bold text-sm mb-4">
                                    {contestScores[0]?.name} : {contestScores[0]?.score || 0} points
                                </p>
                                <div className="grid grid-cols-3 gap-3">
                                    {contestScores.map((card, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white dark:bg-brand-surface border border-black/5 dark:border-white/10 shadow-sm dark:shadow-none rounded-lg p-3"
                                        >
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <span className="text-gray-900 dark:text-white text-xs font-bold truncate">{card.name}</span>
                                                <span className="text-xs">🏆</span>
                                            </div>
                                            <div className="text-gray-500 dark:text-gray-400 text-[11px]">Score : {card.score || 0} pts</div>
                                            <div className="text-gray-500 dark:text-gray-400 text-[11px]">Rank {card.rank ? `#${card.rank}` : 'N/A'}</div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Join tournaments to see your contest scores here!</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;