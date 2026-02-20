import { connectDB } from "@/lib/db";
import User from "@/models/user";
import crypto from "crypto";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return Response.json({ success: false, message: "Token and password are required" }, { status: 400 });
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return Response.json({ success: false, message: "Invalid or expired reset token" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        return Response.json({ success: true, message: "Password has been reset successfully" }, { status: 200 });
    } catch (error) {
        return Response.json({ success: false, message: error.message }, { status: 500 })
    }
}
