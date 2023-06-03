"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRates } from "@/redux/adminDetails";
import { MdAdd, MdRefresh } from "react-icons/md";
import { HashLoader } from "react-spinners";
import TableRow from "./components/tableRow";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
import Loading from "./loading";
import Alert from "@/utils/alert";
import CreateFormModal from "./components/createFormModal";

const Rates = () => {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [page, setPage] = useState(1);

    const rates = useSelector((state) => state.adminDetails.rates);
    const dispatch = useDispatch();

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            axios.defaults.withCredentials = true;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}rate?page=${page}`
            );
            const { rates } = response.data;
            if (!rates || rates.length <= 0) {
                if (page <= 1) {
                    setPage(1);
                } else {
                    setPage(page - 1);
                }
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}rate?page=${page}`
                );
                const { rates } = response.data;
                dispatch(createRates(rates));
                return setRefreshing(false);
            }
            dispatch(createRates(rates));
            setRefreshing(false);
        } catch (error) {
            setRefreshing(false);
            console.log(error);
        }
    };

    const handleEffect = async () => {
        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}rate?page=${page}`
            );
            const { rates } = response.data;
            if (!rates || rates.length <= 0) {
                if (page <= 1) {
                    setPage(1);
                } else {
                    setPage(page - 1);
                }
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}rate?page=${page}`
                );
                const { rates } = response.data;
                dispatch(createRates(rates));
                return setLoading(false);
            }
            dispatch(createRates(rates));
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
        <main className="relative flex flex-col space-y-4">
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
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        Name
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        Description
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        Discount{" "}
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        Price
                                        <span className="text-xs text-white">
                                            {` `}(INR)
                                        </span>
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text"></th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 text-center">
                                {rates.map((rate) => {
                                    return (
                                        <TableRow
                                            rate={rate}
                                            key={rate._id}
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

export default Rates;
