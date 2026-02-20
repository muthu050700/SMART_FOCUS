import { connectDB } from "@/lib/db";
import User from "@/models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { otp } = body;

        const authHeader = req.headers.get("Authorization");

        const tempToken = authHeader.split(" ")[1];

        console.log(tempToken);

        if (!tempToken) {
            return Response.json({ success: false, message: "Token is required" }, { status: 400 });
        }

        const decodedTempToken = jwt.verify(tempToken, process.env.JWT_SECRET);

        const { _id } = decodedTempToken;

        const user = await User.findById(_id);
        console.log(user);

        if (!user) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        if (!user.hashedOtp) {
            return Response.json({ success: false, message: "OTP is not valid" }, { status: 400 });
        }

        const isOtpValid = await bcrypt.compare(otp, user.hashedOtp);

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


        if (user.loginAttempts > 5) {
            user.blockedUntil = Date.now() + 15 * 60 * 1000;
            await user.save();
            return Response.json({ success: false, message: "Too many attempts. Please try again later." }, { status: 400 });
        }

        if (!isOtpValid) {
            user.loginAttempts++;
            await user.save();
            return Response.json({ success: false, message: "OTP is not valid" }, { status: 400 });
        }

        if (user.otpExpires < Date.now()) {
            return Response.json({ success: false, message: "OTP is expired" }, { status: 400 });
        }

        user.hashedOtp = null;
        user.otpExpires = null;
        user.loginAttempts = 0;
        user.blockedUntil = null;
        await user.save();

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        const response = NextResponse.json({ success: true, message: "login Successfully" }, { status: 200 })

        response.cookies.set("token", token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
        response.cookies.set("isAuth", true, { httpOnly: false, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
        return response;
    } catch (error) {
        console.log(error.name);

        if (error.name === "TokenExpiredError") {
            return Response.json({ success: false, message: "OTP is expired" }, { status: 400 });
        }

        return Response.json({ success: false, message: error.message }, { status: 500 });
    }
}