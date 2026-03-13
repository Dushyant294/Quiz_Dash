import React from 'react';
import { Link } from 'react-router-dom';

const QuizCard = ({
    title,
    category,
    image,
    difficulty,
    buttonText = "Play Now",
    buttonLink = "/play",
    stars,
    questionsCount,
    onPlay
}) => {
    return (
        <div className="bg-[#1a1d24] rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors group flex flex-col h-full shadow-lg">

            {/* Top Image Section */}
            <div className="h-40 w-full overflow-hidden shrink-0 relative">
                <img
                    src={image || `https://placehold.co/400x200/4F46E5/FFFFFF?text=${encodeURIComponent(category || 'Quiz')}`}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Optional Difficulty Badge overlapping image */}
                {difficulty && (
                    <div className="absolute top-3 left-3">
                        <span className="text-[10px] bg-[#FACC15] text-black px-2 py-0.5 rounded text-xs font-bold uppercase shadow-sm">
                            {difficulty}
                        </span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow">

                <h3 className="text-lg font-bold mt-1 text-white line-clamp-2">
                    {title}
                </h3>

                {category && (
                    <div className="text-gray-400 text-sm mt-1">{category}</div>
                )}

                {/* Optional Stars/Questions stats (Used mostly in Explore page) */}
                {(stars || questionsCount) && (
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                        {stars && (
                            <div className="flex items-center gap-1">
                                <div className="flex text-[#fbbf24] text-[10px] drop-shadow-md tracking-wider">
                                    {/* Simplified star rendering for dummy data, can be expanded */}
                                    ★★★★<span className="text-gray-500">★</span>
                                </div>
                            </div>
                        )}
                        {questionsCount && (
                            <span className="font-medium bg-white/5 px-2 py-0.5 rounded-full">{questionsCount} Qs</span>
                        )}
                    </div>
                )}

                {/* Action Button */}
                <div className="flex justify-end items-center mt-auto pt-6">
                    {buttonLink ? (
                        <Link
                            to={buttonLink}
                            onClick={onPlay}
                            className="bg-[#5B4DFF] hover:bg-[#4338CA] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-center shadow-md shadow-[#5B4DFF]/20"
                        >
                            {buttonText}
                        </Link>
                    ) : (
                        <button
                            onClick={onPlay}
                            className="bg-[#5B4DFF] hover:bg-[#4338CA] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-[#5B4DFF]/20"
                        >
                            {buttonText}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default QuizCard;
