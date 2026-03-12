import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ManageContent() {
    const navigate = useNavigate();
    const [editingQuiz, setEditingQuiz] = useState(null);

    const quizzes = [
        { id: 1, title: "Fundamentals of Physics", category: "JEE", questions: 45, status: "Published" },
        { id: 2, title: "Organic Chemistry Set 1", category: "NEET", questions: 30, status: "Draft" },
        { id: 3, title: "History of Ancient India", category: "UPSC", questions: 100, status: "Published" },
        { id: 4, title: "Quantitative Aptitude Basics", category: "SSC CGL", questions: 25, status: "Published" },
    ];

    const mockQuestions = [
        {
            id: 1,
            text: "Which of th following is not an attribute of a population ?",
            options: { "A": "Sex Ratio", "B": "Natality", "C": "Mortality", "D": "Species interaction" },
            correctKey: "D",
            correctValue: "Species Interaction",
            isRevealed: true,
            hint: "Attributes describe a group (density, birth/death rate), not interactions between different groups"
        },
        {
            id: 2,
            text: "The process of growth is maximum during",
            options: { "A": "Log phase", "B": "Lag phase", "C": "Senescence", "D": "Dormancy" },
            correctKey: "A",
            correctValue: "Log phase",
            isRevealed: false,
            hint: "The log phase is the period of rapid exponential growth where resources are abundant"
        },
        {
            id: 3,
            text: "The roots that originate from the base of the stem are :",
            options: { "A": "Fibrous roots", "B": "Primary root", "C": "Prop root", "D": "Lateral root" },
            correctKey: "A",
            correctValue: "Fibrous roots",
            isRevealed: false,
            hint: "Fibrous roots emerge as a cluster from the stem base once the primary root is short-lived"
        }
    ];

    const [questions, setQuestions] = useState(mockQuestions);

    const toggleReveal = (id) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, isRevealed: !q.isRevealed } : q));
    };

    return (
        <div className="max-w-[1200px] mx-auto text-black dark:text-white pb-12 pt-6">

            {/* Banner */}
            <div className="w-full bg-gradient-to-r from-[#5b5bff]/90 via-[#312e81] to-[#0b1220]/50 dark:to-[#090e17] rounded-2xl py-12 px-10 mb-10 shadow-lg relative overflow-hidden">
                <h1 className="font-bold text-3xl md:text-[34px] text-white mb-8 tracking-wide relative z-10">
                    One Centralized Panel for Management
                </h1>

                {/* Banner Buttons */}
                <div className="flex flex-wrap gap-4 relative z-10">
                    <button onClick={() => navigate('/admin/users')} className="px-6 py-1.5 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white/10 transition">
                        mange users
                    </button>
                    <button onClick={() => navigate('/admin/content')} className="px-6 py-1.5 rounded-full border-2 border-[#818cf8] bg-[#5b5bff] text-white font-semibold text-sm shadow-md">
                        manage Q's
                    </button>
                    <button onClick={() => navigate('/admin/tournaments')} className="px-6 py-1.5 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white/10 transition">
                        manage tournaments
                    </button>
                    <button onClick={() => navigate('/admin/reports')} className="px-6 py-1.5 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white/10 transition">
                        Reports
                    </button>
                </div>

                {/* Decorative glow */}
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
                                            <button onClick={() => setEditingQuiz(quiz.id)} className="text-[#5b5bff] font-semibold hover:underline mr-4 transition-colors">Edit</button>
                                            <button className="text-red-400 hover:text-red-600 font-semibold transition-colors">Delete</button>
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
                        <h2 className="text-[17px] font-bold tracking-wider uppercase text-gray-800 dark:text-white">
                            USER  QUESTIONS
                        </h2>
                        <button onClick={() => setEditingQuiz(null)} className="text-sm font-semibold border-2 border-gray-500 rounded-full px-4 py-1.5 text-gray-400 hover:bg-white/10 transition">
                            &larr; Back
                        </button>
                    </div>

                    <div className="w-full flex flex-col">
                        <div className="border-t border-gray-300 dark:border-gray-600"></div>

                        {questions.map((q, index) => (
                            <div key={q.id} className="py-10 border-b border-gray-300 dark:border-gray-600 flex flex-col xl:flex-row gap-8 justify-between items-start">

                                {/* Left Side: Question and Options */}
                                <div className="flex-1 w-full xl:max-w-[600px]">
                                    <h3 className="font-bold text-[14px] md:text-[15px] mb-8 leading-tight">
                                        {index + 1}. {q.text}
                                    </h3>

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
                                            <button
                                                onClick={() => toggleReveal(q.id)}
                                                className="px-5 py-2.5 rounded-[6px] border border-[#818cf8] bg-[#5b5bff]/20 text-[#818cf8] font-semibold text-[12px] shadow-sm transition tracking-wide"
                                            >
                                                {q.correctKey}) {q.correctValue}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => toggleReveal(q.id)}
                                                className="px-5 py-2.5 rounded-[6px] border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 font-semibold text-[12px] hover:bg-gray-100 dark:hover:bg-white/5 transition tracking-wide"
                                            >
                                                Reveal Answer
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Right Side: Hint & Remove Button */}
                                <div className="w-full xl:w-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 xl:gap-8 xl:border-l border-gray-300 dark:border-gray-600 xl:pl-8 pt-4 xl:pt-0">
                                    <div className="text-[11px] text-gray-500 dark:text-[#d4d4d8] font-medium leading-relaxed max-w-[300px] xl:max-w-[260px]">
                                        Hint : {q.hint}
                                    </div>
                                    <button className="px-6 py-2 rounded-[6px] border-[1.5px] border-white bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-[13px] transition whitespace-nowrap shadow-md tracking-wide flex-shrink-0">
                                        Remove Queastions
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