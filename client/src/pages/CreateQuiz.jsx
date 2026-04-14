import { useRef, useState } from 'react';
import { API_BASE, authUpload } from '../config/api';

function CreateQuiz() {
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({ subject: '', topic: '', micro_topic: '', question_count: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleUploadClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) setSelectedFile(e.target.files[0]);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateQuiz = async () => {
        if (!selectedFile) {
            setMessage('Please select a CSV file first');
            return;
        }

        setUploading(true);
        setMessage('');

        try {
            const fd = new FormData();
            fd.append('csvFile', selectedFile);
            fd.append('subject', formData.subject);
            fd.append('topic', formData.topic);
            fd.append('micro_topic', formData.micro_topic);

            const response = await authUpload(`${API_BASE}/quizzes/upload`, fd);
            const data = await response.json();

            if (data.success) {
                setMessage(`Quiz created! ${data.data.insertedCount} questions uploaded.`);
                setSelectedFile(null);
                setFormData({ subject: '', topic: '', micro_topic: '', question_count: '' });
            } else {
                setMessage(data.error || 'Upload failed');
            }
        } catch (err) {
            setMessage('Cannot connect to server. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-[1100px] mx-auto text-black dark:text-white pb-12 pt-6 px-4 md:px-0">

            {/* Banner */}
            <div className="w-full bg-gradient-to-r from-indigo-500/90 via-primary-darker to-brand-dark/50 dark:to-black rounded-2xl py-14 px-10 mb-12 shadow-2xl relative overflow-hidden">
                <h1 className="font-bold text-3xl md:text-[34px] text-white mb-4 tracking-wide relative z-10">
                    Share Your Knowledge: Create a Custom<br />Quiz and Challenge the Community
                </h1>
                <p className="text-[#a5b4fc] text-[15px] font-medium tracking-wide relative z-10">
                    Build specialized mock tests for any category in just a few minutes.
                </p>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
            </div>

            {message && (
                <div className={`text-center p-3 rounded-lg mb-6 text-sm font-semibold ${message.includes('created') || message.includes('uploaded') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {message}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 justify-between items-start">

                {/* Left Column: Upload Questions Form */}
                <div className="w-full lg:w-[45%]">
                    <h2 className="text-lg md:text-xl font-bold mb-6 text-gray-800 dark:text-white uppercase tracking-wider">
                        UPLOAD QUESTIONS
                    </h2>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                        <div className="flex flex-col">
                            <label className="text-gray-900 dark:text-white font-semibold mb-2 text-[15px]">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="bg-gray-300 dark:bg-[#475569] border-none rounded-lg h-12 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-900 dark:text-white font-semibold mb-2 text-[15px]">Micro-Topic</label>
                            <input
                                type="text"
                                name="micro_topic"
                                value={formData.micro_topic}
                                onChange={handleChange}
                                className="bg-gray-300 dark:bg-[#475569] border-none rounded-lg h-12 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-900 dark:text-white font-semibold mb-2 text-[15px]">Topic</label>
                            <input
                                type="text"
                                name="topic"
                                value={formData.topic}
                                onChange={handleChange}
                                className="bg-gray-300 dark:bg-[#475569] border-none rounded-lg h-12 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-900 dark:text-white font-semibold mb-2 text-[15px]">Question Count</label>
                            <input
                                type="text"
                                name="question_count"
                                value={formData.question_count}
                                onChange={handleChange}
                                className="bg-gray-300 dark:bg-[#475569] border-none rounded-lg h-12 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Upload Box and Buttons */}
                <div className="flex flex-col items-center w-full lg:w-[50%] mt-4 lg:mt-0">
                    {/* Download Button */}
                    <button className="bg-indigo-500 hover:bg-primary text-white font-semibold py-3 px-10 rounded-full shadow-lg shadow-indigo-500/20 transition-all mb-10 w-fit">
                        Download Sample Q File here
                    </button>

                    {/* Question Section */}
                    <h2 className="text-2xl font-bold mb-8 text-center text-gray-800 dark:text-white">
                        Add your questions below !
                    </h2>

                    {/* Upload Box */}
                    <div
                        onClick={handleUploadClick}
                        className="w-full h-[220px] bg-[#1e2333]/30 dark:bg-[#4b5563]/30 border-2 border-dashed border-gray-400 dark:border-gray-500 rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#4b5563]/50 transition-colors mb-8 shadow-sm group"
                    >
                        {selectedFile ? (
                            <p className="text-lg font-semibold text-green-400 text-center">
                                ✅ {selectedFile.name}<br />
                                <span className="text-sm text-gray-400">Click to change file</span>
                            </p>
                        ) : (
                            <p className="text-xl md:text-2xl font-semibold text-gray-600 dark:text-gray-200 text-center leading-relaxed">
                                Upload .csv file for<br />larger amount of questions
                            </p>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".csv"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Create Quiz Button */}
                    <button
                        onClick={handleCreateQuiz}
                        disabled={uploading}
                        className="w-full bg-[#64748b] hover:bg-[#475569] disabled:bg-[#64748b]/50 text-white font-semibold py-3.5 px-6 rounded-full shadow-md transition-all text-lg max-w-[450px]"
                    >
                        {uploading ? 'Uploading...' : 'Create Quiz Now'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateQuiz;
