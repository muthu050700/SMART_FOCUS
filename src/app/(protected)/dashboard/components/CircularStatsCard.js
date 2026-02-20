import React from 'react';
import { motion } from 'framer-motion';

const CircularStatsCard = ({ title, percentage, color = "blue", index }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const variants = {
        blue: {
            stroke: "stroke-blue-500",
            bgCircle: "stroke-blue-500/10",
            text: "text-blue-500",
            gradient: "from-blue-600 to-blue-400"
        },
        purple: {
            stroke: "stroke-purple-500",
            bgCircle: "stroke-purple-500/10",
            text: "text-purple-500",
            gradient: "from-purple-600 to-purple-400"
        },
        rose: {
            stroke: "stroke-rose-500",
            bgCircle: "stroke-rose-500/10",
            text: "text-rose-500",
            gradient: "from-rose-600 to-rose-400"
        },
        amber: {
            stroke: "stroke-amber-500",
            bgCircle: "stroke-amber-500/10",
            text: "text-amber-500",
            gradient: "from-amber-600 to-amber-400"
        }
    };

    const style = variants[color] || variants.blue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col items-center justify-center space-y-3"
        >
            <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        strokeWidth="8"
                        className={`${style.bgCircle}`}
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, delay: index * 0.1 + 0.5, ease: "easeOut" }}
                        strokeLinecap="round"
                        className={`${style.stroke}`}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-zinc-900 dark:text-white">
                        {percentage}%
                    </span>
                </div>
            </div>
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-center">
                {title}
            </span>
        </motion.div>
    );
};

export default CircularStatsCard;
