import { useState } from 'react';

function QuizBattle() {
    const [activeTab, setActiveTab] = useState('1v1');

    // Shared dropdown style helper
    const selectStyle = {
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3af' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
    };

    return (
        <div className="max-w-[1100px] mx-auto text-white pt-6 pb-20">

            {/* Title Section */}
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-wide mb-2">Quiz Battle</h1>
                <p className="text-gray-400 text-sm font-medium">
                    Challenge friends or random players to real-time quiz battles
                </p>
            </div>

            {/* Tab Toggle */}
            <div className="flex justify-center mb-8">
                <div className="bg-[#1a1d2e] border border-gray-600/50 rounded-full p-1 flex w-fit">
                    <button
                        onClick={() => setActiveTab('1v1')}
                        className={`px-8 py-2 rounded-full text-sm font-semibold transition-all ${
                            activeTab === '1v1'
                                ? 'bg-[#475569] text-white shadow-md'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        1v1 Battle
                    </button>
                    <button
                        onClick={() => setActiveTab('solo')}
                        className={`px-8 py-2 rounded-full text-sm font-semibold transition-all ${
                            activeTab === 'solo'
                                ? 'bg-[#475569] text-white shadow-md'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Solo (practice on your own)
                    </button>
                </div>
            </div>

            {/* Form Card */}
            <div className="border border-gray-600/60 rounded-2xl p-8 md:p-12 bg-[#0b1220]/30 max-w-[800px] mx-auto">

                {/* Card Title */}
                <div className="text-center mb-8">
                    <h2 className="text-xl font-bold mb-2">
                        {activeTab === '1v1' ? '1v1 Battle' : 'Play SOLO'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {activeTab === '1v1'
                            ? 'get matched with a random player for a head-to-head quiz battle.'
                            : 'Sharpen your axe alone in your own battle ground .'}
                    </p>
                </div>

                {/* Two-Column Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">

                    {/* Left Column */}
                    <div className="flex flex-col gap-6">
                        {/* Exam */}
                        <div>
                            <label className="text-white text-sm font-bold mb-2 block">Exam</label>
                            <select
                                className="w-full bg-[#475569]/60 text-gray-200 border border-gray-500/50 rounded-lg h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b5bff] transition appearance-none cursor-pointer"
                                style={selectStyle}
                                defaultValue="NEET"
                            >
                                <option value="NEET">NEET</option>
                                <option value="JEE">JEE</option>
                                <option value="NDA">NDA</option>
                                <option value="GATE">GATE</option>
                                <option value="SSC-CGL">SSC CGL</option>
                            </select>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="text-white text-sm font-bold mb-2 block">Subject</label>
                            <select
                                className="w-full bg-[#475569]/60 text-gray-200 border border-gray-500/50 rounded-lg h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b5bff] transition appearance-none cursor-pointer"
                                style={selectStyle}
                                defaultValue="Botany"
                            >
                                <option value="Botany">Botany</option>
                                <option value="Zoology">Zoology</option>
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                            </select>
                        </div>

                        {/* Topic */}
                        <div>
                            <label className="text-white text-sm font-bold mb-2 block">Topic</label>
                            <select
                                className="w-full bg-[#475569]/60 text-gray-200 border border-gray-500/50 rounded-lg h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b5bff] transition appearance-none cursor-pointer"
                                style={selectStyle}
                                defaultValue="Plant Physiology"
                            >
                                <option value="Plant Physiology">Plant Physiology</option>
                                <option value="Ecology">Ecology</option>
                                <option value="Genetics">Genetics</option>
                                <option value="Cell Biology">Cell Biology</option>
                            </select>
                        </div>

                        {/* Micro-topic (Optional) */}
                        <div>
                            <label className="text-white text-sm font-bold mb-2 block">Micro-topic (Optional)</label>
                            <select
                                className="w-full bg-[#475569]/60 text-gray-200 border border-gray-500/50 rounded-lg h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b5bff] transition appearance-none cursor-pointer"
                                style={selectStyle}
                                defaultValue="Micronutrient Homeostasis"
                            >
                                <option value="Micronutrient Homeostasis">Micronutrient Homeostasis</option>
                                <option value="Photosynthesis">Photosynthesis</option>
                                <option value="Transpiration">Transpiration</option>
                            </select>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6">
                        {/* Number of Questions */}
                        <div>
                            <label className="text-white text-sm font-bold mb-2 block">Number of Questions</label>
                            <select
                                className="w-full bg-[#475569]/60 text-gray-200 border border-gray-500/50 rounded-lg h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b5bff] transition appearance-none cursor-pointer"
                                style={selectStyle}
                                defaultValue="10"
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
                                defaultValue="10"
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
                                defaultValue="Easy"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Start Button */}
                <div className="mt-10">
                    <button className="w-full bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] hover:from-[#4338ca] hover:to-[#6d28d9] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#4f46e5]/30 transition-all text-[15px] tracking-wide">
                        {activeTab === '1v1' ? 'Start 1v1 Battle' : 'Start SOLO'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuizBattle;
