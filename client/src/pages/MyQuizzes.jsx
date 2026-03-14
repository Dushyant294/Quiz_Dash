import { useState } from 'react';

function MyQuizzes() {
    const [activeTab, setActiveTab] = useState('All Quizzes');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [searchQuery, setSearchQuery] = useState('');

    const tabs = ['All Quizzes', 'Active', 'Completed'];

    const quizzes = [
        {
            id: 1,
            title: 'NEET - Human Anatomy & Physiology',
            category: 'NEET',
            image: 'https://placehold.co/400x220/991b1b/fca5a5?text=Anatomy',
            questions: 25,
            score: '85%',
            date: 'Mar 10, 2026',
            status: 'Completed',
        },
        {
            id: 2,
            title: 'JEE - Formulae Notebooks & Patterns',
            category: 'JEE',
            image: 'https://placehold.co/400x220/1e40af/93c5fd?text=JEE',
            questions: 30,
            score: '72%',
            date: 'Mar 08, 2026',
            status: 'Completed',
        },
        {
            id: 3,
            title: 'NDA - Current Affairs & General Knowledge',
            category: 'NDA',
            image: 'https://placehold.co/400x220/6b21a8/d8b4fe?text=NDA+GK',
            questions: 20,
            score: '90%',
            date: 'Mar 05, 2026',
            status: 'Completed',
        },
        {
            id: 4,
            title: 'Data Structures & Algorithms',
            category: 'GATE',
            image: 'https://placehold.co/400x220/065f46/6ee7b7?text=DSA',
            questions: 15,
            score: '88%',
            date: 'Mar 03, 2026',
            status: 'Active',
        },
        {
            id: 5,
            title: 'SSC - Quantitative Aptitude Essentials',
            category: 'SSC',
            image: 'https://placehold.co/400x220/b45309/fcd34d?text=SSC+QA',
            questions: 40,
            score: '65%',
            date: 'Feb 28, 2026',
            status: 'Completed',
        },
        {
            id: 6,
            title: 'SSC - Advanced General Awareness',
            category: 'SSC',
            image: 'https://placehold.co/400x220/b45309/fcd34d?text=SSC+GA',
            questions: 35,
            score: '78%',
            date: 'Feb 25, 2026',
            status: 'Completed',
        },
    ];

    const filteredQuizzes = quizzes.filter((q) => {
        const matchesTab =
            activeTab === 'All Quizzes' ||
            q.status === activeTab;
        const matchesSearch =
            !searchQuery ||
            q.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="max-w-[1200px] mx-auto text-white pt-6 pb-20 px-4 lg:px-0">

            {/* Page Title */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-1">My Quizzes</h1>
                <p className="text-gray-400 text-sm">Manage and track all quizzes</p>
            </div>

            {/* Search + Filters Row */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-6">
                {/* Search */}
                <div className="flex-1 relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search your quizzes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#1a1d2e] border border-gray-600/50 rounded-lg h-10 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5b5bff] transition"
                    />
                </div>

                {/* Status Filter */}
                <select className="bg-[#1a1d2e] border border-gray-600/50 rounded-lg h-10 px-4 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5b5bff] transition appearance-none cursor-pointer min-w-[120px]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3af' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                    }}
                >
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Completed</option>
                </select>

                {/* Sort */}
                <select className="bg-[#1a1d2e] border border-gray-600/50 rounded-lg h-10 px-4 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5b5bff] transition appearance-none cursor-pointer min-w-[120px]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3af' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                    }}
                >
                    <option>Newest</option>
                    <option>Oldest</option>
                    <option>Highest Score</option>
                </select>

                {/* View Toggle */}
                <div className="flex items-center border border-gray-600/50 rounded-lg overflow-hidden">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-[#475569] text-white' : 'bg-[#1a1d2e] text-gray-400 hover:text-white'}`}
                        title="Grid view"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zM2.5 2a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zm6.5.5A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zM1 10.5A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zm6.5.5A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3z"/>
                        </svg>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-[#475569] text-white' : 'bg-[#1a1d2e] text-gray-400 hover:text-white'}`}
                        title="List view"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M2.5 12a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Tab Bar */}
            <div className="flex mb-8">
                <div className="bg-[#1a1d2e] border border-gray-600/50 rounded-full p-1 flex">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                                activeTab === tab
                                    ? 'bg-[#4f46e5] text-white shadow-md'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quiz Cards — Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {filteredQuizzes.map((quiz) => (
                        <div
                            key={quiz.id}
                            className="bg-[#12152a] border border-white/10 rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300 shadow-lg flex flex-col"
                        >
                            {/* Image */}
                            <div className="relative h-[150px] overflow-hidden">
                                <img
                                    src={quiz.image}
                                    alt={quiz.title}
                                    className="w-full h-full object-cover"
                                />
                                {/* Status Badge */}
                                {quiz.status === 'Completed' && (
                                    <span className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                        Completed
                                    </span>
                                )}
                                {quiz.status === 'Active' && (
                                    <span className="absolute top-3 right-3 bg-blue-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                        Active
                                    </span>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="p-4 flex flex-col flex-1">
                                <span className="text-[10px] font-bold text-purple-400 mb-1 uppercase tracking-wider">{quiz.category}</span>
                                <h3 className="text-white font-bold text-sm mb-3 leading-tight flex-1">{quiz.title}</h3>

                                {/* Stats Row */}
                                <div className="flex items-center justify-between text-[10px] text-gray-400 border-t border-white/10 pt-3">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                        {quiz.questions} Qs
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                        {quiz.score}
                                    </span>
                                    <span>{quiz.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Quiz Cards — List View */}
            {viewMode === 'list' && (
                <div className="flex flex-col gap-4">
                    {filteredQuizzes.map((quiz) => (
                        <div
                            key={quiz.id}
                            className="bg-[#12152a] border border-white/10 rounded-xl overflow-hidden hover:bg-[#181c34] transition-colors shadow-lg flex flex-col md:flex-row"
                        >
                            {/* Image */}
                            <div className="w-full md:w-[200px] h-[140px] md:h-auto overflow-hidden shrink-0 relative">
                                <img
                                    src={quiz.image}
                                    alt={quiz.title}
                                    className="w-full h-full object-cover"
                                />
                                {quiz.status === 'Completed' && (
                                    <span className="absolute top-3 right-3 md:top-2 md:left-2 md:right-auto bg-green-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                        Completed
                                    </span>
                                )}
                                {quiz.status === 'Active' && (
                                    <span className="absolute top-3 right-3 md:top-2 md:left-2 md:right-auto bg-blue-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                        Active
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div className="flex-1">
                                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{quiz.category}</span>
                                    <h3 className="text-white font-bold text-sm mt-1">{quiz.title}</h3>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-6 text-[11px] text-gray-400 shrink-0">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                        {quiz.questions} Qs
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                        {quiz.score}
                                    </span>
                                    <span>{quiz.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {filteredQuizzes.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">No quizzes found.</p>
                </div>
            )}
        </div>
    );
}

export default MyQuizzes;