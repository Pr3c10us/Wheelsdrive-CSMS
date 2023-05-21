"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { createAdminInfo } from "@/redux/adminDetails";
import Link from "next/link";
import Image from "next/image";
import pages from "@/utils/pages";

const Layout = () => {
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const dispatch = useDispatch();

    const handleEffect = async (req, res) => {
        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}admin/details/`
            );
            const { admin } = response.data;

            // if (!admin.isVerified) {
            //     router.push("/verifyAccount");
            // }
            dispatch(createAdminInfo(admin));
            setLoading(false);
        } catch (error) {
            router.push("/login/admin");
        }
    };
    useEffect(() => {
        handleEffect();
    }, []);

    const adminInfo = useSelector((state) => state.adminDetails.adminInfo);
    console.log(adminInfo);

    if (loading) {
        return <div>loading . . .</div>;
    }
    return (
        <main>
            <nav>
                <Link href="/" className="flex">
                    <Image
                        className="w-36 sm:w-52"
                        src="/wheelsdrive.svg"
                        height={100}
                        width={100}
                        alt="logo-wheelsdrive"
                        priority
                    />
                </Link>
            </nav>
        </main>
    );
};

export default Layout;
