
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { validateLogin } from "@/utils/validator";
import { sendEmail } from "@/utils/sendEmail";
import { handleCors, handleCorsOptions } from '@/utils/cors';
export async function OPTIONS() {
    return handleCorsOptions();
}


const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { email, password } = body;

        await validateLogin(email, password);

        //Checking user in the DB
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        //password validation
        const hasedPassword = user.password;
        const isPasswordValid = await bcrypt.compare(password, hasedPassword);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        const role = user.role;

        if (role === "superAdmin" || role === "admin") {
            if (user.blockedUntil && user.blockedUntil <= Date.now()) {
                user.blockedUntil = null;
                user.loginAttempts = 0;
                await user.save();
            }

            if (user.blockedUntil && user.blockedUntil > Date.now()) {
                const remainingMs = user.blockedUntil - Date.now();
                const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));

                return Response.json(
                    {
                        success: false,
                        message: `Account is blocked. Try again in ${remainingMinutes} minute(s).`,
                        remainingMinutes,
                    },
                    { status: 400 }
                );
            }
            if (user.blockedUntil && user.blockedUntil > Date.now()) {
                const remainingMs = user.blockedUntil - Date.now();
                const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));

                return Response.json(
                    {
                        success: false,
                        message: `Account is blocked. Try again in ${remainingMinutes} minute(s).`,
                        remainingMinutes,
                    },
                    { status: 400 }
                );
            }
            const otp = Math.floor(100000 + Math.random() * 900000); // 6 digits

            const hashedOtp = await bcrypt.hash(otp.toString(), 10);

            const otpExpires = Date.now() + 5 * 60 * 1000;

            const tempToken = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: "5m" });

            user.hashedOtp = hashedOtp;
            user.otpExpires = otpExpires;

            await sendEmail({
                to: user.email,
                subject: "OTP for Admin login",
                html: `
                <p>Your OTP is: ${otp}</p>
                <p>This OTP is valid for 5 minutes.</p>
                `
            });

            await user.save();

            return Response.json({
                success: true,
                message: "OTP sent to your email",
                tempToken
            });
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "1d" });

        const response = NextResponse.json({
            success: true,
            message: "User LoggedIn successfully"
        });

        response.cookies.set("token", token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
        response.cookies.set("isAuth", true, { httpOnly: false, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
        return response;
    } catch (error) {
        return handleCors(req, { success: false, message: error.message }, 500);
    }
}