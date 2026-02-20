import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { validateAdmin } from "@/utils/validator";

export async function GET(req) {
    try {
        await connectDB();

        await validateAdmin(req);

        const newUserRequest = await User.find({ role: "student", status: "pending" });

        const data = newUserRequest.map((request) => {
            return ({
                _id: request._id,
                firstName: request.firstName,
                lastName: request.lastName,
                email: request.email,
                role: request.role,
                status: request.status,
                mobileNo: request.mobileNo
            })
        })
        return Response.json({ success: true, data: data }, { status: 200 });
    } catch (err) {
        return Response.json({ message: err.message }, { status: 500 });
    }
}