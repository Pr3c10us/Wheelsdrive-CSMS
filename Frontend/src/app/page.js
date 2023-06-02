import Link from "next/link";
import React from "react";

const Page = () => {
    return (
        <div className="grid h-full w-full place-content-center ">
            <div className="flex gap-x-8 items-center justify-center">
                <Link href="/login/admin" className="border-accent border-2 px-8 rounded-md text-accent py-3">
                    Login
                </Link>
                <Link href="/signup/admin" className="bg-accent px-8 rounded-md py-3">
                    Signup
                </Link>
            </div>
        </div>
    );
};

export default Page;
