import React from 'react';
import { motion } from 'framer-motion';

const DonutChart = () => {
    const data = [
        { name: 'iphone', value: 40, color: 'bg-[#55587d]' },
        { name: 'ipod', value: 17, color: 'bg-[#38bdf8]' },
        { name: 'iMac', value: 13, color: 'bg-[#f43f5e]' },
    ];

    const radius = 35;
    const circumference = 2 * Math.PI * radius;

    // Calculate cumulative percentages for segment offsets
    let currentOffset = 0;
    const segments = data.map(item => {
        const offset = (currentOffset / 100) * circumference;
        const length = (item.value / 100) * circumference;
        currentOffset += item.value;
        return { ...item, strokeDashoffset: -offset, strokeDasharray: `${length} ${circumference}` };
    });

    return (
        <div className="bg-white dark:bg-[#1a163a] rounded-3xl p-4 shadow-xl dark:shadow-2xl border border-zinc-100 dark:border-[#2a265a] transition-all duration-300 flex flex-col items-center h-full">
            <div className="w-full flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-zinc-800 dark:text-white">Top Product Sales</h3>
                <button className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                    View Details
                </button>
            </div>

            <div className="relative w-40 h-40 flex items-center justify-center flex-1">
                {/* SVG Chart */}
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        strokeWidth="12"
                        className="stroke-zinc-100 dark:stroke-zinc-800/30"
                    />
                    {segments.map((segment, i) => (
                        <motion.circle
                            key={i}
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            strokeWidth="12"
                            strokeDasharray={segment.strokeDasharray}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: segment.strokeDashoffset }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.2, ease: "easeOut" }}
                            strokeLinecap="round"
                            className={segment.name === 'iphone' ? 'stroke-[#55587d]' : segment.name === 'ipod' ? 'stroke-[#38bdf8]' : 'stroke-[#f43f5e]'}
                        />
                    ))}
                </svg>

                {/* Floating Labels - Positioned relative to segments */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute top-[30%] left-[5%] bg-white dark:bg-zinc-800 px-2 py-1 rounded-full shadow-lg border border-zinc-100 dark:border-zinc-700 flex items-center gap-1"
                >
                    <span className="text-[10px] font-bold text-zinc-800 dark:text-white">40%</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.7 }}
                    className="absolute top-[20%] right-[5%] bg-white dark:bg-zinc-800 px-2 py-1 rounded-full shadow-lg border border-zinc-100 dark:border-zinc-700 flex items-center gap-1"
                >
                    <span className="text-[10px] font-bold text-zinc-800 dark:text-white">17%</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.9 }}
                    className="absolute bottom-[20%] right-[15%] bg-white dark:bg-zinc-800 px-2 py-1 rounded-full shadow-lg border border-zinc-100 dark:border-zinc-700 flex items-center gap-1"
                >
                    <span className="text-[10px] font-bold text-zinc-800 dark:text-white">13%</span>
                </motion.div>
            </div>

            {/* Legend */}
            <div className="w-full grid grid-cols-3 gap-2 mt-8">
                {segments.map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                            {item.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DonutChart;
