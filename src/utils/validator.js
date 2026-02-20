import { NextResponse } from "next/server";
import validator from "validator";
import User from "@/models/user";
import jwt from "jsonwebtoken";
import { getDecodedToken } from "./getDecodedToken";

export const validateSignUp = async (body) => {
    const allowedFields = ["firstName", "lastName", "email", "password", "mobileNo", "role", "status"];

    const isAllFieldsValid = Object.keys(body).every((field) => allowedFields.includes(field));
    if (!isAllFieldsValid) {
        throw new Error("Invalid Fields");
    }
    const isUserExits = await User.findOne({ email: body.email });

    if (isUserExits) {
        throw new Error("User Already Exits")
    }
    return true;
}

export const validateLogin = async (email, password) => {
    if (!validator.isEmail(email)) {
        throw new Error("Email is not valid");
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not valid")
    }
}

export const validateForgotPassword = async (email, user) => {
    if (!email) {
        return Response.json({ success: false, message: "Email is required" }, { status: 500 });
    }

    if (!user) {
        return Response.json({ success: false, message: "User not found" }, { status: 400 });
    }

    if (user.authProvider === "google") {
        return Response.json({ success: false, message: "Please login with Google Sign In." }, { status: 400 })
    }
}

export const validateAdmin = async (req) => {
    const allowedFields = ["admin", "superAdmin"];
    // const token = req.cookies.get("token")?.value;
    // const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = getDecodedToken(req);

    const user = await User.findById(_id);

    const role = user.role;

    if (!allowedFields.includes(role)) {
        throw new Error("Unauthorised");
    }

    return role;
}
