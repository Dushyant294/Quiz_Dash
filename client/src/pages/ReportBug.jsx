function ReportBug() {
    return (
        <div className="max-w-[1200px] mx-auto text-black dark:text-white pb-12 pt-8">
            {/* Title Bar */}
            <div className="w-full bg-gradient-to-r from-[#4f46e5] via-[#1e1b4b] to-black rounded-xl py-12 px-10 mb-8 shadow-2xl">
                <h1 className="font-bold text-3xl md:text-4xl text-white mb-2 tracking-wide">Reporting bugs : We are here to resolve them</h1>
                <p className="text-gray-300 text-sm font-light">
                    In case of any bugs in this platform , report them here and we will get back to you
                </p>
            </div>

            <div className="mb-8 pl-1">
                <span className="border border-white rounded-lg px-4 py-1.5 font-semibold text-sm tracking-wide">
                    Report bugs below and submit
                </span>
            </div>

            {/* Form Box */}
            <div className="border border-gray-300 dark:border-gray-400 rounded-xl p-10 md:p-14 flex flex-col items-center">
                <form className="w-full max-w-[600px] space-y-6">

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="border border-white rounded-lg px-4 py-2 font-semibold text-sm w-36 text-center tracking-wide shrink-0">
                            Your Email :
                        </div>
                        <input
                            type="email"
                            className="w-full bg-gray-500 text-white border-none rounded-lg h-10 px-4 focus:outline-none focus:ring-2 focus:ring-white transition"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="border border-white rounded-lg px-4 py-2 font-semibold text-sm w-36 text-center tracking-wide shrink-0">
                            Subject :
                        </div>
                        <input
                            type="text"
                            className="w-full bg-gray-500 text-white border-none rounded-lg h-10 px-4 focus:outline-none focus:ring-2 focus:ring-white transition"
                        />
                    </div>

                    <div className="pt-2">
                        <div className="inline-block border-b-[1.5px] border-white pb-1 mb-4 text-sm font-semibold tracking-wide">
                            Enter your message :
                        </div>
                        <textarea
                            rows="7"
                            className="w-full bg-gray-500 text-white border-none rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-white resize-none transition"
                        ></textarea>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full border border-white bg-[#5b5bff] hover:bg-[#4f4fe5] text-white font-semibold py-2.5 rounded-lg transition-colors shadow-lg tracking-wide"
                        >
                            Submit and wait for us
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default ReportBug;