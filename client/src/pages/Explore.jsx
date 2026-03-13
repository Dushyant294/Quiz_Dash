import { Link } from "react-router-dom";
import QuizCard from "../components/QuizCard";

function Explore() {
    const categories = [
        {
            title: "Technology",
            gradient: "bg-gradient-to-br from-[#1e1b4b] to-[#020617]",
            border: "border-[#312e81]",
            iconBg: "border border-[#818cf8]/50",
            quizzes: [
                { title: "JavaScript Basics", stars: 4, questions: 20, button: "Explore Questions" },
                { title: "React Hooks", stars: 4, questions: 15, button: "Explore Questions" },
                { title: "CSS Grid & Flexbox", stars: 3.5, questions: 15, button: "Explore Questions" },
                { title: "HTML5 Semantics", stars: 4, questions: 10, button: "Explore Questions" },
                { title: "Node.js Backend", stars: 4, questions: 20, button: "Play Now" },
            ]
        },
        {
            title: "NEET",
            gradient: "bg-gradient-to-br from-[#064e3b] to-[#020617]",
            border: "border-[#065f46]",
            iconBg: "border border-[#34d399]/50",
            quizzes: [
                { title: "Biotechnology", stars: 4, questions: 20, button: "Explore Questions" },
                { title: "Ecology", stars: 4, questions: 15, button: "Explore Questions" },
                { title: "Medical Terminology", stars: 4, questions: 15, button: "Explore Questions" },
                { title: "Common Medicines", stars: 4, questions: 10, button: "Explore Questions" },
                { title: "Nutrition & Health", stars: 4, questions: 20, button: "Play Now" },
            ]
        },
        {
            title: "NDA-NA",
            gradient: "bg-gradient-to-br from-[#422006] to-[#020617]",
            border: "border-[#713f12]",
            iconBg: "border border-[#fde047]/50",
            quizzes: [
                { title: "Modern Indian History", stars: 4, questions: 20, button: "Explore Questions" },
                { title: "Phy : Laws of Motion", stars: 4, questions: 15, button: "Explore Questions" },
                { title: "Geo : Earth & Rocks", stars: 4, questions: 15, button: "Explore Questions" },
                { title: "Current Affairs", stars: 4, questions: 10, button: "Explore Questions" },
                { title: "Chem : Matter & Gas", stars: 4, questions: 20, button: "Play Now" },
            ]
        }
    ];

    return (
        <div className="max-w-[1200px] mx-auto text-black dark:text-white pb-12 pt-6">

            {/* Top Banner */}
            <div className="w-full bg-gradient-to-r from-[#4f46e5] via-[#1e1b4b] to-black rounded-2xl py-12 px-10 mb-10 shadow-2xl relative">
                <h1 className="font-bold text-3xl md:text-[32px] text-white mb-4 tracking-wide relative">
                    Explore Every Topic : Find Your Passion, Master the Quiz!
                </h1>
                <p className="text-[#a5b4fc] text-[15px] font-medium tracking-wide mb-10 relative">
                    choose a topic to find the perfect quiz for you
                </p>

                <div className="flex gap-4 items-center">
                    <span className="text-sm font-semibold text-[#818cf8] px-4 cursor-pointer">
                        Trending
                    </span>
                    <span className="border border-[#4f46e5] text-[#818cf8] rounded-full px-8 py-1.5 text-sm font-semibold cursor-pointer hover:bg-white/10 transition">
                        New
                    </span>
                    <span className="border-2 border-white rounded-full px-8 py-1.5 text-sm font-bold text-white bg-white/10 shadow-lg cursor-pointer">
                        Popular
                    </span>
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-10">
                {categories.map((cat, idx) => (
                    <div key={idx}>
                        <h2 className="text-xl font-bold mb-4 ml-1">{cat.title}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {cat.quizzes.map((quiz, qIdx) => (
                                <QuizCard
                                    key={qIdx}
                                    title={quiz.title}
                                    category={cat.title}
                                    stars={quiz.stars}
                                    questionsCount={quiz.questions}
                                    buttonText={quiz.button}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Explore;
