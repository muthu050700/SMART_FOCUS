import React from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateUserForm = ({ isOpen, onClose }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('/api/users/admin/create-user', data);
            toast.success(response.data.message || 'User created successfully!');
            reset();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create user');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                                <div>
                                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Create New User</h2>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Add a new user to the system</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200" />
                                </button>
                            </div>

                            {/* Form */}
                            <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* First Name */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">First Name</label>
                                            <input
                                                {...register('firstName', { required: 'First name is required' })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent outline-none transition-all dark:text-white"
                                                placeholder="John"
                                            />
                                            {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
                                        </div>

                                        {/* Last Name */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Last Name</label>
                                            <input
                                                {...register('lastName', { required: 'Last name is required' })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent outline-none transition-all dark:text-white"
                                                placeholder="Doe"
                                            />
                                            {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName.message}</span>}
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
                                            <input
                                                type="email"
                                                {...register('email', {
                                                    required: 'Email is required',
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Invalid email address"
                                                    }
                                                })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent outline-none transition-all dark:text-white"
                                                placeholder="john@example.com"
                                            />
                                            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                                        </div>

                                        {/* Mobile Number */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Mobile Number</label>
                                            <input
                                                type="tel"
                                                {...register('mobileNo', {
                                                    required: 'Mobile number is required',
                                                    pattern: {
                                                        value: /^[0-9]{10}$/,
                                                        message: "Please enter a valid 10-digit mobile number"
                                                    }
                                                })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent outline-none transition-all dark:text-white"
                                                placeholder="9876543210"
                                            />
                                            {errors.mobileNo && <span className="text-red-500 text-xs">{errors.mobileNo.message}</span>}
                                        </div>

                                        {/* Role */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Role</label>
                                            <select
                                                {...register('role', { required: 'Role is required' })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent outline-none transition-all dark:text-white"
                                            >
                                                <option value="">Select Role</option>
                                                <option value="admin">Admin</option>
                                                <option value="teacher">Teacher</option>
                                                <option value="student">Student</option>
                                                <option value="parent">Parent</option>
                                            </select>
                                            {errors.role && <span className="text-red-500 text-xs">{errors.role.message}</span>}
                                        </div>

                                        {/* Status */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Status</label>
                                            <select
                                                {...register('status', { required: 'Status is required' })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent outline-none transition-all dark:text-white"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                            {errors.status && <span className="text-red-500 text-xs">{errors.status.message}</span>}
                                        </div>

                                        {/* Password */}
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
                                            <input
                                                type="password"
                                                {...register('password', {
                                                    required: 'Password is required',
                                                    minLength: {
                                                        value: 6,
                                                        message: "Password must be at least 6 characters"
                                                    }
                                                })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent outline-none transition-all dark:text-white"
                                                placeholder="••••••••"
                                            />
                                            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            disabled={isSubmitting}
                                            className="px-5 py-2.5 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:ring-violet-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                'Create User'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CreateUserForm;
