import { handleCors, handleCorsOptions } from '@/utils/cors';
export async function OPTIONS() {
    return handleCorsOptions();
}
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
        return handleCors(req, { success: true, data: data }, 200);
    } catch (err) {
        return handleCors(req, { message: err.message }, 500);
    }
}