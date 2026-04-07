import { useState, useEffect } from 'react';
import { API_BASE, authFetch } from '../../config/api';

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalQuizzes: 0,
        activeTournaments: 0,
        pendingReports: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await authFetch(`${API_BASE}/admin/dashboard`);
                const data = await res.json();
                if (data.success) {
                    setStats({
                        totalUsers: data.data.totalUsers || 0,
                        totalQuizzes: data.data.totalQuizzes || 0,
                        activeTournaments: data.data.activeTournaments || 0,
                        pendingReports: data.data.pendingReports || 0
                    });
                    setRecentActivity(data.data.recentActivity || []);
                }
            } catch (err) {
                console.error('Failed to fetch admin dashboard:', err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="max-w-[1400px]">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-[#5b5bff]">Admin Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400">Overview of QuizHub platform metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-[#1b2230] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">Users</div>
                        <span className="text-green-500 text-sm font-bold">+12%</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">{stats.totalUsers.toLocaleString()}</div>
                    <div className="text-gray-500 text-sm">Total Registered Users</div>
                </div>

                <div className="bg-white dark:bg-[#1b2230] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">Quizzes</div>
                        <span className="text-green-500 text-sm font-bold">+5%</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">{stats.totalQuizzes.toLocaleString()}</div>
                    <div className="text-gray-500 text-sm">Total Quizzes Created</div>
                </div>

                <div className="bg-white dark:bg-[#1b2230] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg">Tournaments</div>
                        <span className="text-red-500 text-sm font-bold">-2%</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">{stats.activeTournaments}</div>
                    <div className="text-gray-500 text-sm">Active Tournaments</div>
                </div>

                <div className="bg-white dark:bg-[#1b2230] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">Reports</div>
                        <span className="text-gray-500 text-sm font-bold">0%</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">{stats.pendingReports}</div>
                    <div className="text-gray-500 text-sm">Pending Bug Reports</div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-[#1b2230] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-[#252e3f] transition-colors flex flex-col items-center justify-center gap-2 text-center text-sm font-medium">
                            <span className="text-2xl">👥</span>Manage Users
                        </button>
                        <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-[#252e3f] transition-colors flex flex-col items-center justify-center gap-2 text-center text-sm font-medium">
                            <span className="text-2xl">📝</span>Manage Quizzes
                        </button>
                        <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-[#252e3f] transition-colors flex flex-col items-center justify-center gap-2 text-center text-sm font-medium">
                            <span className="text-2xl">🏆</span>Tournaments
                        </button>
                        <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-blue-50 dark:bg-[#5b5bff]/10 border-blue-200 dark:border-[#5b5bff]/30 hover:bg-blue-100 transition-colors flex flex-col items-center justify-center gap-2 text-center text-sm font-medium text-[#5b5bff]">
                            <span className="text-2xl">📤</span>Bulk Upload CSV
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1b2230] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        {(recentActivity.length > 0 ? recentActivity : [1, 2, 3, 4]).map((item, i) => (
                            <div key={i} className="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0">
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0"></div>
                                <div>
                                    <p className="text-sm">
                                        <span className="font-semibold text-black dark:text-white">
                                            {item.username || item.full_name || 'User'}
                                        </span>{' '}
                                        {item.title || 'performed an action'}
                                    </p>
                                    <span className="text-xs text-gray-500">
                                        {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;