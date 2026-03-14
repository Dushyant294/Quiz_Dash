import { useState } from 'react';

function Tournaments() {
    const [activeFilter, setActiveFilter] = useState('All Categories');

    const filters = ['All Categories', 'NEET', 'JEE', 'NDA', 'SSC-CGL'];

    const tournaments = [
        {
            title: 'JEE Mains: Physics Simulation',
            description: 'Test your mastery of mechanics, electricity, and magnetism with difficulty-level questions.',
            dateRange: 'March 11 - Apr 01, 2026',
            participants: '2,347 Participants',
            image: 'https://placehold.co/400x200/1a1a2e/818cf8?text=JEE+Physics',
            category: 'JEE',
            badge: 'Registration open',
            badgeColor: 'bg-green-500',
        },
        {
            title: 'JEE Advanced: Mathematics Challenge',
            description: 'Focus on advanced calc, coordinate geometry, and complex algebra. For 100+ of applicants.',
            dateRange: 'March 11 - Apr 01, 2026',
            participants: '2,347 Pr Mcrem',
            image: 'https://placehold.co/400x200/1e1b4b/a78bfa?text=JEE+Maths',
            category: 'JEE',
            badge: 'Registration open',
            badgeColor: 'bg-green-500',
        },
        {
            title: 'NEET 2026: All India Mega Mock',
            description: 'Compete nationwide with this full-syllabus simulation designed to match faculty-focused entrance exam format.',
            dateRange: 'March 11 - Apr 01, 2026',
            participants: '2,347 Pr Mcrem',
            image: 'https://placehold.co/400x200/4c1d95/c084fc?text=NEET+Mock',
            category: 'NEET',
            badge: 'Registration open',
            badgeColor: 'bg-green-500',
        },
        {
            title: 'NDA: Global Knowledge Championship',
            description: 'Evaluate your general knowledge and your awareness of recent current events with other candidates.',
            dateRange: 'March 11 - Apr 01, 2026',
            participants: '2,347 Participants',
            image: 'https://placehold.co/400x200/713f12/fcd34d?text=NDA+GK',
            category: 'NDA',
            badge: 'Registrations open',
            badgeColor: 'bg-green-500',
        },
    ];

    const filteredTournaments = activeFilter === 'All Categories'
        ? tournaments
        : tournaments.filter(t => t.category === activeFilter);

    return (
        <div className="max-w-[1200px] mx-auto text-white pt-6 pb-20">

            {/* Featured Tournament Banner */}
            <div className="w-full bg-gradient-to-r from-[#1e1b4b] via-[#1a1640] to-[#0b0e18] rounded-2xl p-8 md:p-10 mb-6 shadow-2xl relative overflow-hidden border border-white/5">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-[#4f46e5]/15 blur-[100px] rounded-full pointer-events-none"></div>

                {/* Laptop images placeholder */}
                <div className="absolute top-4 right-8 hidden lg:flex gap-4 opacity-60 pointer-events-none">
                    <div className="w-[140px] h-[90px] bg-gray-700/30 rounded-lg border border-white/10"></div>
                    <div className="w-[140px] h-[90px] bg-gray-700/30 rounded-lg border border-white/10 mt-4"></div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 relative z-10 tracking-wide">
                    NEET All India Mega Mock - 2026
                </h1>
                <p className="text-gray-300 text-sm max-w-xl mb-5 relative z-10 leading-relaxed">
                    Test your knowledge against the best quiz enthusiasts from around the world in this premier tournament with multiple rounds of challenging questions.
                </p>

                <div className="flex items-center gap-6 text-sm text-gray-400 mb-6 relative z-10">
                    <span className="text-purple-300 font-medium">March 15 - April 10, 2026</span>
                    <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                        </svg>
                        1,246 participants
                    </span>
                </div>

                <button className="bg-white text-black font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-colors shadow-lg relative z-10">
                    Join Tournament
                </button>
            </div>

            {/* Countdown / Stats Section */}
            <div className="bg-[#15172a] border border-white/10 rounded-2xl p-6 md:p-8 mb-10">
                {/* Countdown Header */}
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold text-lg">Registrations closes in</h3>
                    <span className="text-purple-400 font-bold text-sm">3 days</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#2a2d3e] rounded-full h-2 mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#1a1d30] border border-[#4f46e5]/30 rounded-xl p-5 text-center">
                        <div className="text-3xl md:text-4xl font-bold text-white mb-1">3</div>
                        <div className="text-gray-400 text-sm font-medium">Rounds</div>
                    </div>
                    <div className="bg-[#1a1d30] border border-[#4f46e5]/30 rounded-xl p-5 text-center">
                        <div className="text-3xl md:text-4xl font-bold text-white mb-1">15</div>
                        <div className="text-gray-400 text-sm font-medium">Categories</div>
                    </div>
                    <div className="bg-[#1a1d30] border border-[#4f46e5]/30 rounded-xl p-5 text-center">
                        <div className="text-3xl md:text-4xl font-bold text-white mb-1">50</div>
                        <div className="text-gray-400 text-sm font-medium">Questions</div>
                    </div>
                </div>
            </div>

            {/* All Tournaments */}
            <h2 className="text-2xl font-bold mb-6">All Tournaments</h2>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-3 mb-8">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all border ${
                            activeFilter === filter
                                ? 'bg-[#4f46e5] text-white border-[#4f46e5] shadow-md shadow-[#4f46e5]/20'
                                : 'bg-transparent text-gray-300 border-gray-500/60 hover:border-gray-300 hover:text-white'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Tournament Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredTournaments.map((t, idx) => (
                    <div
                        key={idx}
                        className="bg-[#12152a] border border-white/10 rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300 shadow-lg flex flex-col"
                    >
                        {/* Card Image */}
                        <div className="relative h-[140px] overflow-hidden">
                            <img
                                src={t.image}
                                alt={t.title}
                                className="w-full h-full object-cover"
                            />
                            {/* Badge */}
                            <span className={`absolute top-3 right-3 ${t.badgeColor} text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full`}>
                                {t.badge}
                            </span>
                        </div>

                        {/* Card Content */}
                        <div className="p-4 flex flex-col flex-1">
                            <h3 className="text-white font-bold text-sm mb-2 leading-tight">{t.title}</h3>
                            <p className="text-gray-400 text-[11px] leading-relaxed mb-4 flex-1">{t.description}</p>

                            {/* Date & Participants */}
                            <div className="flex items-center justify-between text-[10px] text-gray-500 mb-4">
                                <span>{t.dateRange}</span>
                                <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                    </svg>
                                    {t.participants}
                                </span>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2">
                                <button className="flex-1 border border-gray-500/60 text-gray-300 text-[11px] font-semibold py-1.5 rounded-md hover:bg-white/5 transition-colors">
                                    View Details
                                </button>
                                <button className="flex-1 bg-[#4f46e5] text-white text-[11px] font-semibold py-1.5 rounded-md hover:bg-[#4338ca] transition-colors shadow-sm">
                                    Join Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Tournaments;
