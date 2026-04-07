import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, authFetch } from '../config/api';

function QuizBattle() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('1v1');

    const [categories, setCategories] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [microTopics, setMicroTopics] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedMicroTopic, setSelectedMicroTopic] = useState('');
    
    const [questionCount, setQuestionCount] = useState('10');
    const [timePerQuestion, setTimePerQuestion] = useState('10');
    const [difficulty, setDifficulty] = useState('Medium');
    
    const [loading, setLoading] = useState(false);

    // Initial load: Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await apiFetch('/categories');
                const data = await res.json();
                if (data.success) setCategories(data.data);
            } catch (err) { console.error(err); }
        };
        fetchCategories();
    }, []);

    // Change Category
    const handleCategoryChange = async (e) => {
        const catId = e.target.value;
        setSelectedCategory(catId);
        setSelectedSubject('');
        setSelectedTopic('');
        setSelectedMicroTopic('');
        setSubjects([]);
        setTopics([]);
        setMicroTopics([]);
        
        if (catId) {
            try {
                const res = await apiFetch(`/categories/${catId}/subjects`);
                const data = await res.json();
                if (data.success) setSubjects(data.data);
            } catch (err) { console.error(err); }
        }
    };

    // Change Subject
    const handleSubjectChange = async (e) => {
        const subId = e.target.value;
        setSelectedSubject(subId);
        setSelectedTopic('');
        setSelectedMicroTopic('');
        setTopics([]);
        setMicroTopics([]);
        
        if (subId) {
            try {
                const res = await apiFetch(`/subjects/${subId}/topics`);
                const data = await res.json();
                if (data.success) setTopics(data.data);
            } catch (err) { console.error(err); }
        }
    };

    // Change Topic
    const handleTopicChange = async (e) => {
        const topId = e.target.value;
        setSelectedTopic(topId);
        setSelectedMicroTopic('');
        setMicroTopics([]);
        
        if (topId) {
            try {
                const res = await apiFetch(`/topics/${topId}/micro-topics`);
                const data = await res.json();
                if (data.success) setMicroTopics(data.data);
            } catch (err) { console.error(err); }
        }
    };

    // Handle session creation
    const handleStart = async () => {
        if (!localStorage.getItem('token')) {
            alert('Please login to start a quiz battle.');
            navigate('/login');
            return;
        }

        if (!selectedCategory && categories.length > 0) {
            alert('Please select an Exam/Category to continue.');
            return;
        }

        setLoading(true);
        try {
            const response = await authFetch('/battle/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quiz_type: activeTab,
                    category_id: selectedCategory || null,
                    subject_id: selectedSubject || null,
                    topic_id: selectedTopic || null,
                    micro_topic_id: selectedMicroTopic || null,
                    difficulty: difficulty,
                    question_count: questionCount,
                    time_per_question: timePerQuestion
                })
            });

            const data = await response.json();
            if (data.success && data.data?.session?.session_id) {
                navigate(`/play/${data.data.session.session_id}`);
            } else {
                alert(data.message || 'Failed to start quiz. Make sure there are questions available for this selection.');
            }
        } catch (err) {
            console.error(err);
            alert('Error creating quiz session.');
        } finally {
            setLoading(false);
        }
    };

    const selectStyle = {
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3af' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
    };

    return (
        <div className="max-w-[1100px] mx-auto text-white pt-6 pb-20 px-4">
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-wide mb-2">Quiz Battle</h1>
                <p className="text-gray-400 text-sm font-medium">
                    Challenge friends or random players to real-time quiz battles
                </p>
            </div>

            <div className="flex justify-center mb-8">
                <div className="bg-[#1a1d2e] border border-gray-600/50 rounded-full p-1 flex w-fit">
                    <button
                        onClick={() => setActiveTab('1v1')}
                        className={`px-8 py-2 rounded-full text-sm font-semibold transition-all ${
                            activeTab === '1v1' ? 'bg-[#475569] text-white shadow-md' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        1v1 Battle
                    </button>
                    <button
                        onClick={() => setActiveTab('solo')}
                        className={`px-8 py-2 rounded-full text-sm font-semibold transition-all ${
                            activeTab === 'solo' ? 'bg-[#475569] text-white shadow-md' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Solo (practice on your own)
                    </button>
                </div>
            </div>

            <div className="border border-gray-600/60 rounded-2xl p-8 md:p-12 bg-[#0b1220]/30 max-w-[800px] mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-xl font-bold mb-2">
                        {activeTab === '1v1' ? '1v1 Battle' : 'Play SOLO'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {activeTab === '1v1'
                            ? 'Get matched with a random player for a head-to-head quiz battle.'
                            : 'Sharpen your axe alone in your own battle ground.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="flex flex-col gap-6">
                        {/* Exam / Category */}
                        <div>
                            <label className="text-white text-sm font-bold mb-2 block">Exam / Category</label>
                            <select
                                className="w-full bg-[#475569]/60 text-gray-200 border border-gray-500/50 rounded-lg h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b5bff] transition appearance-none cursor-pointer"
                                style={selectStyle}
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                            >
                                <option value="">Select Exam</option>
                                {categories.map(cat => (
                                    <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="text-white text-sm font-bold mb-2 block">Subject</label>
                            <select
                                className="w-full bg-[#475569]/60 text-gray-200 border border-gray-500/50 rounded-lg h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b5bff] transition appearance-none cursor-pointer opacity-disabled-transition"
                                style={selectStyle}
                                value={selectedSubject}
                                onChange={handleSubjectChange}
                                disabled={!selectedCategory || subjects.length === 0}
                            >
                                <option value="">{subjects.length > 0 ? 'Select Subject' : 'No Subjects Available'}</option>
                                {subjects.map(sub => (
                                    <option key={sub.subject_id} value={sub.subject_id}>{sub.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Topic */}
                        <div>
                            <label className="text-white text-sm font-bold mb-2 block">Topic</label>
                            <select
                                className="w-full bg-[#475569]/60 text-gray-200 border border-gray-500/50 rounded-lg h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b5bff] transition appearance-none cursor-pointer"
                                style={selectStyle}
                                value={selectedTopic}
                                onChange={handleTopicChange}
                                disabled={!selectedSubject || topics.length === 0}
                            >
                                <option value="">{topics.length > 0 ? 'Select Topic' : 'No Topics Available'}</option>
                                {topics.map(top => (
                                    <option key={top.topic_id} value={top.topic_id}>{top.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Micro-topic */}
                        <div>
                            <label className="text-white text-sm font-bold mb-2 block">Micro-topic (Optional)</label>
                            <select
                                className="w-full bg-[#475569]/60 text-gray-200 border border-gray-500/50 rounded-lg h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b5bff] transition appearance-none cursor-pointer"
                                style={selectStyle}
                                value={selectedMicroTopic}
                                onChange={(e) => setSelectedMicroTopic(e.target.value)}
                                disabled={!selectedTopic || microTopics.length === 0}
                            >
                                <option value="">{microTopics.length > 0 ? 'Select Micro-Topic' : 'No Micro-Topics Available'}</option>
                                {microTopics.map(mTop => (
                                    <option key={mTop.micro_topic_id} value={mTop.micro_topic_id}>{mTop.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Number of Questions */}
                        <div>
                            <label className="text-white text-sm font-bold mb-2 block">Number of Questions</label>
                            <select
                                className="w-full bg-[#475569]/60 text-gray-200 border border-gray-500/50 rounded-lg h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b5bff] transition appearance-none cursor-pointer"
                                style={selectStyle}
                                value={questionCount}
                                onChange={e => setQuestionCount(e.target.value)}
                            >
                                <option value="5">5 questions</option>
                                <option value="10">10 questions</option>
                                <option value="15">15 questions</option>
                                <option value="20">20 questions</option>
                                <option value="25">25 questions</option>
                            </select>
                        </div>

                        {/* Time Per Question */}
                        <div>
                            <label className="text-white text-sm font-bold mb-2 block">Time Per Question (seconds)</label>
                            <select
                                className="w-full bg-[#475569]/60 text-gray-200 border border-gray-500/50 rounded-lg h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b5bff] transition appearance-none cursor-pointer"
                                style={selectStyle}
                                value={timePerQuestion}
                                onChange={e => setTimePerQuestion(e.target.value)}
                            >
                                <option value="5">5 seconds</option>
                                <option value="10">10 seconds</option>
                                <option value="15">15 seconds</option>
                                <option value="20">20 seconds</option>
                                <option value="30">30 seconds</option>
                            </select>
                        </div>

                        {/* Difficulty */}
                        <div>
                            <label className="text-white text-sm font-bold mb-2 block">Difficulty</label>
                            <select
                                className="w-full bg-[#475569]/60 text-gray-200 border border-gray-500/50 rounded-lg h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b5bff] transition appearance-none cursor-pointer"
                                style={selectStyle}
                                value={difficulty}
                                onChange={e => setDifficulty(e.target.value)}
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-10">
                    <button 
                        disabled={loading}
                        onClick={handleStart}
                        className={`w-full bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] hover:from-[#4338ca] hover:to-[#6d28d9] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#4f46e5]/30 transition-all text-[15px] tracking-wide ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Setting up Battle Ground...' : (activeTab === '1v1' ? 'Start 1v1 Battle' : 'Start SOLO')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuizBattle;
