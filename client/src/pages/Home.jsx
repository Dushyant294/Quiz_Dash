import React from 'react';
import QuizCard from '../components/QuizCard';

const quizzes = [
  { id: 1, title: 'JavaScript Basics', category: 'Technology', image: 'https://placehold.co/400x200/FACC15/FFFFFF?text=JS' },
  { id: 2, title: 'Common Medicines', category: 'NEET', image: 'https://placehold.co/400x200/F43F5E/FFFFFF?text=Med' },
  { id: 3, title: 'Current Affairs', category: 'NDA-NA', image: 'https://placehold.co/400x200/10B981/FFFFFF?text=News' },
  { id: 4, title: 'Modern History', category: 'NDA-NA', image: 'https://placehold.co/400x200/D97706/FFFFFF?text=History' },
];

const examCategories = [
  { name: "NEET", gradient: "from-[#004D4D]/40 to-[#00A3A3]/20", border: "border-[#00A3A3]/50" },
  { name: "JEE", gradient: "from-[#0F172A]/40 to-[#2563EB]/20", border: "border-[#2563EB]/50" },
  { name: "NDA-NA", gradient: "from-[#422006]/40 to-[#A16207]/20", border: "border-[#A16207]/50" },
  { name: "GATE", gradient: "from-[#450A0A]/40 to-[#7F1D1D]/20", border: "border-[#7F1D1D]/50" },
  { name: "SSC CGL", gradient: "from-[#7F1D1D]/40 to-[#EF4444]/20", border: "border-[#EF4444]/50" }
];

const howItWorksSteps = [
  {
    step: 1,
    title: 'Browse Categories',
    description: 'Explore our wide range of quiz categories to find topics that interest you.',
    image: 'https://placehold.co/400x250/3B82F6/FFFFFF?text=Books'
  },
  {
    step: 2,
    title: 'Take Quizzes',
    description: 'Challenge yourself with quizzes of varying difficulty levels and formats.',
    image: 'https://placehold.co/400x250/8B5CF6/FFFFFF?text=Quiz+UI'
  },
  {
    step: 3,
    title: 'Earn Rewards',
    description: 'Collect points, badges, and climb the leaderboard as you complete quizzes.',
    image: 'https://placehold.co/400x250/F59E0B/FFFFFF?text=Trophy'
  }
];

function Home() {
  return (
    <div className="max-w-[1400px]">
      {/* Hero */}
      <div className="bg-[#110e1b] bg-gradient-to-r from-[#1E1B4B]/80 to-[#0B0E14] text-white rounded-[2rem] p-12 lg:p-16 mb-16 shadow-2xl relative overflow-hidden border border-white/5">
        {/* Decorative glows */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[150%] bg-[#4F46E5]/20 blur-[120px] rounded-full"></div>
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[100%] bg-[#9333EA]/10 blur-[100px] rounded-full"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight">
            Your Quiz Adventure Starts Here: <br />
            Play, Share, Earn!
          </h1>

          <p className="text-gray-300 text-lg lg:text-xl max-w-2xl mb-10 font-light">
            Build engaging quizzes, challenge others, and earn rewards
            for your knowledge.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-black px-8 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg shadow-white/10">
              Create Quiz
            </button>
            <button className="bg-[#5B4DFF] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#4B3DE0] transition-colors shadow-lg shadow-[#5B4DFF]/20">
              Join Contest
            </button>
          </div>
        </div>
      </div>

      {/* Latest Quizzes */}
      <h2 className="text-2xl font-semibold mb-6 text-white">Latest Quizzes</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {quizzes.map((item) => (
          <QuizCard
            key={item.id}
            title={item.title}
            category={item.category}
            image={item.image}
            difficulty="Medium"
          />
        ))}
      </div>

      {/* Categories */}
      <h2 className="text-2xl font-semibold mb-6 text-white">Quiz Categories</h2>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-16">
        {examCategories.map((cat) => (
          <div
            key={cat.name}
            className={`bg-[#0d1017] bg-gradient-to-b ${cat.gradient} rounded-2xl h-[140px] flex items-center justify-center shadow-lg border ${cat.border} hover:-translate-y-1 cursor-pointer transition-transform duration-300 relative overflow-hidden`}
          >
            {/* Subtle inner glow */}
            <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-20`}></div>
            <span className="text-white text-xl font-extrabold tracking-wider uppercase relative z-10 drop-shadow-md">
              {cat.name}
            </span>
          </div>
        ))}
      </div>

      {/* How it Works Section */}
      <div className="border border-[#4F46E5]/30 bg-[#0d0f14]/50 rounded-[2rem] p-10 lg:p-16 mb-16 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#4F46E5] to-transparent opacity-50"></div>

        <div className="flex flex-col items-center mb-16 relative z-10">
          <div className="border border-white/20 text-gray-300 px-5 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            Simple Process
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">How it Works</h2>
          <p className="text-gray-400 text-center max-w-2xl">
            Getting started with our quiz platform is very easy. Follow these steps to begin your quiz journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {howItWorksSteps.map((step) => (
            <div key={step.step} className="flex flex-col relative group">
              {/* Image Container */}
              <div className="bg-[#1a1d24] rounded-2xl p-4 border border-white/5 mb-8 relative z-10 transition-transform duration-300 group-hover:-translate-y-2">
                <img src={step.image} alt={step.title} className="w-full h-auto rounded-xl" />
              </div>

              {/* Step Number Badge */}
              <div className="absolute top-[50%] -translate-y-[50%] -left-4 w-10 h-10 bg-[#2d2459] border border-[#5B4DFF] rounded-full flex items-center justify-center text-white font-bold z-20 shadow-lg shadow-[#5B4DFF]/20">
                {step.step}
              </div>

              {/* Text content */}
              <div className="px-2">
                <h3 className="text-white font-bold text-xl mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center text-gray-400 text-sm relative z-10">
          Ready to start your quiz journey? Browse categories, find your interests, and begin challenging yourself today.
        </div>
      </div>

      {/* Footer Section */}
      <div className="border border-[#4F46E5]/30 bg-[#0d0f14]/50 rounded-[2rem] p-10 lg:p-16 relative overflow-hidden flex flex-col items-center">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#4F46E5] to-transparent opacity-50"></div>

        <h2 className="text-3xl font-bold text-white mb-4 tracking-wide relative z-10">QuizDash</h2>
        <p className="text-gray-400 text-sm text-center max-w-xl mb-16 relative z-10">
          Create engaging quizzes, challenge others, and earn rewards for your knowledge. Join our community of quiz creators and players today.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-32 w-full max-w-4xl relative z-10 mb-16">
          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-4 text-gray-400 text-sm flex flex-col items-center md:items-start">
              <li><a href="#" className="hover:text-[#5B4DFF] transition-colors">• Dashboard</a></li>
              <li><a href="#" className="hover:text-[#5B4DFF] transition-colors">• Create Quiz</a></li>
              <li><a href="#" className="hover:text-[#5B4DFF] transition-colors">• Leaderboard</a></li>
              <li><a href="#" className="hover:text-[#5B4DFF] transition-colors">• Explore Quiz</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-6 text-lg">Categories</h3>
            <ul className="space-y-4 text-gray-400 text-sm flex flex-col items-center md:items-start">
              <li><a href="#" className="hover:text-[#5B4DFF] transition-colors">• NEET</a></li>
              <li><a href="#" className="hover:text-[#5B4DFF] transition-colors">• JEE</a></li>
              <li><a href="#" className="hover:text-[#5B4DFF] transition-colors">• SSC-CGL</a></li>
              <li><a href="#" className="hover:text-[#5B4DFF] transition-colors">• NDA</a></li>
              <li><a href="#" className="hover:text-[#5B4DFF] transition-colors">• Technology</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-6 text-lg">Contact Us</h3>
            <ul className="space-y-4 text-gray-400 text-sm flex flex-col items-center md:items-start">
              <li>• email : abc@example.com</li>
              <li>• contact : +91 3456223478</li>
            </ul>
          </div>
        </div>

        <button className="bg-[#5B4DFF]/20 text-[#8B80F9] border border-[#5B4DFF]/50 px-8 py-3 rounded-full font-semibold hover:bg-[#5B4DFF]/30 transition-colors relative z-10 text-sm">
          Contact Support
        </button>
      </div>
    </div>
  );
}

export default Home;
