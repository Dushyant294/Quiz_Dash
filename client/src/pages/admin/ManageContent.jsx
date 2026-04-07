import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, authFetch } from '../../config/api';

function ManageContent() {
    const navigate = useNavigate();
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await authFetch(`${API_BASE}/admin/content`);
                const data = await res.json();
                if (data.success && data.data.length > 0) {
                    setQuizzes(data.data.map(f => ({
                        id: f.file_id,
                        title: f.file_name || `${f.subject || 'Quiz'} - ${f.topic || 'Set'}`,
                        category: f.subject || 'General',
                        questions: f.question_count,
                        status: f.status || 'Draft'
                    })));
                } else {
                    setQuizzes([
                        { id: 1, title: "Fundamentals of Physics", category: "JEE", questions: 45, status: "Published" },
                        { id: 2, title: "Organic Chemistry Set 1", category: "NEET", questions: 30, status: "Draft" },
                        { id: 3, title: "History of Ancient India", category: "UPSC", questions: 100, status: "Published" },
                        { id: 4, title: "Quantitative Aptitude Basics", category: "SSC CGL", questions: 25, status: "Published" },
                    ]);
                }
            } catch (err) {
                console.error('Failed to fetch content:', err);
                setQuizzes([
                    { id: 1, title: "Fundamentals of Physics", category: "JEE", questions: 45, status: "Published" },
                    { id: 2, title: "Organic Chemistry Set 1", category: "NEET", questions: 30, status: "Draft" },
                ]);
            }
        };
        fetchContent();
    }, []);

    const handleEditQuiz = async (fileId) => {
        setEditingQuiz(fileId);
        try {
            const res = await authFetch(`${API_BASE}/admin/content/${fileId}/questions`);
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
            setQuestions([
                { id: 1, text: "Which of the following is not an attribute of a population?", options: { A: "Sex Ratio", B: "Natality", C: "Mortality", D: "Species interaction" }, correctKey: "D", correctValue: "Species Interaction", isRevealed: false, hint: "Attributes describe a group" },
            ]);
        }
    };

    const handleDeleteFile = async (fileId) => {
        if (!window.confirm('Delete this quiz file and all its questions?')) return;
        try {
            const res = await authFetch(`${API_BASE}/admin/content/${fileId}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setQuizzes(quizzes.filter(q => q.id !== fileId));
            }
        } catch (err) {
            console.error('Failed to delete content:', err);
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        try {
            const res = await authFetch(`${API_BASE}/admin/questions/${questionId}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setQuestions(questions.filter(q => q.id !== questionId));
            }
        } catch (err) {
            console.error('Failed to delete question:', err);
        }
    };

    const toggleReveal = (id) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, isRevealed: !q.isRevealed } : q));
    };

    return (
        <div className="max-w-[1200px] mx-auto text-black dark:text-white pb-12 pt-6">

            {/* Banner */}
            <div className="w-full bg-gradient-to-r from-[#5b5bff]/90 via-[#312e81] to-[#0b1220]/50 dark:to-[#090e17] rounded-2xl py-12 px-10 mb-10 shadow-lg relative overflow-hidden">
                <h1 className="font-bold text-3xl md:text-[34px] text-white mb-8 tracking-wide relative z-10">One Centralized Panel for Management</h1>
                <div className="flex flex-wrap gap-4 relative z-10">
                    <button onClick={() => navigate('/admin/users')} className="px-6 py-1.5 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white/10 transition">mange users</button>
                    <button onClick={() => navigate('/admin/content')} className="px-6 py-1.5 rounded-full border-2 border-[#818cf8] bg-[#5b5bff] text-white font-semibold text-sm shadow-md">manage Q's</button>
                    <button onClick={() => navigate('/admin/tournaments')} className="px-6 py-1.5 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white/10 transition">manage tournaments</button>
                    <button onClick={() => navigate('/admin/reports')} className="px-6 py-1.5 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white/10 transition">Reports</button>
                </div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#5b5bff]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
            </div>

            {editingQuiz === null ? (
                <div>
                    <h2 className="text-xl font-bold uppercase tracking-wider text-gray-800 dark:text-white mb-4">Existing Quizzes</h2>
                    <div className="bg-white dark:bg-[#1b2230] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-[#111823] text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                                    <th className="py-4 px-6 font-semibold">Quiz Title</th>
                                    <th className="py-4 px-6 font-semibold">Category</th>
                                    <th className="py-4 px-6 font-semibold">Questions</th>
                                    <th className="py-4 px-6 font-semibold">Status</th>
                                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quizzes.map((quiz) => (
                                    <tr key={quiz.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#252e3f] transition-colors">
                                        <td className="py-4 px-6 font-semibold">{quiz.title}</td>
                                        <td className="py-4 px-6">
                                            <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-xs font-bold">{quiz.category}</span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{quiz.questions} Qs</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${quiz.status === 'Published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                {quiz.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button onClick={() => handleEditQuiz(quiz.id)} className="text-[#5b5bff] font-semibold hover:underline mr-4 transition-colors">Edit</button>
                                            <button onClick={() => handleDeleteFile(quiz.id)} className="text-red-400 hover:text-red-600 font-semibold transition-colors">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[17px] font-bold tracking-wider uppercase text-gray-800 dark:text-white">USER QUESTIONS</h2>
                        <button onClick={() => setEditingQuiz(null)} className="text-sm font-semibold border-2 border-gray-500 rounded-full px-4 py-1.5 text-gray-400 hover:bg-white/10 transition">&larr; Back</button>
                    </div>
                    <div className="w-full flex flex-col">
                        <div className="border-t border-gray-300 dark:border-gray-600"></div>
                        {questions.map((q, index) => (
                            <div key={q.id} className="py-10 border-b border-gray-300 dark:border-gray-600 flex flex-col xl:flex-row gap-8 justify-between items-start">
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
                                                {q.correctKey}) {q.correctValue}
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
                                    <button onClick={() => handleDeleteQuestion(q.id)} className="px-6 py-2 rounded-[6px] border-[1.5px] border-white bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-[13px] transition whitespace-nowrap shadow-md tracking-wide flex-shrink-0">
                                        Remove Question
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageContent;