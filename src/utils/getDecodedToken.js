import jwt from "jsonwebtoken";

export const getDecodedToken = (req) => {
    const token = req.cookies.get("token")?.value;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodedToken;

    return { _id };
}