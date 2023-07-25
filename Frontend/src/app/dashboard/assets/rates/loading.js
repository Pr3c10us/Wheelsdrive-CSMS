import React from "react";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";

const Loading = () => {
    return (
        <main className="relative flex animate-pulse flex-col space-y-4 overflow-hidden py-4">
            <div className="flex w-full justify-end gap-x-2">
                <button className="flex items-center justify-center gap-x-1 rounded-md bg-gray-300 px-5 py-1.5 text-sm text-gray-300 sm:gap-x-2 sm:px-8 sm:text-lg ">
                    {" "}
                    Refresh
                </button> 
                <button className="flex  items-center justify-center gap-x-1 rounded-md bg-gray-300 px-5 py-1.5 text-sm text-gray-300  sm:gap-x-2 sm:px-8 sm:text-lg">
                    {" "}
                    Create
                </button>
            </div>
            <div className="relative overflow-hidden rounded-md border shadow-lg">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr className="h-14 bg-gray-200 text-lg font-semibold">
                            <th className="w-24 whitespace-nowrap px-4 py-3 text-text">
                                {" "}
                                <span className="grid h-6 w-24 place-content-center rounded bg-white p-2"></span>
                            </th>
                            <th className="w-24 whitespace-nowrap px-4 py-3 text-text">
                                {" "}
                                <span className="grid h-6 w-24 place-content-center rounded bg-white p-2"></span>
                            </th>
                            <th className="w-24 whitespace-nowrap px-4 py-3 text-text">
                                {" "}
                                <span className="grid h-6 w-24 place-content-center rounded bg-white p-2"></span>
                            </th>
                            <th className="w-24 whitespace-nowrap px-4 py-3 text-text">
                                {" "}
                                <span className="grid h-6 w-24 place-content-center rounded bg-white p-2"></span>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 text-center">
                        <tr>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="grid h-6 w-24 place-content-center rounded bg-gray-200 p-2"></span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="grid h-6 w-24 place-content-center rounded bg-gray-200 p-2"></span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="grid h-6 w-24 place-content-center rounded bg-gray-200 p-2"></span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="grid h-6 w-24 place-content-center rounded bg-gray-200 p-2 text-lg"></span>
                            </td>
                        </tr>
                        <tr>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="grid h-6 w-24 place-content-center rounded bg-gray-200 p-2"></span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="grid h-6 w-24 place-content-center rounded bg-gray-200 p-2"></span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="grid h-6 w-24 place-content-center rounded bg-gray-200 p-2"></span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="grid h-6 w-24 place-content-center rounded bg-gray-200 p-2 text-lg"></span>
                            </td>
                        </tr>
                        <tr>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="grid h-6 w-24 place-content-center rounded bg-gray-200 p-2"></span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="grid h-6 w-24 place-content-center rounded bg-gray-200 p-2"></span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="grid h-6 w-24 place-content-center rounded bg-gray-200 p-2"></span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                <span className="grid h-6 w-24 place-content-center rounded bg-gray-200 p-2 text-lg"></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-end py-4 text-xl">
                <BsCaretLeftFill className="text-gray-200" />
                <p className="h-9 w-6 rounded bg-gray-200 px-1.5 py-1 shadow-md shadow-gray-400"></p>
                <BsCaretRightFill className="text-gray-200" />
            </div>{" "}
        </main>
    );
};

export default Loading;
