import { Link } from "react-router-dom";

function Explore() {
  const categories = [
    {
      title: "Technology",
      gradient: "bg-gradient-to-br from-[#1e1b4b] to-[#020617]",
      border: "border-[#312e81]",
      iconBg: "border border-[#818cf8]/50",
      quizzes: [
        {
          title: "JavaScript Basics",
          stars: 4,
          questions: 20,
          button: "Explore Questions",
        },
        {
          title: "React Hooks",
          stars: 4,
          questions: 15,
          button: "Explore Questions",
        },
        {
          title: "CSS Grid & Flexbox",
          stars: 3.5,
          questions: 15,
          button: "Explore Questions",
        },
        {
          title: "HTML5 Semantics",
          stars: 4,
          questions: 10,
          button: "Explore Questions",
        },
        {
          title: "Node.js Backend",
          stars: 4,
          questions: 20,
          button: "Play Now",
        },
      ],
    },
    {
      title: "NEET",
      gradient: "bg-gradient-to-br from-[#064e3b] to-[#020617]",
      border: "border-[#065f46]",
      iconBg: "border border-[#34d399]/50",
      quizzes: [
        {
          title: "Biotechnology",
          stars: 4,
          questions: 20,
          button: "Explore Questions",
        },
        {
          title: "Ecology",
          stars: 4,
          questions: 15,
          button: "Explore Questions",
        },
        {
          title: "Medical Terminology",
          stars: 4,
          questions: 15,
          button: "Explore Questions",
        },
        {
          title: "Common Medicines",
          stars: 4,
          questions: 10,
          button: "Explore Questions",
        },
        {
          title: "Nutrition & Health",
          stars: 4,
          questions: 20,
          button: "Play Now",
        },
      ],
    },
    {
      title: "NDA-NA",
      gradient: "bg-gradient-to-br from-[#422006] to-[#020617]",
      border: "border-[#713f12]",
      iconBg: "border border-[#fde047]/50",
      quizzes: [
        {
          title: "Modern Indian History",
          stars: 4,
          questions: 20,
          button: "Explore Questions",
        },
        {
          title: "Phy : Laws of Motion",
          stars: 4,
          questions: 15,
          button: "Explore Questions",
        },
        {
          title: "Geo : Earth & Rocks",
          stars: 4,
          questions: 15,
          button: "Explore Questions",
        },
        {
          title: "Current Affairs",
          stars: 4,
          questions: 10,
          button: "Explore Questions",
        },
        {
          title: "Chem : Matter & Gas",
          stars: 4,
          questions: 20,
          button: "Play Now",
        },
      ],
    },
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {cat.quizzes.map((quiz, qIdx) => (
                <div
                  key={qIdx}
                  className={`border ${cat.border} ${cat.gradient} rounded-[14px] p-4 flex flex-col justify-between h-[150px] shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`w-[26px] h-[26px] rounded flex items-center justify-center shrink-0 ${cat.iconBg} mt-0.5`}
                    >
                      <span className="text-white text-[10px] font-mono leading-none">
                        &lt;/&gt;
                      </span>
                    </div>
                    <div>
                      <h3 className="text-[13px] font-bold text-white leading-snug mb-1">
                        {quiz.title}
                      </h3>
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[9px] text-gray-300 font-medium">
                          Stars :
                        </span>
                        <div className="flex text-[#fbbf24] text-[9px] drop-shadow-md">
                          ★★★★<span className="text-gray-500">★</span>
                        </div>
                      </div>
                      <p className="text-[9px] text-gray-400 font-medium">
                        {quiz.questions} Questions
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto items-center flex justify-center w-full">
                    <Link
                      to="/play"
                      className="block w-full text-center border border-gray-400 text-gray-300 rounded-full py-1 text-[10px] font-semibold hover:bg-white/10 transition-colors"
                    >
                      {quiz.button}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Explore;
