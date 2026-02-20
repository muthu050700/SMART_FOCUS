import { handleCors, handleCorsOptions } from '@/utils/cors';
export async function OPTIONS() {
    return handleCorsOptions();
}
import { createUser } from "@/lib/createUser";
import { connectDB } from "@/lib/db";
import { validateAdmin, validateSignUp } from "@/utils/validator";

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const currentUserRole = await validateAdmin(req);

        await validateSignUp(body);

        const user = await createUser(body, currentUserRole);

        await user.save();

        return handleCors(req, { message: "Admin Created Successfully" }, 200);
    } catch (err) {
        return handleCors(req, { message: err.message }, 500);
    }
}