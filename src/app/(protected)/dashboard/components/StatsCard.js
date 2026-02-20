import React from 'react';
import { motion } from 'framer-motion';

const variants = {
    blue: {
        gradient: "from-blue-500/20 via-blue-400/10 to-blue-600/5",
        border: "border-blue-200/60 dark:border-blue-500/20",
        iconUser: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
        text: "text-zinc-700 dark:text-zinc-300",
        count: "text-zinc-900 dark:text-white",
        blob: "bg-blue-500"
    },
    emerald: {
        gradient: "from-emerald-500/20 via-emerald-400/10 to-emerald-600/5",
        border: "border-emerald-200/60 dark:border-emerald-500/20",
        iconUser: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
        text: "text-zinc-700 dark:text-zinc-300",
        count: "text-zinc-900 dark:text-white",
        blob: "bg-emerald-500"
    },
    violet: {
        gradient: "from-violet-500/20 via-violet-400/10 to-violet-600/5",
        border: "border-violet-200/60 dark:border-violet-500/20",
        iconUser: "bg-violet-500/20 text-violet-700 dark:text-violet-300",
        text: "text-zinc-700 dark:text-zinc-300",
        count: "text-zinc-900 dark:text-white",
        blob: "bg-violet-500"
    },
    rose: {
        gradient: "from-rose-500/20 via-rose-400/10 to-rose-600/5",
        border: "border-rose-200/60 dark:border-rose-500/20",
        iconUser: "bg-rose-500/20 text-rose-700 dark:text-rose-300",
        text: "text-zinc-700 dark:text-zinc-300",
        count: "text-zinc-900 dark:text-white",
        blob: "bg-rose-500"
    },
    amber: {
        gradient: "from-amber-500/20 via-amber-400/10 to-amber-600/5",
        border: "border-amber-200/60 dark:border-amber-500/20",
        iconUser: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
        text: "text-zinc-700 dark:text-zinc-300",
        count: "text-zinc-900 dark:text-white",
        blob: "bg-amber-500"
    },
    indigo: {
        gradient: "from-indigo-500/20 via-indigo-400/10 to-indigo-600/5",
        border: "border-indigo-200/60 dark:border-indigo-500/20",
        iconUser: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300",
        text: "text-zinc-700 dark:text-zinc-300",
        count: "text-zinc-900 dark:text-white",
        blob: "bg-indigo-500"
    }
};

const StatsCard = ({ title, count, icon: Icon, color = "blue", index }) => {
    const style = variants[color] || variants.blue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
            whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
            className={`relative p-3 rounded-2xl border ${style.border} bg-gradient-to-br ${style.gradient} backdrop-blur-sm overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300`}
        >
            {/* Continuously Breathing Decorative Blob */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={`absolute -top-12 -right-12 w-32 h-32 rounded-full ${style.blob} blur-3xl`}
            />

            {/* Shimmer Effect on Hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent z-0" />

            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className={`text-xs font-bold tracking-wide uppercase ${style.text}`}>{title}</p>
                    <h3 className={`text-xl font-extrabold mt-0.5 font-sans tracking-tight ${style.count}`}>
                        {count.toLocaleString()}
                    </h3>

                    <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold">
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex items-center gap-1 border border-emerald-500/20">
                            ↑ 12.5%
                        </span>
                        <span className="text-zinc-500 dark:text-zinc-400">vs last month</span>
                    </div>
                </div>

                <div className={`p-2.5 rounded-lg ${style.iconUser} shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ring-1 ring-inset ring-black/5 dark:ring-white/10`}>
                    <Icon className="w-5 h-5 stroke-[2.5]" />
                </div>
            </div>
        </motion.div>
    );
};

export default StatsCard;
