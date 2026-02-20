import { handleCors, handleCorsOptions } from '@/utils/cors';
export async function OPTIONS() {
    return handleCorsOptions();
}
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

const client = new OAuth2Client("386469063984-aj1ve2rdflvvv32e22fq3dnp5o3t92bl.apps.googleusercontent.com");


export async function POST(req) {
    try {
        await connectDB();

        const { token } = await req.json();

        // Use the access token to fetch user profile information from Google
        const response_google = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
        const payload = await response_google.json();

        if (!payload.email) {
            return handleCors(req, { message: "Failed to fetch user info from Google" }, 400);
        }

        const { email, name, sub } = payload;
        console.log(name, "name");

        // 🔹 Check user
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                firstName: "",
                lastName: "",
                password: "",
                mobileNo: "",
                role: "",
                email,
                googleId: sub,
                isProfileCompleted: false,
                authProvider: "google"
            });
        }

        // 🔹 Create app JWT
        const appToken = jwt.sign({ _id: user._id }, "SmartFocusTution@123", { expiresIn: "1d" });

        const response = NextResponse.json({ token: appToken, user });

        response.headers.set(
            "Cross-Origin-Opener-Policy",
            "same-origin-allow-popups"
        );

        return handleCors(req, { token: appToken, user }, 200);

    } catch (error) {
        return handleCors(req, { message: error.message }, 500);
    }
}
