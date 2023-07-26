"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { createLocation } from "@/redux/adminDetails";
import { HashLoader } from "react-spinners";
import { MdAdd, MdDelete, MdRefresh } from "react-icons/md";
import TableRow from "./components/tableRow";
import CreateFormModal from "./components/createFormModal";
import Alert from "@/utils/alert";
import { BsArrowLeft, BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
import Loading from "./loading";

const Locations = () => {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [page, setPage] = useState(1);

    const locations = useSelector((state) => state.adminDetails.locations);

    const dispatch = useDispatch();
    const router = useRouter();

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            axios.defaults.withCredentials = true;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}location/admin?page=${page}`
            );
            const { locations } = response.data;
            if (!locations || locations.length <= 0) {
                if (page <= 1) {
                    setPage(1);
                } else {
                    setPage(page - 1);
                }
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}location/admin?page=${page}`
                );
                const { locations } = response.data;
                dispatch(createLocation(locations));
                return setRefreshing(false);
            }
            dispatch(createLocation(locations));
            setRefreshing(false);
        } catch (error) {
            setRefreshing(false);
            console.log(error);
        }
    };
    // useEffect(() => {
    //     handleRefresh();
    // }, [refreshing]);

    const handleEffect = async () => {
        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}location/admin?page=${page}`
            );
            const { locations } = response.data;
            if (!locations || locations.length <= 0) {
                if (page <= 1) {
                    setPage(1);
                } else {
                    setPage(page - 1);
                }
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}location/admin?page=${page}`
                );
                const { locations } = response.data;
                dispatch(createLocation(locations));
                return setLoading(false);
            }

            dispatch(createLocation(locations));
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

    if (loading || refreshing) {
        return <Loading />;
    }
    return (
        <main className="relative flex flex-col space-y-4 overflow-hidden">
            <Alert
            // errorMessage={errorMessage}
            // errorMessageType={errorMessageType}
            // showErrorMessage={showErrorMessage}
            />
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

            <div className="scrollbar-table relative overflow-x-auto rounded-md border border-primary shadow-lg">
                <table className="min-w-full divide-y-2 divide-primary bg-white text-sm ">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr className="bg-primary bg-opacity-25 text-lg font-semibold">
                            <th className="whitespace-nowrap px-4 py-3 text-text">
                                Name
                            </th>
                            <th className="whitespace-nowrap px-4 py-3 text-text">
                                Address
                            </th>
                            {/* <th className="whitespace-nowrap px-4 py-3 text-text">
                                        City{" "}
                                    </th> */}
                            <th className="whitespace-nowrap px-4 py-3 text-text">
                                Display
                            </th>
                            <th className="whitespace-nowrap px-4 py-3 text-text">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 text-center">
                        {locations.map((location) => {
                            return (
                                <TableRow
                                    location={location}
                                    key={location._id}
                                    handleRefresh={handleRefresh}
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

export default Locations;
