import { useState } from 'react';

function ReportBug() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        specificIssue: '',
        type: '',
        priority: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Bug report submitted:', formData);
    };

    const handleCancel = () => {
        setFormData({
            title: '',
            description: '',
            specificIssue: '',
            type: '',
            priority: '',
        });
    };

    return (
        <div className="max-w-[1200px] mx-auto text-white pb-12 pt-8">
            {/* Banner */}
            <div className="w-full bg-gradient-to-r from-[#4f46e5] via-[#1e1b4b] to-black rounded-xl py-12 px-10 mb-10 shadow-2xl">
                <h1 className="font-bold text-3xl md:text-4xl text-white mb-2 tracking-wide">
                    Reporting bugs : We are here to resolve them
                </h1>
                <p className="text-gray-300 text-sm font-light">
                    In case of any bugs in this platform , report them here and we will get back to you
                </p>
            </div>

            {/* Form Card */}
            <div className="flex justify-center">
                <form
                    onSubmit={handleSubmit}
                    className="border border-gray-500/60 rounded-2xl p-8 md:p-12 w-full max-w-[700px] bg-[#0b1220]/40"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {/* ---- Left Column ---- */}
                        <div className="flex flex-col gap-6">
                            {/* Title */}
                            <div>
                                <label className="inline-block border border-gray-400 rounded-md px-3 py-1 text-sm font-semibold mb-3 tracking-wide">
                                    Title :
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Wrong Correct Answer"
                                    className="w-full bg-[#475569]/80 text-white border-none rounded-lg h-11 px-4 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5b5bff] transition"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="inline-block border border-gray-400 rounded-md px-3 py-1 text-sm font-semibold mb-3 tracking-wide">
                                    Description :
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full bg-[#475569]/80 text-white border-none rounded-lg p-4 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5b5bff] resize-none transition"
                                ></textarea>
                            </div>
                        </div>

                        {/* ---- Right Column ---- */}
                        <div className="flex flex-col gap-6">
                            {/* Specific Issue (Optional) */}
                            <div>
                                <label className="inline-block border border-gray-400 rounded-md px-3 py-1 text-sm font-semibold mb-3 tracking-wide">
                                    Specific Issue (Optional) :
                                </label>
                                <select
                                    name="specificIssue"
                                    value={formData.specificIssue}
                                    onChange={handleChange}
                                    className="w-full bg-[#475569]/80 text-gray-200 border-none rounded-lg h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b5bff] transition appearance-none cursor-pointer"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3af' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 12px center',
                                    }}
                                >
                                    <option value="">--Select--</option>
                                    <option value="wrong-answer">Wrong Correct Answer</option>
                                    <option value="ui-issue">UI/Display Issue</option>
                                    <option value="loading">Page Not Loading</option>
                                    <option value="score">Score Not Updating</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Type */}
                            <div>
                                <label className="inline-block border border-gray-400 rounded-md px-3 py-1 text-sm font-semibold mb-3 tracking-wide">
                                    Type :
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full bg-[#475569]/80 text-gray-200 border-none rounded-lg h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b5bff] transition appearance-none cursor-pointer"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3af' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 12px center',
                                    }}
                                >
                                    <option value="">--Select--</option>
                                    <option value="bug">Bug</option>
                                    <option value="feature">Feature Request</option>
                                    <option value="improvement">Improvement</option>
                                    <option value="crash">Crash/Error</option>
                                </select>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="inline-block border border-gray-400 rounded-md px-3 py-1 text-sm font-semibold mb-3 tracking-wide">
                                    Priority :
                                </label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full bg-[#475569]/80 text-gray-200 border-none rounded-lg h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b5bff] transition appearance-none cursor-pointer"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3af' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 12px center',
                                    }}
                                >
                                    <option value="">--Select--</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-6 mt-10">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-[#475569]/70 hover:bg-[#475569] text-white font-semibold py-2.5 px-10 rounded-lg transition-colors text-sm tracking-wide border border-gray-500/50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-[#5b5bff] hover:bg-[#4f4fe5] text-white font-semibold py-2.5 px-10 rounded-lg transition-colors shadow-lg shadow-[#5b5bff]/20 text-sm tracking-wide"
                        >
                            Submit report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ReportBug;