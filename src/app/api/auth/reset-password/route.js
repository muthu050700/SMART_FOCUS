import { handleCors, handleCorsOptions } from '@/utils/cors';
export async function OPTIONS() {
    return handleCorsOptions();
}
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import crypto from "crypto";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return handleCors(req, { success: false, message: "Token and password are required" }, 400);
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return handleCors(req, { success: false, message: "Invalid or expired reset token" }, 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        return handleCors(req, { success: true, message: "Password has been reset successfully" }, 200);
    } catch (error) {
        return handleCors(req, { success: false, message: error.message }, 500);
    }
}
