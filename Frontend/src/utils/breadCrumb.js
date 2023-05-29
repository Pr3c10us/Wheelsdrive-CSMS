import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const BreadCrumb = () => {
    const pathname = usePathname();
    return (
        <nav
            aria-label="Breadcrumb"
            className="w-full lg:grid lg:place-content-center"
        >
            <ol
                role="list"
                className="flex items-center gap-1 text-sm text-gray-600"
            >
                <li>
                    <p className="block transition capitalize text-lg font-semibold hover:text-gray-700">
                        {" "}
                        {pathname.split("/")[2]}{" "}
                    </p>
                </li>

                <li className="rtl:rotate-180">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </li>

                <li>
                    <p className="block transition capitalize text-accent font-semibold">
                        {" "}
                        {pathname.split("/")[3]}{" "}
                    </p>
                </li>
            </ol>
        </nav>
    );
};

export default BreadCrumb;
