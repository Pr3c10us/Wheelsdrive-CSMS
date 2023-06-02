"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { createLogs } from "@/redux/adminDetails";
import { HashLoader } from "react-spinners";
import { MdRefresh } from "react-icons/md";
import TableRow from "./components/tableRow";
import Alert from "@/utils/alert";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
import Loading from "./loading";

const Logs = () => {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);

    const logs = useSelector((state) => state.adminDetails.logs);

    const dispatch = useDispatch();

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            axios.defaults.withCredentials = true;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}logs?page=${page}`
            );
            const { logs } = response.data;
            if (!logs || logs.length <= 0) {
                if (page <= 1) {
                    setPage(1);
                } else {
                    setPage(page - 1);
                }
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}logs?page=${page}`
                );
                const { logs } = response.data;
                dispatch(createLogs(logs));
                return setRefreshing(false);
            }
            dispatch(createLogs(logs));
            setRefreshing(false);
        } catch (error) {
            setRefreshing(false);
            console.log(error);
        }
    };
    // useEffect(() => {
    //     handleRefresh();
    // }, [refresh]);

    const handleEffect = async () => {
        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}logs?page=${page}`
            );
            const { logs } = response.data;
            if (!logs || logs.length <= 0) {
                if (page <= 1) {
                    setPage(1);
                } else {
                    setPage(page - 1);
                }
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}logs?page=${page}`
                );
                const { logs } = response.data;
                dispatch(createLogs(logs));
                return setLoading(false);
            }

            dispatch(createLogs(logs));
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        handleEffect();
    }, []);
    useEffect(() => {
        handleEffect();
    }, [page]);

    if (loading) {
        return <Loading />;
    }
    return (
        <main className="relative flex flex-col space-y-4 overflow-hidden">
            <Alert />
            <div className="flex w-full justify-end gap-x-2">
                <button
                    onClick={handleRefresh}
                    className="flex items-center justify-center gap-x-1 rounded-md border-2 border-primary px-2 py-1 text-sm text-primary sm:gap-x-2 sm:px-4 sm:text-lg "
                >
                    {" "}
                    <MdRefresh className="text-xl" />
                    Refresh
                </button>
            </div>
            {refreshing ? (
                <div className="grid w-full place-content-center py-20">
                    <HashLoader color="#191970" />
                </div>
            ) : (
                <>
                    <div className="scrollbar-table relative overflow-x-auto rounded-md border border-primary shadow-lg">
                        <table className="min-w-full divide-y-2 divide-primary bg-white text-sm ">
                            <thead className="ltr:text-left rtl:text-right">
                                <tr className="bg-primary bg-opacity-25 font-semibold">
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        TimeStamp
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        Origin
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        ChargeStation{" "}
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        Message{" "}
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        Error Message{" "}
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 text-center">
                                {logs.map((logs) => {
                                    return (
                                        <TableRow logs={logs} key={logs._id} />
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
            <div className="flex items-center justify-end py-4 text-xl">
                <BsCaretLeftFill
                    className="cursor-pointer text-primary"
                    onClick={() => {
                        if (page <= 1) {
                            return;
                        }
                        setPage(page - 1);
                    }}
                />
                <p className="rounded border border-black px-1.5 py-1 shadow-md shadow-gray-400">
                    {page}
                </p>
                <BsCaretRightFill
                    className="cursor-pointer text-primary"
                    onClick={() => {
                        setPage(page + 1);
                    }}
                />
            </div>
        </main>
    );
};

export default Logs;
