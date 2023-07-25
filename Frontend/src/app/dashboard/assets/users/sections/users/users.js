"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createU, createUsers, createUserssers } from "@/redux/adminDetails";
import { MdAdd, MdRefresh } from "react-icons/md";
import { HashLoader } from "react-spinners";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
import Loading from "../../loading";
import Alert from "@/utils/alert";
import CreateFormModal from "./components/createFormModal";
import TableRow from "./components/tableRow";

const Users = () => {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [page, setPage] = useState(1);

    const users = useSelector((state) => state.adminDetails.users);
    const dispatch = useDispatch();

    const handleEffect = async () => {
        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}apiUser?page=${page}`
            );
            const { apiUser } = response.data;
            if (!apiUser || apiUser.length <= 0) {
                if (page <= 1) {
                    setPage(1);
                } else {
                    setPage(page - 1);
                }
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}apiUser?page=${page}`
                );
                const { apiUser } = response.data;
                dispatch(createUsers(apiUser));
                return setLoading(false);
            }
            dispatch(createUsers(apiUser));
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
                `${process.env.NEXT_PUBLIC_API_URL}apiUser?page=${page}`
            );
            const { apiUser } = response.data;
            if (!apiUser || apiUser.length <= 0) {
                if (page <= 1) {
                    setPage(1);
                } else {
                    setPage(page - 1);
                }
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}apiUser?page=${page}`
                );
                const { apiUser } = response.data;
                dispatch(createUsers(apiUser));
                return setRefreshing(false);
            }
            dispatch(createUsers(apiUser));
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
        <main className="flex flex-col space-y-4 relative">
            <Alert />
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
                        <table className="min-w-full divide-y-2 divide-primary bg-white text-sm">
                            <thead className="ltr:text-left rtl:text-right">
                                <tr className="bg-primary bg-opacity-25 font-semibold text-base">
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        Username
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        Firstname
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        LastName
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        Email{" "}
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text">
                                        Mobile
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-text"></th>
                                </tr>
                            </thead>

                            <tbody className="divide-y text-center divide-gray-200">
                                {users.map((user) => {
                                    return (
                                        <TableRow
                                            user={user}
                                            key={user._id}
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

export default Users;
