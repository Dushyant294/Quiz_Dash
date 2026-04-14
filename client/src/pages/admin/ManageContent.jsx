import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, authFetch } from '../../config/api';
import { useSearch } from '../../context/SearchContext';

function ManageContent() {
    const navigate = useNavigate();
    const { debouncedQuery } = useSearch();
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [questions, setQuestions] = useState([]);

    // Edit question state
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [editForm, setEditForm] = useState({
        full_question_text: '', option_a: '', option_b: '', option_c: '', option_d: '',
        correct_answer: '', hint: ''
    });
    const [saving, setSaving] = useState(false);

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

    // ─── EDIT QUESTION HANDLERS ──────────────────────────────────
    const startEditQuestion = (q) => {
        setEditingQuestion(q.id);
        setEditForm({
            full_question_text: q.text || '',
            option_a: q.options?.A || '',
            option_b: q.options?.B || '',
            option_c: q.options?.C || '',
            option_d: q.options?.D || '',
            correct_answer: q.correctValue || '',
            hint: q.hint || ''
        });
    };

    const cancelEditQuestion = () => {
        setEditingQuestion(null);
        setEditForm({ full_question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: '', hint: '' });
    };

    const saveEditQuestion = async (questionId) => {
        if (!editForm.full_question_text.trim() || !editForm.option_a.trim() || !editForm.option_b.trim() || !editForm.correct_answer.trim()) {
            alert('Question text, options A & B, and correct answer are required.');
            return;
        }
        setSaving(true);
        try {
            const res = await authFetch(`${API_BASE}/admin/questions/${questionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            const data = await res.json();
            if (data.success) {
                // Update local state immediately
                setQuestions(questions.map(q => q.id === questionId ? {
                    ...q,
                    text: editForm.full_question_text,
                    options: { A: editForm.option_a, B: editForm.option_b, C: editForm.option_c, D: editForm.option_d },
                    correctValue: editForm.correct_answer,
                    correctKey: editForm.correct_answer.charAt(0) || 'A',
                    hint: editForm.hint
                } : q));
                setEditingQuestion(null);
            } else {
                alert(data.message || 'Failed to update question');
            }
        } catch (err) {
            console.error('Failed to update question:', err);
            alert('Failed to update question');
        } finally {
            setSaving(false);
        }
    };

    const toggleReveal = (id) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, isRevealed: !q.isRevealed } : q));
    };

    // ─── SEARCH FILTERING ────────────────────────────────────────
    const filteredQuizzes = debouncedQuery
        ? quizzes.filter(q =>
            q.title.toLowerCase().includes(debouncedQuery) ||
            q.category.toLowerCase().includes(debouncedQuery)
          )
        : quizzes;

    const filteredQuestions = debouncedQuery
        ? questions.filter(q => q.text.toLowerCase().includes(debouncedQuery))
        : questions;

    return (
        <div className="max-w-[1200px] mx-auto text-black dark:text-white pb-12 pt-6">

            {/* Banner */}
            <div className="w-full bg-gradient-to-r from-indigo-500/90 via-primary-darker to-brand-dark/50 dark:to-[#090e17] rounded-2xl py-12 px-10 mb-10 shadow-lg relative overflow-hidden">
                <h1 className="font-bold text-3xl md:text-[34px] text-white mb-8 tracking-wide relative z-10">One Centralized Panel for Management</h1>
                <div className="flex flex-wrap gap-4 relative z-10">
                    <button onClick={() => navigate('/admin/users')} className="px-6 py-1.5 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white/10 transition">mange users</button>
                    <button onClick={() => navigate('/admin/content')} className="px-6 py-1.5 rounded-full border-2 border-primary-light bg-indigo-500 text-white font-semibold text-sm shadow-md">manage Q's</button>
                    <button onClick={() => navigate('/admin/tournaments')} className="px-6 py-1.5 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white/10 transition">manage tournaments</button>
                    <button onClick={() => navigate('/admin/reports')} className="px-6 py-1.5 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white/10 transition">Reports</button>
                </div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
            </div>

            {editingQuiz === null ? (
                <div>
                    <h2 className="text-xl font-bold uppercase tracking-wider text-gray-800 dark:text-white mb-4">Existing Quizzes</h2>
                    <div className="bg-white dark:bg-brand-surfaceAlt rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
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
                                {filteredQuizzes.map((quiz) => (
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
                                            <button onClick={() => handleEditQuiz(quiz.id)} className="text-indigo-500 font-semibold hover:underline mr-4 transition-colors">Edit</button>
                                            <button onClick={() => handleDeleteFile(quiz.id)} className="text-red-400 hover:text-red-600 font-semibold transition-colors">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredQuizzes.length === 0 && (
                                    <tr><td colSpan={5} className="py-8 text-center text-gray-400">No quizzes match your search.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[17px] font-bold tracking-wider uppercase text-gray-800 dark:text-white">USER QUESTIONS</h2>
                        <button onClick={() => { setEditingQuiz(null); setEditingQuestion(null); }} className="text-sm font-semibold border-2 border-gray-500 rounded-full px-4 py-1.5 text-gray-400 hover:bg-white/10 transition">&larr; Back</button>
                    </div>
                    <div className="w-full flex flex-col">
                        <div className="border-t border-gray-300 dark:border-gray-600"></div>
                        {filteredQuestions.map((q, index) => (
                            <div key={q.id} className="py-10 border-b border-gray-300 dark:border-gray-600">
                                {editingQuestion === q.id ? (
                                    /* ─── EDIT MODE ─── */
                                    <div className="bg-[#111827] border border-indigo-500/30 rounded-xl p-6">
                                        <h3 className="text-sm font-bold text-primary-light mb-4 uppercase tracking-wider">Editing Question #{index + 1}</h3>
                                        
                                        <label className="block text-xs font-semibold text-gray-400 mb-1">Question Text</label>
                                        <textarea
                                            value={editForm.full_question_text}
                                            onChange={e => setEditForm({...editForm, full_question_text: e.target.value})}
                                            className="w-full bg-[#1a1d2e] border border-gray-600 rounded-lg px-4 py-3 text-white text-sm mb-4 min-h-[80px] outline-none focus:border-indigo-500 transition"
                                        />

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            {['A', 'B', 'C', 'D'].map(key => (
                                                <div key={key}>
                                                    <label className="block text-xs font-semibold text-gray-400 mb-1">Option {key}</label>
                                                    <input
                                                        value={editForm[`option_${key.toLowerCase()}`]}
                                                        onChange={e => setEditForm({...editForm, [`option_${key.toLowerCase()}`]: e.target.value})}
                                                        className="w-full bg-[#1a1d2e] border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500 transition"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-400 mb-1">Correct Answer</label>
                                                <input
                                                    value={editForm.correct_answer}
                                                    onChange={e => setEditForm({...editForm, correct_answer: e.target.value})}
                                                    className="w-full bg-[#1a1d2e] border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500 transition"
                                                    placeholder="e.g. Species interaction"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-400 mb-1">Hint</label>
                                                <input
                                                    value={editForm.hint}
                                                    onChange={e => setEditForm({...editForm, hint: e.target.value})}
                                                    className="w-full bg-[#1a1d2e] border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500 transition"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => saveEditQuestion(q.id)}
                                                disabled={saving}
                                                className="px-6 py-2 rounded-lg bg-indigo-500 hover:bg-primary text-white font-bold text-sm transition disabled:opacity-50"
                                            >
                                                {saving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button
                                                onClick={cancelEditQuestion}
                                                className="px-6 py-2 rounded-lg border border-gray-500 text-gray-300 font-bold text-sm hover:bg-white/5 transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* ─── VIEW MODE ─── */
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
                                                    <button onClick={() => toggleReveal(q.id)} className="px-5 py-2.5 rounded-[6px] border border-primary-light bg-indigo-500/20 text-primary-light font-semibold text-[12px] shadow-sm transition tracking-wide">
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
                                            <div className="flex flex-col gap-2 flex-shrink-0">
                                                <button onClick={() => startEditQuestion(q)} className="px-6 py-2 rounded-[6px] border-[1.5px] border-indigo-500 bg-indigo-500/20 hover:bg-indigo-500 text-primary-light hover:text-white font-bold text-[13px] transition whitespace-nowrap tracking-wide">
                                                    ✏️ Edit Question
                                                </button>
                                                <button onClick={() => handleDeleteQuestion(q.id)} className="px-6 py-2 rounded-[6px] border-[1.5px] border-white bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-[13px] transition whitespace-nowrap shadow-md tracking-wide">
                                                    Remove Question
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {filteredQuestions.length === 0 && (
                            <div className="py-10 text-center text-gray-400">No questions match your search.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageContent;
