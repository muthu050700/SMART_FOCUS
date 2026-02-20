"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const isAuth = Cookies.get("isAuth");

        if (isAuth) {
            router.replace("/dashboard");
        } else {
            router.replace("/signin");
        }
    }, []);

    return null;
}
