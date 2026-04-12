import { useState, useEffect } from 'react';
import { API_BASE } from '../config/api';
import { useSearch } from '../context/SearchContext';

const tagColors = {
    'NEW FEATURE': 'bg-[#5b5bff]',
    'UI IMPROVEMENT': 'bg-[#4f46e5]',
    'PERFORMANCE': 'bg-[#059669]',
    'BUG FIX': 'bg-[#dc2626]',
    'ANNOUNCEMENT': 'bg-[#ca8a04]'
};

function News() {
    const [activeFilter, setActiveFilter] = useState('All Updates');
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const { debouncedQuery } = useSearch();

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const queryParam = activeFilter !== 'All Updates' ? `?tag=${encodeURIComponent(activeFilter)}` : '';
                const res = await fetch(`${API_BASE}/news${queryParam}`);
                const data = await res.json();
                if (data.success) {
                    setUpdates(data.data.map(n => ({
                        id: n.news_id,
                        date: new Date(n.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                        tag: n.tag,
                        bgColor: tagColors[n.tag] || 'bg-[#5b5bff]',
                        title: n.title,
                        description: n.description
                    })));
                } else {
                    setUpdates([]);
                }
            } catch (err) {
                console.error('Failed to fetch news:', err);
                setUpdates([]);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [activeFilter]);

    const filters = ['All Updates', 'NEW FEATURE', 'PERFORMANCE', 'UI IMPROVEMENT', 'BUG FIX', 'ANNOUNCEMENT'];

    return (
        <div className="max-w-[1000px] text-black dark:text-white pt-6 pb-20">

            {/* Top Banner */}
            <div className="w-full bg-gradient-to-r from-[#4f46e5] via-[#1e1b4b] to-[#040914] rounded-[20px] p-10 mb-8 shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[160px]">
                <h1 className="font-bold text-3xl md:text-[34px] text-white mb-3 tracking-wide drop-shadow-md">
                    What's New in Quiz Hub
                </h1>
                <p className="text-[#818cf8] text-sm font-medium tracking-wide">
                    Track the latest features, bug fixes, and improvements we've built for you
                </p>
            </div>

            {/* Filter Badges */}
            <div className="flex flex-wrap gap-3 items-center mb-8 px-1">
                {filters.map(filter => (
                    <span
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`rounded-full px-5 py-1 text-xs font-bold cursor-pointer transition tracking-wide ${
                            activeFilter === filter
                                ? 'border-2 border-gray-800 dark:border-white text-gray-800 dark:text-white bg-gray-200 dark:bg-white/10 shadow-lg'
                                : 'border border-gray-400 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-white/10'
                        }`}
                    >
                        {filter}
                    </span>
                ))}
            </div>

            {/* Updates List */}
            <div className="space-y-6 px-1">
                {loading ? (
                    <div className="text-center text-gray-400 py-12">Loading updates...</div>
                ) : updates.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">
                        <p className="text-lg mb-2">No updates available</p>
                        <p className="text-sm">Check back later for new announcements</p>
                    </div>
                ) : (
                    updates.filter(u => !debouncedQuery || u.title?.toLowerCase().includes(debouncedQuery)).map((update, idx) => (
                        <div
                            key={update.id || idx}
                            className="bg-white dark:bg-[#1b2230]/60 border-[1.5px] border-gray-200 dark:border-gray-700/50 rounded-[14px] p-6 shadow-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-300 backdrop-blur-sm"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[13px] font-bold text-gray-800 dark:text-white tracking-wide">
                                    Date : {update.date}
                                </span>
                                <span className={`${update.bgColor} text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-sm`}>
                                    {update.tag}
                                </span>
                            </div>
                            <h2 className="text-[19px] font-bold text-gray-900 dark:text-white mb-3 tracking-wide">
                                {update.title}
                            </h2>
                            <p className="text-[13px] leading-relaxed text-gray-600 dark:text-gray-400 font-medium">
                                {update.description}
                            </p>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}

export default News;