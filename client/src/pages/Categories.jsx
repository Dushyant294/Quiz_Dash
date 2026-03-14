import { Link } from "react-router-dom";

function Categories() {
  const refinedCategories = [
    {
      title: "NEET",
      subtitle: "Medical Entrance Prep & Biology\nSpecialist Quizzes",
      gradient: "bg-gradient-to-b from-[#14532d] via-[#064e3b] to-black",
      border: "border-[#4ade80]/40 text-white",
      slug: "neet",
    },
    {
      title: "JEE",
      subtitle: "Engineering Entrance focused\non Physics, Chemistry & Maths",
      gradient: "bg-gradient-to-b from-[#312e81] via-[#1e1b4b] to-black",
      border: "border-[#818cf8]/40 text-white",
      slug: "jee",
    },
    {
      title: "NDA-NA",
      subtitle: "Defence Academy Prep: General\nAbility & Mathematics Mocks",
      gradient: "bg-gradient-to-b from-[#b45309] via-[#713f12] to-black",
      border: "border-[#fcd34d]/40 text-white",
      slug: "nda",
    },
    {
      title: "SSC CGL",
      subtitle: "Government Tier 1 & 2\nCompetitive Patterns",
      gradient: "bg-gradient-to-b from-[#15803d] via-[#14532d] to-black",
      border: "border-[#86efac]/40 text-white",
      slug: "ssc",
    },
    {
      title: "GATE",
      subtitle: "Advanced Engineering & PSU\nEntrance Mock Tests",
      gradient: "bg-gradient-to-b from-[#991b1b] via-[#450a0a] to-black",
      border: "border-[#fca5a5]/40 text-white",
      slug: "gate",
    },
    {
      title: "Boards",
      subtitle: "CBSE, ICSE & State Board Mock\nExams",
      gradient: "bg-gradient-to-b from-[#7e22ce] via-[#4c1d95] to-black",
      border: "border-[#d8b4fe]/40 text-white",
      slug: "boards",
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto text-black dark:text-white pb-12 pt-6">

      {/* Top Banner */}
      <div className="w-full bg-gradient-to-r from-[#4f46e5] via-[#1e1b4b] to-[#040914] rounded-2xl py-12 px-10 mb-10 shadow-2xl">
        <h1 className="font-bold text-3xl md:text-[32px] text-white mb-3 tracking-wide">
          Select Your Path to Success : Mock Quizzes for Your Career Goals
        </h1>

        <p className="text-gray-300 text-sm font-light mb-8">
          Select a category to explore specialized mock tests and quizzes
        </p>

        <div className="flex flex-wrap gap-4">
          <span className="border-2 border-white rounded-full px-5 py-1.5 font-semibold text-sm bg-white/10">
            Trending Now
          </span>
          <span className="border border-white/40 rounded-full px-5 py-1.5 text-sm">GATE</span>
          <span className="border border-white/40 rounded-full px-5 py-1.5 text-sm">JEE</span>
          <span className="border border-white/40 rounded-full px-5 py-1.5 text-sm">NEET</span>
          <span className="border border-white/40 rounded-full px-5 py-1.5 text-sm">Boards</span>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="flex justify-center mb-10">
        <span className="border-2 border-gray-400 rounded-lg px-5 py-1.5 font-semibold text-[15px]">
          Popular Categories
        </span>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {refinedCategories.map((cat, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border ${cat.border} ${cat.gradient} p-8 flex flex-col items-center justify-center text-center shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300`}
          >
            <h2 className="text-2xl font-bold mb-3 tracking-wider">{cat.title}</h2>

            <p className="text-[11px] leading-relaxed text-gray-300 mb-6 px-4 whitespace-pre-line">
              {cat.subtitle}
            </p>

            <Link
              to={`/explore/${cat.slug}`}
              className="border border-white/60 text-white rounded-full px-10 py-1.5 text-xs font-semibold hover:bg-white/20 transition-colors"
            >
              Explore now
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Categories;