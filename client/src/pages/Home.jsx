const quizzes = [1, 2, 3];
const examCategories = [
  { name: "NEET", gradient: "from-[#004D4D] to-[#00A3A3]" },
  { name: "JEE", gradient: "from-[#0F172A] to-[#2563EB]" },
  { name: "NDA-NA", gradient: "from-[#422006] to-[#A16207]" },
  { name: "GATE", gradient: "from-[#450A0A] to-[#7F1D1D]" },
  { name: "SSC CGL", gradient: "from-[#7F1D1D] to-[#EF4444]" }
];

function Home() {
  return (
    <div className="max-w-[1400px]">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#4F46E5] to-[#0B0E14] text-white rounded-2xl p-14 mb-16 shadow-lg">
        <h1 className="text-5xl font-bold mb-3">
          Your Quiz Adventure Starts Here:
        </h1>
        <h1 className="text-5xl font-bold mb-6">
          Play, Share, Earn!
        </h1>

        <p className="text-gray-200 text-lg max-w-2xl mb-8">
          Build engaging quizzes, challenge others, and earn rewards
          for your knowledge.
        </p>

        <div className="flex gap-5">
          <button className="bg-white text-black px-7 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Create Quiz
          </button>
          <button className="bg-white/20 text-white border border-white/30 px-7 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors">
            Join Contest
          </button>
        </div>
      </div>

      {/* Latest Quizzes */}
      <h2 className="text-2xl font-semibold mb-6">Latest Quizzes</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
        {quizzes.map((item) => (
          <div key={item} className="bg-white dark:bg-[#1b2230] rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="h-48 bg-gray-300 dark:bg-gray-700 w-full object-cover"></div>

            <div className="p-5">
              <span className="text-[10px] bg-[#FACC15] text-black px-2 py-0.5 rounded-md font-bold uppercase">
                Medium
              </span>

              <h3 className="text-lg font-semibold mt-3 text-black dark:text-white">
                Sample Quiz Title
              </h3>
              <div className="text-gray-500 text-xs mt-1">Technology</div>

              <div className="flex justify-between items-center mt-4">
                <span></span>
                <button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                  Play Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <h2 className="text-2xl font-semibold mb-6">Quiz Categories</h2>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        {examCategories.map((cat) => (
          <div
            key={cat.name}
            className={`bg-gradient-to-b ${cat.gradient} rounded-2xl h-48 flex items-end justify-center pb-6 shadow-lg border border-white/10 hover:scale-[1.02] cursor-pointer transition-transform`}
          >
            <span className="text-white text-xl font-extrabold tracking-widest uppercase">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
