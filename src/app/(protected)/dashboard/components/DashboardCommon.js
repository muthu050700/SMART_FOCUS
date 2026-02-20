import { useState, useEffect } from 'react';
import { Plus, Users, GraduationCap, BookOpen, Baby, Calendar, Presentation, Clock, CalendarCheck, UserPlus, BookPlus, FileCheck, BarChart3, LayoutGrid } from 'lucide-react';
import CreateUserForm from './CreateUserForm';
import StatsCard from './StatsCard';
import CircularStatsCard from './CircularStatsCard';
import DonutChart from './DonutChart';
import { motion } from 'framer-motion';
import { fetchUserSummary } from '../api/dashBoardAPI';

const DashboardCommon = () => {
    const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState("");
    const [activeTab, setActiveTab] = useState("Monthly");

    useEffect(() => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDate(new Date().toLocaleDateString(undefined, options));
    }, []);


    // Map API value to icon and color
    const iconMap = {
        student: GraduationCap,
        teacher: Users,
        admin: Users,
        superAdmin: Users,
        parent: Baby,
        activeUser: Users,
        newUserRegisteration: UserPlus,
        pendingUser: UserPlus,
    };
    const colorMap = {
        student: "emerald",
        teacher: "blue",
        admin: "indigo",
        superAdmin: "violet",
        parent: "rose",
        activeUser: "amber",
        newUserRegisteration: "purple",
        pendingUser: "rose",
    };

    const [statsData, setStatsData] = useState([]);
    console.log(statsData, "statsData");

    useEffect(() => {
        debugger
        const getStats = async () => {
            debugger
            try {
                debugger
                const data = await fetchUserSummary();
                debugger
                if (Array.isArray(data)) {
                    setStatsData(
                        data.map((item) => ({
                            title: item.title,
                            percentage: item.percentage,
                            count: item.count,
                            icon: iconMap[item.value] || Users,
                            color: colorMap[item.value] || "blue",
                        }))
                    );
                }
            } catch (e) {
                // fallback or error handling
                setStatsData([]);
            }
        };
        getStats();
    }, []);

    const circularStats = [
        { title: "Fee Collection %", percentage: 45, color: "rose" },
        { title: "Pending Registration %", percentage: 72, color: "purple" },
        { title: "Branch Revenue %", percentage: 31, color: "amber" },
        { title: "Class Fill %", percentage: 56, color: "blue" }
    ];

    const quickActions = [
        { label: "Create User", icon: UserPlus, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10", onClick: () => setIsCreateUserOpen(true) },
        { label: "Add Subject", icon: BookPlus, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
        { label: "Create Class", icon: Presentation, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-500/10" },
        { label: "Set Schedule", icon: Calendar, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-500/10" },
        { label: "Lesson Plan", icon: FileCheck, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-500/10" },
        { label: "View Reports", icon: BarChart3, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
    ];

    return (
        <div className="w-full space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Dashboard Overview</h1>
                    <div className="flex items-center gap-2 mt-1 text-zinc-500 dark:text-zinc-400">
                        <Calendar className="w-4 h-4" />
                        <p className="text-sm font-medium">{currentDate}</p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsCreateUserOpen(true)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-violet-600/25 border border-white/10"
                >
                    <Plus className="w-5 h-5" />
                    Create User
                </motion.button>
            </div>

            {/* 3-Column Analytics & Stats Section */}
            <div className="lg:grid lg:grid-cols-12 lg:gap-6 space-y-8 lg:space-y-0 items-stretch">
                {/* Column 1: Circular Analytics (Left) */}
                <div className="lg:col-span-4 h-full flex flex-col">
                    <div className="bg-white dark:bg-[#1a163a] rounded-3xl p-4 shadow-xl dark:shadow-2xl border border-zinc-200 dark:border-[#2a265a] h-full flex flex-col transition-colors duration-300">
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Analytics</h2>
                            <div className="flex items-center space-x-3">
                                {["Daily", "Weekly", "Monthly"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`text-[10px] font-bold transition-all ${activeTab === tab ? "text-rose-500 dark:text-rose-400 font-extrabold" : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-3 gap-y-4 flex-1 content-center">
                            {circularStats.map((stat, index) => (
                                <CircularStatsCard key={index} index={index} {...stat} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Column 2: Stats Grid (Middle) */}
                <div className="lg:col-span-5 h-full flex flex-col">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                        {statsData.map((stat, index) => (
                            <StatsCard key={index} index={index} {...stat} />
                        ))}
                    </div>
                </div>

                {/* Column 3: Donut Chart (Right) */}
                <div className="lg:col-span-3 h-full flex flex-col">
                    <DonutChart />
                </div>
            </div>

            {/* Quick Actions Section */}
            <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-violet-500/10 rounded-lg">
                        <LayoutGrid className="w-5 h-5 text-violet-600" />
                    </div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Quick Actions</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {quickActions.map((action, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={action.onClick}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all ${action.bg} group`}
                        >
                            <div className={`p-2 rounded-lg bg-white dark:bg-zinc-900 shadow-sm group-hover:shadow-md transition-all mb-2 ${action.color}`}>
                                <action.icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                {action.label}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>

            <CreateUserForm
                isOpen={isCreateUserOpen}
                onClose={() => setIsCreateUserOpen(false)}
            />
        </div>
    );
};

export default DashboardCommon;



