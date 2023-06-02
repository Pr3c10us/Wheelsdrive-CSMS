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
import CreateFormModal from "./components/createFormModal";
import Alert from "@/utils/alert";
import Loading from "./loading";

const ChargePoints = () => {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [openForm, setOpenForm] = useState(false);

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
        return <Loading />;
    }
    return (
        <main className="flex flex-col space-y-4">
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
                <button
                    onClick={() => setOpenForm(true)}
                    className="flex items-center justify-center gap-x-1 rounded-md bg-primary px-2 py-1 text-sm text-white sm:gap-x-2 sm:px-4 sm:text-lg"
                >
                    {" "}
                    <MdAdd className="text-xl" />
                    Create
                </button>
            </div>
            {refreshing ? (
                <div className="grid w-full place-content-center py-20">
                    <HashLoader color="#191970" />
                </div>
            ) : (
                <>
                    <div className="scrollbar-table relative overflow-x-auto rounded-md border border-primary shadow-lg">
                        <table className="min-w-full divide-y-2 divide-primary bg-white text-sm">
                            <thead className="ltr:text-left rtl:text-right">
                                <tr className="bg-primary bg-opacity-25 text-base font-semibold">
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

                            <tbody className="divide-y divide-gray-200 text-center">
                                {chargePoints.map((chargePoint) => {
                                    return (
                                        <TableRow
                                            chargePoint={chargePoint}
                                            handleRefresh={handleRefresh}
                                            key={chargePoint._id}
                                        />
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <CreateFormModal
                        openForm={openForm}
                        setOpenForm={setOpenForm}
                        handleRefresh={handleRefresh}
                    />
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
                <p className="rounded  border border-black px-1.5 py-1 shadow-md shadow-gray-400">
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

export default ChargePoints;
