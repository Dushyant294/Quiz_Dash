import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiFetch, authFetch } from '../config/api';
import QuizCard from "../components/QuizCard";
import { useSearch } from '../context/SearchContext';

function Explore() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const categoryQuery = searchParams.get('category');
    const { debouncedQuery } = useSearch();

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

    // Filter by search, then group by category
    const searchFiltered = debouncedQuery
        ? quizzes.filter(q => q.title?.toLowerCase().includes(debouncedQuery) || q.category?.toLowerCase().includes(debouncedQuery))
        : quizzes;

    const groupedQuizzes = searchFiltered.reduce((acc, quiz) => {
        const cat = quiz.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(quiz);
        return acc;
    }, {});

    const [viewingQuiz, setViewingQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    
    const handleExploreQuiz = async (quiz) => {
        setViewingQuiz(quiz);
        setLoadingQuestions(true);
        try {
            const res = await apiFetch(`/quizzes/${quiz.id}/questions`);
            const data = await res.json();
            if (data.success) {
                setQuestions(data.data.map(q => ({
                    id: q.question_id,
                    text: q.full_question_text,
                    options: { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d },
                    correctKey: q.correct_answer?.charAt(0) || 'A',
                    correctValue: q.correct_answer,
                    isRevealed: false,
                    hint: q.hint || q.explanation || 'No hint available'
                })));
            }
        } catch (err) {
            console.error('Failed to fetch questions:', err);
            setQuestions([]);
        } finally {
            setLoadingQuestions(false);
        }
    };

    const toggleReveal = (id) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, isRevealed: !q.isRevealed } : q));
    };

    const filteredQuestions = debouncedQuery
        ? questions.filter(q => q.text.toLowerCase().includes(debouncedQuery.toLowerCase()))
        : questions;

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

            {/* Categories or Questions View */}
            {viewingQuiz ? (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[17px] font-bold tracking-wider uppercase text-gray-800 dark:text-white">{viewingQuiz.title} - QUESTIONS</h2>
                        <button onClick={() => setViewingQuiz(null)} className="text-sm font-semibold border-2 border-gray-500 rounded-full px-4 py-1.5 text-gray-400 hover:bg-white/10 transition">&larr; Back</button>
                    </div>
                    {loadingQuestions ? (
                        <div className="text-center text-gray-400 py-10">Loading questions...</div>
                    ) : (
                        <div className="w-full flex flex-col">
                            <div className="border-t border-gray-300 dark:border-gray-600"></div>
                            {filteredQuestions.map((q, index) => (
                                <div key={q.id} className="py-10 border-b border-gray-300 dark:border-gray-600">
                                    <div className="flex flex-col xl:flex-row gap-8 justify-between items-start">
                                        <div className="flex-1 w-full xl:max-w-[600px]">
                                            <h3 className="font-bold text-[14px] md:text-[15px] mb-8 leading-tight">{index + 1}. {q.text}</h3>
                                            <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-8 w-full max-w-[450px]">
                                                {Object.entries(q.options).map(([key, val]) => (
                                                    <div key={key} className="flex flex-row items-center text-[12px] md:text-[13px] font-bold border-b border-gray-400 dark:border-gray-500 pb-1.5">
                                                        <span className="w-5 md:w-6 flex-shrink-0">{key})</span>
                                                        <span className="truncate">{val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div>
                                                {q.isRevealed ? (
                                                    <button onClick={() => toggleReveal(q.id)} className="px-5 py-2.5 rounded-[6px] border border-[#818cf8] bg-[#5b5bff]/20 text-[#818cf8] font-semibold text-[12px] shadow-sm transition tracking-wide">
                                                        {q.correctValue}
                                                    </button>
                                                ) : (
                                                    <button onClick={() => toggleReveal(q.id)} className="px-5 py-2.5 rounded-[6px] border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 font-semibold text-[12px] hover:bg-gray-100 dark:hover:bg-white/5 transition tracking-wide">
                                                        Reveal Answer
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-full xl:w-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 xl:gap-8 xl:border-l border-gray-300 dark:border-gray-600 xl:pl-8 pt-4 xl:pt-0">
                                            <div className="text-[11px] text-gray-500 dark:text-[#d4d4d8] font-medium leading-relaxed max-w-[300px] xl:max-w-[260px]">
                                                Hint : {q.hint}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredQuestions.length === 0 && (
                                <div className="py-10 text-center text-gray-400">No questions found.</div>
                            )}
                        </div>
                    )}
                </div>
            ) : loading ? (
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
                                        buttonText="Explore"
                                        buttonLink={null}
                                        onPlay={() => handleExploreQuiz(quiz)}
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