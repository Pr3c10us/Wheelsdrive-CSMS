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
        <main className="flex flex-col space-y-4 relative">
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
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text"></th>
                                </tr>
                            </thead>

                            <tbody className="divide-y text-center divide-gray-200">
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

export default Rates;
