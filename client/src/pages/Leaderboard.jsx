function Leaderboard() {
  const leaderboardData = [
    {
      rank: 1,
      user: "@Siddharth_V",
      category: "JEE",
      quizzes: 89,
      points: "15,840",
    },
    {
      rank: 2,
      user: "@Anjali_Nair",
      category: "NEET",
      quizzes: 86,
      points: "15,760",
    },
    {
      rank: 3,
      user: "@Rahul_K",
      category: "NDA-NA",
      quizzes: 78,
      points: "15,000",
    },
    {
      rank: 4,
      user: "@Priya_S",
      category: "JEE",
      quizzes: 60,
      points: "14,840",
    },
    {
      rank: 5,
      user: "@Ishaan_89",
      category: "SSC",
      quizzes: 56,
      points: "14,760",
    },
    {
      rank: 6,
      user: "@abc_89",
      category: "SSC",
      quizzes: 50,
      points: "14,000",
    },
    {
      rank: 7,
      user: "@Priyanka_D",
      category: "NEET",
      quizzes: 49,
      points: "13,999",
    },
  ];

  return (
    <div className="max-w-[1000px] text-white pt-6 pb-20">
      {/* Top Banner */}
      <div className="w-full bg-gradient-to-r from-[#4f46e5] via-[#2f277a] to-[#040914] rounded-2xl p-8 mb-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-bold text-[34px] text-white mb-2 tracking-wide">
            This Week’s Hall of Fame
          </h1>
          <p className="text-[#a5b4fc] text-[13px] font-medium tracking-wide mb-6">
            See where you stand against the best students in the community
          </p>
          <div className="inline-block border border-[#818cf8]/80 text-[#c7d2fe] rounded-full px-6 py-1.5 text-xs font-semibold">
            Your Rank : #47
          </div>
        </div>

        {/* Stats Box inside Banner */}
        <div className="flex flex-col gap-3">
          <div className="self-end border border-[#818cf8]/80 text-[#c7d2fe] rounded-full px-5 py-1 text-[11px] font-semibold mb-1">
            This Week's Report :
          </div>
          <div className="flex items-center gap-4">
            <div className="border border-[#818cf8]/80 text-white rounded-full px-5 py-1 text-[11px] font-medium whitespace-nowrap">
              1,240 Quizzes Played
            </div>
            <div className="border border-[#818cf8]/80 text-white rounded-full px-5 py-1 text-[11px] font-medium whitespace-nowrap">
              Top Category : NEET
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="border border-[#818cf8]/80 text-white rounded-full px-5 py-1 text-[11px] font-medium whitespace-nowrap">
              856 Active Learners
            </div>
            <div className="border border-[#818cf8]/80 text-white rounded-full px-5 py-1 text-[11px] font-medium whitespace-nowrap flex-grow text-center">
              Highest Score : 4,850
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table Section */}
      <div className="w-full mt-6">
        <h2 className="text-[17px] font-bold mb-6 tracking-wide text-white">
          This Week’s Leaderboard
        </h2>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-[1.5px] border-gray-400 text-gray-400 text-[14px] font-bold tracking-wider">
                <th className="py-4 pl-0 pr-4 w-20">RANK</th>
                <th className="py-4 px-4 w-1/4 text-center">USER</th>
                <th className="py-4 px-4 w-1/4 text-center">CATEGORY</th>
                <th className="py-4 px-4 w-32 text-center">QUIZZES</th>
                <th className="py-4 pl-4 pr-0 text-left w-32">POINTS</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b-[1.5px] border-gray-600/40 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-5 pl-0 pr-4 text-[15px] font-bold text-gray-300">
                    {item.rank}
                  </td>
                  <td className="py-5 px-4 text-[15px] font-medium text-gray-300 text-center">
                    {item.user}
                  </td>
                  <td className="py-5 px-4 text-[15px] font-bold text-gray-400 text-center uppercase tracking-wide">
                    {item.category}
                  </td>
                  <td className="py-5 px-4 text-[15px] font-medium text-gray-400 text-center">
                    {item.quizzes}
                  </td>
                  <td className="py-5 pl-4 pr-0 text-[15px] font-bold text-gray-300 text-left">
                    {item.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
