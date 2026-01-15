import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

const quizzes = [1, 2, 3];
const categories = ["Space", "Sports", "Technology", "Trivia"];

function Home() {
  return (
    <div className="bg-white dark:bg-[#0b1220] text-black dark:text-white min-h-screen">
      <Sidebar />

      {/* Right side */}
      <div className="ml-64 pt-20">
        <Topbar />

        {/* Scrollable content */}
        <main className="px-12 py-8 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="max-w-[1400px]">
            {/* Hero */}
            <div className="bg-gray-100 dark:bg-[#1b2230] rounded-2xl p-14 mb-16">
              <h1 className="text-5xl font-bold mb-3">
                Your Quiz Adventure Starts Here:
              </h1>
              <h1 className="text-5xl font-bold mb-6">
                Play, Share, Earn!
              </h1>

              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mb-8">
                Build engaging quizzes, challenge others, and earn rewards
                for your knowledge.
              </p>

              <div className="flex gap-5">
                <button className="bg-black dark:bg-white text-white dark:text-black px-7 py-3 rounded-lg font-medium">
                  Create Quiz
                </button>
                <button className="bg-[#5b5bff] px-7 py-3 rounded-lg font-medium">
                  Join Contest
                </button>
              </div>
            </div>

            {/* Latest Quizzes */}
            <h2 className="text-2xl font-semibold mb-6">Latest Quizzes</h2>

            <div className="grid grid-cols-3 gap-8 mb-14">
              {quizzes.map((item) => (
                <div key={item} className="bg-gray-100 dark:bg-[#1b2230] rounded-xl overflow-hidden">
                  <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>

                  <div className="p-5">
                    <span className="text-xs bg-yellow-500 text-black px-3 py-1 rounded-full">
                      Medium
                    </span>

                    <h3 className="text-lg font-semibold mt-3">
                      Sample Quiz Title
                    </h3>

                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Category</span>
                      <button className="bg-[#5b5bff] px-4 py-2 rounded">
                        Play Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Categories */}
            <h2 className="text-2xl font-semibold mb-6">Quiz Categories</h2>

            <div className="grid grid-cols-4 gap-8">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className="bg-gray-100 dark:bg-[#1b2230] rounded-xl h-44 flex items-center justify-center text-xl font-semibold"
                >
                  {cat}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
