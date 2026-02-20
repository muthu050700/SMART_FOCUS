import { handleCors, handleCorsOptions } from '@/utils/cors';

export async function OPTIONS() {
    return handleCorsOptions();
}
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import crypto from "crypto";
import { validateForgotPassword } from "@/utils/validator";
import { sendEmail } from "@/utils/sendEmail";

const LOCAL_URL = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_PRODUCTION_API_URL || '';

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { email } = body;
        const user = await User.findOne({ email });

        validateForgotPassword(email, user);

        const resetToken = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        user.save();

        const resetUrl = `${LOCAL_URL}/reset-password?token=${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: "Reset your password",
            html: `
        <p>You requested a password reset.</p>
        <p>This link is valid for 15 minutes.</p>
        <a href="${resetUrl}">Click here to reset your password</a>
      `,
        });

        return handleCors(req, {
            success: true,
            message: "If the email exists, a reset link has been sent",
        }, 200);


    } catch (error) {
        return handleCors(req, { success: false, message: error.message }, 500);
    }
}