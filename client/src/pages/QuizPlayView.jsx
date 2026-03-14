import { useState } from 'react';

function QuizPlayView() {
    const [selectedOption, setSelectedOption] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const quizTitle = 'NEET- GROUND DRILLS';
    const category = 'NEET';
    const difficulty = 'Medium';
    const totalQuestions = 5;

    const questions = [
        {
            text: 'Which of the following organs is primarily responsible for the storage of bile?',
            image: 'https://placehold.co/440x320/1a1a2e/666?text=Digestive+System',
            options: ['Liver', 'Duodenum', 'Pancreas', 'Gall Bladder'],
        },
        {
            text: 'Which organelle is known as the powerhouse of the cell?',
            image: 'https://placehold.co/440x320/1a1a2e/666?text=Cell+Biology',
            options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
        },
        {
            text: 'The process of photosynthesis takes place in which part of the plant cell?',
            image: 'https://placehold.co/440x320/1a1a2e/666?text=Plant+Cell',
            options: ['Vacuole', 'Cell wall', 'Chloroplast', 'Cytoplasm'],
        },
        {
            text: 'Which blood group is known as the universal donor?',
            image: 'https://placehold.co/440x320/1a1a2e/666?text=Blood+Groups',
            options: ['A+', 'B+', 'AB+', 'O-'],
        },
        {
            text: 'DNA replication occurs during which phase of the cell cycle?',
            image: 'https://placehold.co/440x320/1a1a2e/666?text=DNA+Structure',
            options: ['G1 phase', 'S phase', 'G2 phase', 'M phase'],
        },
    ];

    const current = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;
    const optionLetters = ['A', 'B', 'C', 'D'];

    const handleNext = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
        }
    };

    return (
        <div className="bg-[#0b1220] text-white min-h-screen p-4 md:p-8">
            <div className="max-w-[1000px] w-full mx-auto">

                {/* Quiz Title */}
                <h1 className="text-xl font-bold mb-3 tracking-wide">{quizTitle}</h1>

                {/* Badges */}
                <div className="flex items-center gap-3 mb-5">
                    <span className="border border-gray-500 text-white text-xs font-semibold px-3 py-1 rounded">
                        {category}
                    </span>
                    <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded">
                        {difficulty}
                    </span>
                </div>

                {/* Progress */}
                <div className="mb-6">
                    <p className="text-sm text-gray-300 mb-2 font-medium">
                        Question {currentQuestion + 1} of {totalQuestions}
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

                        {/* Left: Image */}
                        <div className="md:w-[45%] shrink-0">
                            <img
                                src={current.image}
                                alt="Question illustration"
                                className="w-full h-auto rounded-lg object-cover"
                            />
                        </div>

                        {/* Right: Question + Options */}
                        <div className="flex-1 flex flex-col">
                            <h2 className="text-lg font-semibold mb-6 leading-relaxed">
                                {current.text}
                            </h2>

                            {/* Options */}
                            <div className="flex flex-col gap-3">
                                {current.options.map((option, idx) => (
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
                        {currentQuestion < totalQuestions - 1 ? 'Next Question →' : 'Submit Quiz →'}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default QuizPlayView;