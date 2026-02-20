import { handleCors, handleCorsOptions } from '@/utils/cors';
export async function OPTIONS() {
    return handleCorsOptions();
}
import { connectDB } from "@/lib/db";
import { validateSignUp } from "@/utils/validator";
import { createUser } from "@/lib/createUser";

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        //validation for sign up
        await validateSignUp(body);
        const user = await createUser(body);
        console.log(user);

        await user.save();
        return handleCors(req, { message: "User Created Successfully" }, 200);
    } catch (error) {
        return handleCors(req, { message: error.message }, 500);
    }
}