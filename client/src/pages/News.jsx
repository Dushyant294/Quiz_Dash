function News() {
  const updates = [
    {
      date: "February 15, 2026",
      tag: "NEW FEATURE",
      bgColor: "bg-[#5b5bff]",
      title: "Advanced Quiz Creator 1.0",
      description:
        "Our biggest update yet! We've launched the all-new Quiz Creator interface featuring a unified scrollable layout, custom category tagging (NDA, NEET, JEE), and difficulty level settings. Start building your custom challenges today",
    },
    {
      date: "February 14, 2026",
      tag: "UI IMPROVEMENT",
      bgColor: "bg-[#4f46e5]",
      title: "Optimized Dashboard Navigation",
      description:
        "We've refined the sidebar and header for faster navigation. The new layout ensures that your most-used tools—like 'Create Quiz' and 'Explore Categories'—are always just one click away, even on smaller desktop screens",
    },
    {
      date: "February 2, 2026",
      tag: "NEW FEATURE",
      bgColor: "bg-[#5b5bff]",
      title: "Unique Join Codes for Instant Play",
      description:
        "Say goodbye to long links. Every quiz now generates a unique 5-digit alpha-numeric Join Code. Just share the code with friends to let them join your quiz battle instantly from the home page",
    },
  ];

  return (
    <div className="max-w-[1000px] text-white pt-6 pb-20">
      {/* Top Banner */}
      <div className="w-full bg-gradient-to-r from-[#4f46e5] via-[#1e1b4b] to-[#040914] rounded-[20px] p-10 mb-8 shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[160px]">
        <h1 className="font-bold text-3xl md:text-[34px] text-white mb-3 tracking-wide drop-shadow-md">
          What's New in Quiz Hub
        </h1>
        <p className="text-[#818cf8] text-sm font-medium tracking-wide">
          Track the latest features, bug fixes, and improvements we've built for
          you
        </p>
      </div>

      {/* Filter Badges */}
      <div className="flex gap-4 items-center mb-8 px-1">
        <span className="border-2 border-white rounded-full px-5 py-1 text-xs font-bold text-white bg-white/10 shadow-lg cursor-pointer tracking-wide">
          All Updates
        </span>
        <span className="border border-gray-400 text-gray-300 rounded-full px-5 py-1 text-xs font-semibold cursor-pointer hover:bg-white/10 transition tracking-wide">
          NEW FEATURE
        </span>
        <span className="border border-gray-400 text-gray-300 rounded-full px-5 py-1 text-xs font-semibold cursor-pointer hover:bg-white/10 transition tracking-wide">
          PERFORMANCE
        </span>
        <span className="border border-gray-400 text-gray-300 rounded-full px-5 py-1 text-xs font-semibold cursor-pointer hover:bg-white/10 transition tracking-wide">
          UI UPDATE
        </span>
      </div>

      {/* Updates List */}
      <div className="space-y-6 px-1">
        {updates.map((update, idx) => (
          <div
            key={idx}
            className="bg-[#1b2230]/60 border-[1.5px] border-gray-700/50 rounded-[14px] p-6 shadow-lg hover:border-gray-500 transition-colors duration-300 backdrop-blur-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[13px] font-bold text-white tracking-wide">
                Date : {update.date}
              </span>
              <span
                className={`${update.bgColor} text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-sm`}
              >
                {update.tag}
              </span>
            </div>
            <h2 className="text-[19px] font-bold text-white mb-3 tracking-wide">
              {update.title}
            </h2>
            <p className="text-[13px] leading-relaxed text-gray-400 font-medium">
              {update.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default News;
