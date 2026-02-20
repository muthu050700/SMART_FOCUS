import { handleCors, handleCorsOptions } from '@/utils/cors';
export async function OPTIONS() {
    return handleCorsOptions();
}
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { INITIAL_TOTAL_USER_SUMMARY_OBJ } from "@/utils/constant";
import { validateAdmin } from "@/utils/validator";


const calcUserCount = (acc, user, userBasedPercentage) => {

    // acc.forEach((item) => {
    //     if (item.value === user.newStatusValue) {
    //         item.count = item.count + 1;
    //         item.percentage = userBasedPercentage.find((item) => item?.role === user?.newStatusValue)?.percentage ?? 0;
    //     }
    // });

    const percentageMap = Object.fromEntries(
        userBasedPercentage.map((item) => [item.role, item.percentage])
    );

    const accMap = Object.fromEntries(
        acc.map((item) => [item.value, item])
    );

    const item = accMap[user.newStatusValue];

    if (item) {
        item.count += 1;
        item.percentage = percentageMap[user.newStatusValue] ?? 0;
    }

    return acc;
};

const getUserCount = (users) => {
    return users.reduce((acc, user) => {
        (acc[user.role] = (acc[user.role] || 0) + 1);
        return acc;
    }, {});
}

const getPercentage = (currentMonthUsers, lastMonthUsers) => {
    const lastMonthUserCount = getUserCount(lastMonthUsers);
    const currentMonthUserCount = getUserCount(currentMonthUsers);
    console.log(lastMonthUserCount, "lastMonthUserCount");
    console.log(currentMonthUserCount, "currentMonthUserCount");


    const roles = ["student", "teacher", "admin", "parent"];

    return roles.map((role) => {
        const last = lastMonthUserCount[role] || 0;
        const current = currentMonthUserCount[role] || 0;

        const percentage = last === 0 ? current > 0 ? 100 : 0 : ((current - last) / last) * 100;

        return { role, percentage };
    })
}

export async function GET(req) {
    try {
        await connectDB();
        const today = new Date();
        await validateAdmin(req);

        const initialAcc = INITIAL_TOTAL_USER_SUMMARY_OBJ.map((item) => ({ ...item, count: 0, percentage: 0 }));

        const users = await User.find();

        const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);

        const [lastMonthUsers, currentMonthUsers] = await Promise.all([
            User.find({
                createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
                status: "approved"
            }),
            User.find({
                createdAt: { $gte: currentMonth.toString(), $lte: today.toString() },
                status: "approved"
            })
        ]);

        const userBasedPercentage = getPercentage(currentMonthUsers, lastMonthUsers);

        const total = users.reduce((acc, user) => {

            const after7Days = new Date(user.createdAt);
            after7Days.setDate(after7Days.getDate() + 7);

            switch (user.status) {
                case "approved":
                    // acc[user.role] = (acc[user.role] || 0) + 1;
                    acc = calcUserCount(acc, { ...user._doc, newStatusValue: user.role }, userBasedPercentage);
                    break;

                case "pending":
                    if (today <= after7Days) {
                        // acc.newUserRegisteration++;
                        acc = calcUserCount(acc, { ...user._doc, newStatusValue: "newUserRegisteration" }, userBasedPercentage);
                    } else {
                        //acc.pendingUser++;
                        acc = calcUserCount(acc, { ...user._doc, newStatusValue: "pendingUser" }, userBasedPercentage);
                    }
                    break;

                case "active":
                    // acc.activeUser++;
                    acc = calcUserCount(acc, { ...user._doc, newStatusValue: "activeUser" }, userBasedPercentage);
                    break;
            }

            return acc;
        }, initialAcc);

        return handleCors(req, { success: true, data: { userCountTotalSummary: total } }, 200);
    } catch (err) {
        return handleCors(req, { message: err.message }, 500);
    }
}