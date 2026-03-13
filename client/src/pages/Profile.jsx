import React, { useState } from 'react';

function Profile() {
    const [activeTab, setActiveTab] = useState('Activity');

    const activityData = [
        { id: 1, title: 'Completed "World History Trivia"', score: '95%', date: 'May 01, 08:00 PM' },
        { id: 2, title: 'Completed "World History Trivia"', score: '95%', date: 'May 01, 08:00 PM' },
        { id: 3, title: 'Completed "World History Trivia"', score: '95%', date: 'May 01, 08:00 PM' },
        { id: 4, title: 'Completed "World History Trivia"', score: '95%', date: 'May 01, 08:00 PM' },
    ];

    return (
        <div className="max-w-[1200px] mx-auto text-black dark:text-white pb-16 pt-4 px-4 lg:px-0">

            {/* Top User Banner */}
            <div className="w-full bg-gradient-to-r from-[#0F0C29] via-[#1a1442] to-[#0A0710] rounded-2xl p-8 mb-10 shadow-2xl relative overflow-hidden border border-white/5 flex items-center md:items-start gap-6 flex-col md:flex-row">
                {/* Decorative glows */}
                <div className="absolute top-0 right-0 w-[60%] h-full bg-[#4F46E5]/10 blur-[120px] rounded-full pointer-events-none"></div>

                {/* Avatar */}
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-300 rounded-full flex flex-col items-center justify-end overflow-hidden shrink-0 border-2 border-white/10 shadow-lg relative z-10">
                    <svg className="w-20 h-20 text-gray-400 translate-y-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                </div>

                {/* User Info */}
                <div className="flex-1 relative z-10 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                        <h1 className="text-2xl font-bold text-white tracking-wide">Soham Thummar</h1>
                        <span className="border border-gray-500 text-gray-300 px-3 py-0.5 rounded-full text-xs font-medium tracking-wider bg-white/5">
                            Learner
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-400 font-medium mb-4">
                        <span>@COCO_9105</span>
                        <div className="flex items-center gap-1.5">
                            <span className="w-4 h-3 bg-orange-500 flex flex-col justify-between">
                                <span className="bg-white h-1 w-full flex items-center justify-center"><span className="w-1 h-1 rounded-full bg-blue-700"></span></span>
                                <span className="bg-green-600 h-1 w-full"></span>
                            </span>
                            <span>INDIA</span>
                        </div>
                        <span className="hidden sm:inline text-gray-600">•</span>
                        <span>Joined March 01 , 2026</span>
                    </div>

                    <div className="inline-block border border-gray-600 rounded-full px-4 py-1 bg-[#1a1c29]/50 shadow-inner">
                        <span className="font-bold text-white text-sm">190</span>
                        <span className="text-gray-400 text-xs ml-1 font-medium">Quizzes Taken</span>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Left Column: Activity */}
                <div className="flex-[3]">

                    {/* Activity Tabs */}
                    <div className="bg-[#2a3042]/40 rounded-full p-1.5 mb-6 flex w-full max-w-md border border-white/5 shadow-inner">
                        <button
                            className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-all ${activeTab === 'Activity' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setActiveTab('Activity')}
                        >
                            Activity
                        </button>
                        <button
                            className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-all ${activeTab === 'Quizzes Taken' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setActiveTab('Quizzes Taken')}
                        >
                            Quizzes Taken
                        </button>
                    </div>

                    {/* Activity List Container */}
                    <div className="border border-[#2a3042] rounded-xl overflow-hidden shadow-lg bg-[#0b0f19]/30">
                        {activityData.map((item, index) => (
                            <div
                                key={item.id}
                                className={`flex items-start gap-5 p-5 ${index !== activityData.length - 1 ? 'border-b border-[#2a3042]' : ''} hover:bg-white/5 transition-colors`}
                            >
                                <div className="mt-1">
                                    <span className="text-2xl drop-shadow-md">🏆</span>
                                </div>
                                <div>
                                    <div className="text-gray-200 font-semibold mb-1 tracking-wide text-[15px]">
                                        {item.title} with a score of {item.score}
                                    </div>
                                    <div className="text-gray-500 text-xs font-medium">
                                        {item.date}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Right Column: Stats & Performance */}
                <div className="flex-[2]">
                    <div className="border border-[#2a3042] rounded-2xl p-7 bg-[#0b0f19]/50 shadow-lg h-full">
                        <h2 className="text-lg font-bold text-white mb-8 tracking-wide">Stats & Performance</h2>

                        {/* Top Stats Grid */}
                        <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-10">
                            {/* Stat 1 */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span className="text-gray-300 text-xs font-medium">Average Score</span>
                                </div>
                                <div className="text-white font-bold text-[15px]">87.5 %</div>
                            </div>

                            {/* Stat 2 */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    <span className="text-gray-300 text-xs font-medium">Win Rate</span>
                                </div>
                                <div className="text-white font-bold text-[15px]">78 %</div>
                            </div>

                            {/* Stat 3 */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-gray-500 text-xs">🔥</span>
                                    <span className="text-gray-300 text-xs font-medium">Current Streak</span>
                                </div>
                                <div className="text-white font-bold text-[15px]">5 Quizzes</div>
                            </div>

                            {/* Stat 4 */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    <span className="text-gray-300 text-xs font-medium">Highest Streak</span>
                                </div>
                                <div className="text-white font-bold text-[15px]">12 Quizzes</div>
                            </div>

                            {/* Stat 5 */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-gray-300 text-xs font-medium">Time Played</span>
                                </div>
                                <div className="text-white font-bold text-[15px]">11h 50min</div>
                            </div>

                            {/* Stat 6 */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-gray-500 text-xs font-bold">%</span>
                                    <span className="text-gray-300 text-xs font-medium">Completion Rate</span>
                                </div>
                                <div className="text-white font-bold text-[15px]">94 %</div>
                            </div>
                        </div>

                        {/* Bottom Bars */}
                        <div className="space-y-6">
                            {/* Best Category */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                        <span className="text-gray-300 text-xs font-semibold">Best Category</span>
                                    </div>
                                    <span className="text-gray-400 text-[10px] font-medium tracking-wide">History</span>
                                </div>
                                <div className="w-full bg-[#1b2133] rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-gray-300 h-1.5 rounded-full w-[95%]"></div>
                                </div>
                            </div>

                            {/* Favorite Category */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs">🥇</span>
                                        <span className="text-gray-300 text-xs font-semibold">Favorite Category</span>
                                    </div>
                                    <span className="text-gray-400 text-[10px] font-medium tracking-wide">Science</span>
                                </div>
                                <div className="w-full bg-[#1b2133] rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-gray-400 h-1.5 rounded-full w-[80%]"></div>
                                </div>
                            </div>

                            {/* Weakest Category */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-[0.6rem]">
                                        <span className="w-4 h-[1px] bg-transparent"></span>
                                        <span className="text-gray-300 text-xs font-semibold">Weakest Category</span>
                                    </div>
                                    <span className="text-gray-400 text-[10px] font-medium tracking-wide">Sports</span>
                                </div>
                                <div className="w-full bg-[#1b2133] rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-gray-500 h-1.5 rounded-full w-[45%]"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default Profile;