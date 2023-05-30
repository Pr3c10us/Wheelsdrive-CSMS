"use client";
import React from "react";
import { useState } from "react";
import Users from "./sections/users/users";
import Rfids from "./sections/rfids/rfids";

const Page = () => {
    const [section, setSection] = useState("Users");
    return (
        <main>
            <nav className=" flex items-center justify-center">
                <div className="relative flex w-40 items-center justify-center pb-2">
                    <button
                        onClick={() => setSection("Users")}
                        className="flex-1 border-r px-2 text-lg font-medium"
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setSection("RFIDs")}
                        className="flex-1 px-2 text-lg font-medium"
                    >
                        RFIDs
                    </button>
                    <div
                        className={`absolute bottom-0 left-0 h-1 w-20 bg-accent transition-all duration-200 ${
                            section == "RFIDs" && "translate-x-20"
                        }`}
                    ></div>
                </div>
            </nav>
            {section == "Users" && <Users />}
            {section == "RFIDs" && <Rfids />}
        </main>
    );
};

export default Page;
