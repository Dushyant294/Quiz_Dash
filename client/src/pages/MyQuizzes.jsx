import React, { useState } from "react";

function MyQuizzes() {
  const [role, setRole] = useState("user"); // "user" or "admin"

  const adminTableData = [
    {
      srNo: "1",
      quizTitle: "Botany",
      subject: "NEET",
      topic: "Ecology",
      microTopic: "Plant adaptation",
      date: "01/02/2026",
      status: "Published",
    },
    {
      srNo: "2",
      quizTitle: "Zoology",
      subject: "NEET",
      topic: "Biomolecules",
      microTopic: "Carbohydrates",
      date: "12/02/2026",
      status: "Not published",
    },
  ];

  const userTableData = [
    {
      srNo: "1",
      user1: "@Siddharth_V",
      user2: "@Anjali_Nair",
      subject: "NEET",
      points: "15,840",
    },
    {
      srNo: "2",
      user1: "@Siddharth_V",
      user2: "Solo",
      subject: "NEET",
      points: "15,760",
    },
    {
      srNo: "2",
      user1: "@Siddharth_V",
      user2: "Solo",
      subject: "NEET",
      points: "15,760",
    },
    {
      srNo: "2",
      user1: "@Siddharth_V",
      user2: "Solo",
      subject: "NEET",
      points: "15,760",
    },
  ];

  const isAdmin = role === "admin";

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto text-white">
      {/* Role Toggle for Testing */}
      <div className="flex justify-end mb-6">
        <div className="bg-white/5 p-1 rounded-xl flex items-center border border-white/10">
          <button
            onClick={() => setRole("user")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              !isAdmin
                ? "bg-[#4D48DC] text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            User View
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              isAdmin
                ? "bg-[#4D48DC] text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Admin View
          </button>
        </div>
      </div>

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#4D48DC] to-[#0A0F1C] rounded-2xl p-6 md:p-10 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative overflow-hidden">
        {/* Banner Content (left) */}
        <div className="z-10 relative">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Access your history of quizzes
          </h1>
          <p className="text-sm md:text-base text-white/70">
            See where you stand
          </p>
        </div>

        {/* Stats Pills (right) */}
        <div className="flex flex-col sm:flex-row gap-3 z-10 relative">
          {!isAdmin && (
            <div className="border border-[#5a55ff] bg-transparent rounded-full px-4 py-1.5 text-xs font-medium text-[#c0bdf7] shadow-[0_0_8px_rgba(90,85,255,0.4)]">
              Your Rank : #47
            </div>
          )}
          <div className="border border-white/50 bg-black/20 rounded-full px-4 py-1.5 text-xs font-medium">
            Top Category : NEET
          </div>
          <div className="border border-white/50 bg-black/20 rounded-full px-4 py-1.5 text-xs font-medium">
            Highest Score : 4,850
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div>
        <h2 className="text-xl font-bold mb-6">Your quiz history</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              {isAdmin ? (
                <tr className="border-b border-white/20 text-gray-400 text-sm md:text-base">
                  <th className="pb-4 font-semibold px-2">Sr no</th>
                  <th className="pb-4 font-semibold px-2">Quiz title</th>
                  <th className="pb-4 font-semibold px-2">Subject</th>
                  <th className="pb-4 font-semibold px-2">Topic</th>
                  <th className="pb-4 font-semibold px-2">Micro - Topic</th>
                  <th className="pb-4 font-semibold px-2">Date</th>
                  <th className="pb-4 font-semibold px-2">Status</th>
                </tr>
              ) : (
                <tr className="border-b border-white/20 text-gray-400 text-sm md:text-base">
                  <th className="pb-4 font-semibold px-2 normal-case">Sr no</th>
                  <th className="pb-4 font-semibold px-2 uppercase">USER 1</th>
                  <th className="pb-4 font-semibold px-2 uppercase">USER 2</th>
                  <th className="pb-4 font-semibold px-2 uppercase">SUBJECT</th>
                  <th className="pb-4 font-semibold px-2 uppercase">POINTS</th>
                </tr>
              )}
            </thead>
            <tbody>
              {isAdmin
                ? adminTableData.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-white/10 hover:bg-white/5 transition"
                    >
                      <td className="py-4 px-2 font-medium">{row.srNo}</td>
                      <td className="py-4 px-2">{row.quizTitle}</td>
                      <td className="py-4 px-2 text-gray-300 font-medium">
                        {row.subject}
                      </td>
                      <td className="py-4 px-2 text-gray-300 font-medium">
                        {row.topic}
                      </td>
                      <td className="py-4 px-2 text-gray-300 font-medium whitespace-break-spaces w-40 leading-snug">
                        {row.microTopic}
                      </td>
                      <td className="py-4 px-2">{row.date}</td>
                      <td className="py-4 px-2">
                        <span
                          className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium border ${
                            row.status === "Published"
                              ? "bg-green-500/10 border-green-500 text-green-500"
                              : "bg-red-500/10 border-red-500 text-red-500"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                : userTableData.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-white/10 hover:bg-white/5 transition"
                    >
                      <td className="py-4 px-2 font-medium">{row.srNo}</td>
                      <td className="py-4 px-2 text-gray-200">{row.user1}</td>
                      <td className="py-4 px-2 text-gray-200">{row.user2}</td>
                      <td className="py-4 px-2 text-gray-300 font-medium">
                        {row.subject}
                      </td>
                      <td className="py-4 px-2 text-gray-300 font-medium">
                        {row.points}
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

export default MyQuizzes;
