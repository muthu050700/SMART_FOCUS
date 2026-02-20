import axios from "axios";
import toast from "react-hot-toast"

export const fetchUserSummary = async () => {
    try {
        const res = await axios.get("http://localhost:4000/api/users/admin/dashboard/summary");
        if (res.data.success) {
            return res.data.data.userCountTotalSummary;
        }
    } catch (err) {
        toast.error(err.message || "Failed to fetch user summary");
    }
}