"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRfids } from "@/redux/adminDetails";
import { MdAdd, MdRefresh } from "react-icons/md";
import { HashLoader } from "react-spinners";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
import Loading from "../../loading";
import Alert from "@/utils/alert";
import CreateFormModal from "./components/createFormModal";
import TableRow from "./components/tableRow";

const Rfids = () => {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [page, setPage] = useState(1);

    const rfids = useSelector((state) => state.adminDetails.rfids);
    const dispatch = useDispatch();

    const handleEffect = async () => {
        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}rfid?page=${page}`
            );
            const { rfid } = response.data;

            if (!rfid || rfid.length <= 0) {
                if (page <= 1) {
                    setPage(1);
                } else {
                    setPage(page - 1);
                }
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}rfid?page=${page}`
                );
                const { rfid } = response.data;
                dispatch(createRfids(rfid));
                return setLoading(false);
            }
            dispatch(createRfids(rfid));
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

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            axios.defaults.withCredentials = true;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}rfid?page=${page}`
            );
            const { rfid } = response.data;
            if (!rfid || rfid.length <= 0) {
                if (page <= 1) {
                    setPage(1);
                } else {
                    setPage(page - 1);
                }
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}rfid?page=${page}`
                );
                const { rfid } = response.data;
                dispatch(createRfids(rfid));
                return setRefreshing(false);
            }
            dispatch(createRfids(rfid));
            setRefreshing(false);
        } catch (error) {
            setRefreshing(false);
            console.log(error);
        }
    };

    if (loading || refreshing) {
        return <Loading />;
    }
    return (
        <main className="relative flex flex-col space-y-4">
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

            <div className="scrollbar-table relative overflow-x-auto rounded-md border border-primary shadow-lg">
                <table className="min-w-full divide-y-2 divide-primary bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr className="bg-primary bg-opacity-25 text-base font-semibold">
                            <th className="whitespace-nowrap px-4 py-3 text-text">
                                Name
                            </th>
                            <th className="whitespace-nowrap px-4 py-3 text-text">
                                RFID
                            </th>
                            <th className="whitespace-nowrap px-4 py-3 text-text">
                                Expires
                            </th>
                            <th className="whitespace-nowrap px-4 py-3 text-text">
                                Blocked{" "}
                            </th>
                            <th className="whitespace-nowrap px-4 py-3 text-text">
                                ParentRFID
                            </th>
                            <th className="whitespace-nowrap px-4 py-3 text-text">
                                ApiUser
                            </th>
                            <th className="whitespace-nowrap px-4 py-3 text-text"></th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 text-center">
                        {rfids.map((rfid) => {
                            return (
                                <TableRow
                                    rfid={rfid}
                                    key={rfid._id}
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

export default Rfids;
