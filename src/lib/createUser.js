import User from "@/models/user";
import bcrypt from "bcrypt";


export const createUser = async (body, currentUserRole) => {
    const { firstName, lastName, email, password, mobileNo, role, status } = body;
    const createdBy = (currentUserRole === "admin" || currentUserRole === "superAdmin") ? "admin" : "self";
    const statusToSet = (currentUserRole === "student" || currentUserRole === "parent") ? "pending" : status;
    const hasedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        firstName,
        lastName,
        email,
        password: hasedPassword,
        mobileNo,
        role,
        status: statusToSet,
        createdBy
    });
    return user;
}