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

        return Response.json({ message: "Admin Created Successfully" }, { status: 200 });
    } catch (err) {
        return Response.json({ message: err.message }, { status: 500 });
    }
}