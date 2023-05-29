import React from "react";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";

const Loading = () => {
    return (
        <main className="flex animate-pulse flex-col space-y-4 overflow-hidden relative">
            <div className="w-full flex gap-x-2 justify-end">
                <button className="sm:px-4 text-gray-300 px-2 flex items-center justify-center gap-x-1 sm:gap-x-2 py-1 text-sm sm:text-lg bg-gray-300 rounded-md ">
                    {" "}
                    Refresh
                </button>
                <button className="sm:px-4  px-2 flex items-center justify-center gap-x-1 sm:gap-x-2 py-1 text-sm sm:text-lg  rounded-md bg-gray-300 text-gray-300">
                    {" "}
                    Create
                </button>
            </div>
            <div className="overflow-hidden relative border rounded-md shadow-lg">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr className="h-14 font-semibold text-lg bg-gray-200">
                            <th className="whitespace-nowrap px-4 py-3 w-24 text-text">
                                {" "}
                                <span className="p-2 w-24 h-6 bg-white rounded grid place-content-center"></span>
                            </th>
                            <th className="whitespace-nowrap px-4 py-3 w-24 text-text">
                                {" "}
                                <span className="p-2 w-24 h-6 bg-white rounded grid place-content-center"></span>
                            </th>
                            <th className="whitespace-nowrap px-4 py-3 w-24 text-text">
                                {" "}
                                <span className="p-2 w-24 h-6 bg-white rounded grid place-content-center"></span>
                            </th>
                            <th className="whitespace-nowrap px-4 py-3 w-24 text-text">
                                {" "}
                                <span className="p-2 w-24 h-6 bg-white rounded grid place-content-center"></span>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y text-center divide-gray-200">
                        <tr>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="p-2 w-24 h-6 bg-gray-200 rounded grid place-content-center"></span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="p-2 w-24 h-6 bg-gray-200 rounded grid place-content-center"></span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="p-2 w-24 h-6 bg-gray-200 rounded grid place-content-center"></span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="text-lg p-2 w-24 h-6 bg-gray-200 rounded grid place-content-center"></span>
                            </td>
                        </tr>
                        <tr>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="p-2 w-24 h-6 bg-gray-200 rounded grid place-content-center"></span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="p-2 w-24 h-6 bg-gray-200 rounded grid place-content-center"></span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="p-2 w-24 h-6 bg-gray-200 rounded grid place-content-center"></span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="text-lg p-2 w-24 h-6 bg-gray-200 rounded grid place-content-center"></span>
                            </td>
                        </tr>
                        <tr>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="p-2 w-24 h-6 bg-gray-200 rounded grid place-content-center"></span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="p-2 w-24 h-6 bg-gray-200 rounded grid place-content-center"></span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="p-2 w-24 h-6 bg-gray-200 rounded grid place-content-center"></span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="text-lg p-2 w-24 h-6 bg-gray-200 rounded grid place-content-center"></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-end text-xl py-4">
                <BsCaretLeftFill className="text-gray-200" />
                <p className="bg-gray-200 shadow-md shadow-gray-400 h-9 w-6 rounded px-1.5 py-1"></p>
                <BsCaretRightFill className="text-gray-200" />
            </div>{" "}
        </main>
    );
};

export default Loading;
