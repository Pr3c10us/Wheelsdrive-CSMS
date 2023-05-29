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
                <div className="flex items-center pb-2 justify-center w-40 relative">
                    <button
                        onClick={() => setSection("Users")}
                        className="text-lg font-medium flex-1 px-2"
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setSection("RFIDs")}
                        className="text-lg font-medium flex-1 px-2"
                    >
                        RFIDs
                    </button>
                    <div
                        className={`h-1 transition-all duration-200 w-20 bottom-0 left-0 bg-accent absolute ${
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
