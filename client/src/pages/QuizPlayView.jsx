import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authFetch } from '../config/api';

function QuizPlayView() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await authFetch(`/battle/${sessionId}/questions`);
                const data = await res.json();
                if (data.success && data.data.length > 0) {
                    setQuestions(data.data);
                } else {
                    alert('Could not load quiz questions.');
                    navigate('/home');
                }
            } catch (err) {
                console.error(err);
                alert('Error loading quiz session');
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, [sessionId, navigate]);

    if (loading) {
        return <div className="bg-[#0b1220] text-white min-h-screen p-8 flex justify-center items-center">Loading quiz...</div>;
    }

    if (questions.length === 0) {
        return <div className="bg-[#0b1220] text-white min-h-screen p-8 flex justify-center items-center">No questions found.</div>;
    }

    if (completed && result) {
        return (
            <div className="bg-[#0b1220] text-white min-h-screen p-6 md:p-12 flex justify-center items-center">
               <div className="bg-[#111827] border border-[#5b5bff]/50 rounded-2xl p-10 max-w-lg w-full text-center shadow-2xl shadow-[#5b5bff]/20">
                   <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
                   <p className="text-gray-400 mb-8">Your final score is ready.</p>
                   
                   <div className="text-[#5b5bff] text-6xl font-black mb-10 drop-shadow-md">
                       {result.user1Score} <span className="text-3xl text-gray-500">/ {result.totalQuestions}</span>
                   </div>
                   
                   <div className="flex flex-col gap-4">
                       <button onClick={() => navigate('/dashboard')} className="w-full bg-[#5b5bff] hover:bg-[#4338ca] text-white font-bold py-3 px-6 rounded-xl transition-colors">
                           Go to Dashboard
                       </button>
                       <button onClick={() => navigate('/explore')} className="w-full bg-[#1a1d2e] border border-gray-600 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                           Explore More Quizzes
                       </button>
                   </div>
               </div>
            </div>
        );
    }

    const current = questions[currentQuestionIdx];
    const totalQuestions = questions.length;
    const progress = ((currentQuestionIdx + 1) / totalQuestions) * 100;
    const optionLetters = ['A', 'B', 'C', 'D'];
    
    // The options are mapped from the API response
    const currentOptions = [
       current.option_a, 
       current.option_b, 
       current.option_c, 
       current.option_d
    ].filter(Boolean); // Filter out empty options

    const handleNext = async () => {
        if (selectedOption === null) return;
        
        // Save the answer to backend
        try {
           const answerValue = currentOptions[selectedOption];
           await authFetch(`/battle/${sessionId}/answer`, {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json'
               },
               body: JSON.stringify({ questionId: current.question_id, answer: answerValue })
           });
        } catch (err) {
           console.error('Submit answer error', err);
        }
        
        if (currentQuestionIdx < totalQuestions - 1) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
            setSelectedOption(null);
        } else {
            // Finish quiz
            setLoading(true);
            try {
                const res = await authFetch(`/battle/${sessionId}/complete`, { method: 'POST' });
                const completeData = await res.json();
                if (completeData.success) {
                    setResult(completeData.data);
                    setCompleted(true);
                } else {
                    alert('Failed to complete quiz');
                }
            } catch (err) {
                console.error('Complete error', err);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="bg-[#0b1220] text-white min-h-screen p-4 md:p-8">
            <div className="max-w-[1000px] w-full mx-auto">
                {/* Badges */}
                <div className="flex items-center gap-3 mb-5">
                    <span className="border border-gray-500 text-white text-xs font-semibold px-3 py-1 rounded">
                        {current.exam || 'General'}
                    </span>
                    <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded">
                        {current.difficulty_label || 'Medium'}
                    </span>
                </div>

                {/* Progress */}
                <div className="mb-6">
                    <p className="text-sm text-gray-300 mb-2 font-medium">
                        Question {currentQuestionIdx + 1} of {totalQuestions}
                    </p>
                    <div className="w-full bg-[#1a1d2e] rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-[#4f46e5] h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-[#111827] border border-white/10 rounded-xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Conditional Image */}
                        {current.question_image_url && (
                            <div className="md:w-[45%] shrink-0">
                                <img
                                    src={current.question_image_url}
                                    alt="Question illustration"
                                    className="w-full h-auto rounded-lg object-cover"
                                />
                            </div>
                        )}

                        {/* Right: Question + Options */}
                        <div className="flex-1 flex flex-col">
                            <h2 className="text-lg font-semibold mb-6 leading-relaxed">
                                {current.full_question_text || current.text}
                            </h2>

                            {/* Options */}
                            <div className="flex flex-col gap-3">
                                {currentOptions.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedOption(idx)}
                                        className={`flex items-center gap-4 p-3.5 rounded-lg border transition-all text-left
                                            ${selectedOption === idx
                                                ? 'border-[#4f46e5] bg-[#4f46e5]/15 text-white'
                                                : 'border-gray-700 bg-[#1a1d2e]/50 text-gray-300 hover:border-gray-500 hover:bg-[#1a1d2e]'
                                            }`}
                                    >
                                        <span
                                            className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm shrink-0 transition-colors
                                                ${selectedOption === idx
                                                    ? 'bg-[#4f46e5] text-white'
                                                    : 'bg-[#2a2d3e] text-gray-400'
                                                }`}
                                        >
                                            {optionLetters[idx]}
                                        </span>
                                        <span className="font-medium text-sm">{option}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleNext}
                        disabled={selectedOption === null}
                        className={`px-8 py-3 rounded-lg font-bold transition-all
                            ${selectedOption !== null
                                ? 'bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-lg shadow-[#4f46e5]/30'
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {currentQuestionIdx < totalQuestions - 1 ? 'Next Question →' : 'Submit Quiz →'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuizPlayView;
