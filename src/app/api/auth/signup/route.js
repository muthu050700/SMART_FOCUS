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
        return Response.json({ message: "User Created Successfully" }, { status: 200 });
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 })
    }
}