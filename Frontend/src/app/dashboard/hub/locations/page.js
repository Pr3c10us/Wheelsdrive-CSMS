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
    // }, [refresh]);

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
        <main className="flex flex-col space-y-4 overflow-hidden relative">
            <Alert
            // errorMessage={errorMessage}
            // errorMessageType={errorMessageType}
            // showErrorMessage={showErrorMessage}
            />
            <div className="w-full flex gap-x-2 justify-end">
                <button
                    onClick={handleRefresh}
                    className="sm:px-4 px-2 flex items-center justify-center gap-x-1 sm:gap-x-2 py-1 text-sm sm:text-lg border-2 text-primary border-primary rounded-md "
                >
                    {" "}
                    <MdRefresh className="text-xl" />
                    Refresh
                </button>
                <button
                    onClick={() => setOpenForm(true)}
                    className="sm:px-4 px-2 flex items-center justify-center gap-x-1 sm:gap-x-2 py-1 text-sm sm:text-lg bg-primary rounded-md text-white"
                >
                    {" "}
                    <MdAdd className="text-xl" />
                    Create
                </button>
            </div>
            
                    <div className="overflow-x-auto relative border-primary border rounded-md shadow-lg scrollbar-table">
                        <table className="min-w-full divide-y-2 divide-primary bg-white text-sm ">
                            <thead className="ltr:text-left rtl:text-right">
                                <tr className="bg-primary bg-opacity-25 font-semibold text-lg">
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        Name
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        Address
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        City{" "}
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        Display
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y text-center divide-gray-200">
                                {locations.map((location) => {
                                    return (
                                        <TableRow
                                            location={location}
                                            key={location._id}
                                        />
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <CreateFormModal
                        openForm={openForm}
                        setOpenForm={setOpenForm}
                    />
              
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
                <p className="border shadow-md shadow-gray-400 border-black rounded px-1.5 py-1">
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

export default Locations;
