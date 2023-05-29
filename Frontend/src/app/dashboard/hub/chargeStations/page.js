"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { createChargePoints } from "@/redux/adminDetails";
import { HashLoader } from "react-spinners";
import { MdAdd, MdDelete, MdRefresh } from "react-icons/md";
import TableRow from "./components/tableRow";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";

const ChargePoints = () => {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);

    const chargePoints = useSelector(
        (state) => state.adminDetails.chargePoints
    );
    const dispatch = useDispatch();
    const router = useRouter();

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            axios.defaults.withCredentials = true;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}chargePoint?page=${page}`
            );
            const { chargePoints } = response.data;
            if (!chargePoints || chargePoints.length <= 0) {
                if (page <= 1) {
                    setPage(1);
                } else {
                    setPage(page - 1);
                }
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}chargePoint?page=${page}`
                );
                const { chargePoints } = response.data;
                dispatch(createChargePoints(chargePoints));
                return setRefreshing(false);
            }
            dispatch(createChargePoints(chargePoints));
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
                `${process.env.NEXT_PUBLIC_API_URL}chargePoint?page=${page}`
            );
            const { chargePoints } = response.data;
            if (!chargePoints || chargePoints.length <= 0) {
                if (page <= 1) {
                    setPage(1);
                } else {
                    setPage(page - 1);
                }
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}chargePoint?page=${page}`
                );
                const { chargePoints } = response.data;
                dispatch(createChargePoints(chargePoints));
                return setLoading(false);
            }
            dispatch(createChargePoints(chargePoints));
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
        return <div>loading . . .</div>;
    }
    return (
        <main className="flex flex-col space-y-4">
            <div className="w-full flex gap-x-2 justify-end">
                <button
                    onClick={handleRefresh}
                    className="sm:px-4 px-2 flex items-center justify-center gap-x-1 sm:gap-x-2 py-1 text-sm sm:text-lg border-2 text-primary border-primary rounded-md "
                >
                    {" "}
                    <MdRefresh className="text-xl" />
                    Refresh
                </button>
                <button className="sm:px-4 px-2 flex items-center justify-center gap-x-1 sm:gap-x-2 py-1 text-sm sm:text-lg bg-primary rounded-md text-white">
                    {" "}
                    <MdAdd className="text-xl" />
                    Create
                </button>
            </div>
            {refreshing ? (
                <div className="w-full py-20 grid place-content-center">
                    <HashLoader color="#191970" />
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto relative border-primary border rounded-md shadow-lg scrollbar-table">
                        <table className="min-w-full divide-y-2 divide-primary bg-white text-sm">
                            <thead className="ltr:text-left rtl:text-right">
                                <tr className="bg-primary bg-opacity-25 font-semibold text-base">
                                    <th className="whitespace-nowrap text-text"></th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        Name
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        Location
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        CS ID
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        Status
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        Connectors
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y text-center divide-gray-200">
                                {chargePoints.map((chargePoint) => {
                                    return (
                                        <TableRow
                                            chargePoint={chargePoint}
                                            key={chargePoint._id}
                                        />
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
            <div className="flex items-center justify-end text-xl py-4">
                <BsCaretLeftFill
                    className="text-primary cursor-pointer"
                    onClick={() => {
                        if (page <= 1) {
                            return;
                        }
                        setPage(page - 1);
                    }}
                />
                <p className="border  shadow-md shadow-gray-400 border-black rounded px-1.5 py-1">
                    {page}
                </p>
                <BsCaretRightFill
                    className="text-primary cursor-pointer"
                    onClick={() => {
                        setPage(page + 1);
                    }}
                />
            </div>
        </main>
    );
};

export default ChargePoints;
