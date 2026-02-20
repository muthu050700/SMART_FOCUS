import User from "@/models/user";
import jwt from "jsonwebtoken";
import { getDecodedToken } from "./getDecodedToken";

export const getLoggedInUser = async (req) => {
    // const token = req.cookies.get("token")?.value;
    // const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // const { _id } = decodedToken;  
    const { _id } = getDecodedToken(req);

    const user = await User.findById(_id);

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}