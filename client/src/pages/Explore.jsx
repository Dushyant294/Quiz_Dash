import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiFetch, authFetch } from '../config/api';
import QuizCard from "../components/QuizCard";

function Explore() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const categoryQuery = searchParams.get('category');

    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                let url = '/quizzes/explore';
                if (categoryQuery) {
                    url += `?category=${encodeURIComponent(categoryQuery)}`;
                }
                const res = await apiFetch(url);
                const data = await res.json();
                if (data.success) {
                    setQuizzes(data.data);
                }
            } catch (err) { 
                console.error('Failed to fetch quizzes:', err); 
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, [categoryQuery]);

    // Group quizzes by category for display
    const groupedQuizzes = quizzes.reduce((acc, quiz) => {
        const cat = quiz.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(quiz);
        return acc;
    }, {});
    
    const handlePlayQuiz = async (fileId) => {
        if (!localStorage.getItem('token')) {
            alert("Please login to play the quiz!");
            navigate('/login');
            return;
        }
        
        try {
            const res = await authFetch('/battle/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quiz_type: 'solo',
                    file_id: fileId
                })
            });
            const data = await res.json();
            if (data.success && data.data?.session?.session_id) {
                navigate(`/play/${data.data.session.session_id}`);
            } else {
                alert(data.message || "Failed to start quiz. Check if the topic has questions.");
            }
        } catch (e) {
            alert("Failed to create session");
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto text-black dark:text-white pb-12 pt-6 px-4">

            {/* Top Banner */}
            <div className="w-full bg-gradient-to-r from-[#4f46e5] via-[#1e1b4b] to-[#040914] rounded-2xl py-12 px-10 mb-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[40%] h-[150%] bg-[#9333ea]/20 blur-[100px] rounded-full pointer-events-none"></div>
                <h1 className="font-bold text-3xl md:text-[32px] text-white mb-4 tracking-wide relative z-10">
                    Explore Every Topic : Find Your Passion, Master the Quiz!
                </h1>
                <p className="text-[#a5b4fc] text-[15px] font-medium tracking-wide mb-10 relative z-10">
                    choose a topic to find the perfect quiz for you
                </p>

                <div className="flex flex-wrap gap-4 items-center relative z-10">
                    <span 
                        onClick={() => navigate('/explore')}
                        className={`border border-[#4f46e5] text-[#818cf8] rounded-full px-8 py-1.5 text-sm font-semibold cursor-pointer hover:bg-white/10 transition ${!categoryQuery ? 'bg-[#4f46e5]/20 text-white border-white/50' : ''}`}
                    >
                        All Quizzes
                    </span>
                </div>
            </div>

            {/* Categories */}
            {loading ? (
                <div className="text-center text-gray-400 py-10">Loading quizzes...</div>
            ) : Object.keys(groupedQuizzes).length > 0 ? (
                <div className="space-y-10">
                    {Object.entries(groupedQuizzes).map(([categoryName, catQuizzes], idx) => (
                        <div key={idx} className="bg-[#0b0e14]/50 border border-white/5 rounded-2xl p-6">
                            <h2 className="text-2xl font-bold mb-6 text-[#818cf8]">{categoryName}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {catQuizzes.map((quiz, qIdx) => (
                                    <QuizCard
                                        key={qIdx}
                                        title={quiz.title}
                                        category={quiz.category}
                                        questionsCount={quiz.questionsCount}
                                        buttonText="Play Now"
                                        buttonLink={null}
                                        onPlay={() => handlePlayQuiz(quiz.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-400 py-10 border border-white/10 rounded-xl bg-white/5">
                    <h3 className="text-xl font-bold text-white mb-2">No quizzes found</h3>
                    <p>There are no published quizzes available for this category yet.</p>
                </div>
            )}
        </div>
    );
}

export default Explore;