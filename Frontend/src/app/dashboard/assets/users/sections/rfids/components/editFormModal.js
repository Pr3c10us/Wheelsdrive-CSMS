import React from "react";
import { useFormik } from "formik";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import * as Yup from "yup";
import {
    changeErrorMessage,
    changeErrorMessageType,
    changeShowErrorMessage,
} from "@/redux/errorMessage";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
import { useEffect } from "react";
import { BiSearch } from "react-icons/bi";
import { createUsers } from "@/redux/adminDetails";
import { PuffLoader } from "react-spinners";

const CreateFormModal = ({ openForm, setOpenForm, handleRefresh, rfid }) => {
    const [apiUserId, setApiUserId] = useState(rfid.apiUser._id);
    const [date, setDate] = useState(new Date(rfid.expires));
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState(rfid.apiUser.username);
    const [usernameSearch, setUsernameSearch] = useState("");
    const [showApiUser, setShowApiUser] = useState(false);
    const [apiUserIdError, setApiUserIdError] = useState("");
    const users = useSelector((state) => state.adminDetails.users);
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            name: rfid.name,
            rfid: rfid.rfid,
            day:
                `${date.getDate()}`.length === 1
                    ? `0${date.getDate()}`
                    : date.getDate(),
            month:
                (`${date.getMonth() + 1}`).length === 1
                    ? `0${date.getMonth() + 1}`
                    : date.getMonth() + 1,
            year: date.getFullYear(),
            parentRFID: rfid.parentRFID,
            blocked: rfid.blocked,
        },
        onSubmit: (values, { setSubmitting }) => {
            console.log(values);
            if (!apiUserId) {
                setApiUserIdError("Please select an ApiUser");
                return setSubmitting(false);
            }
            const rfidDetails = {
                name: values.name,
                rfid: values.rfid,
                expires: `${values.year}-${values.month}-${values.day}` || "",
                parentRFID: values.parentRFID,
                blocked: values.blocked,
                apiUserId,
            };

            axios.defaults.withCredentials = true;
            axios
                .put(
                    `${process.env.NEXT_PUBLIC_API_URL}rfid/${rfid._id}`,
                    rfidDetails
                )
                .then((data) => {
                    setOpenForm(false);
                    handleRefresh();
                })
                .catch((error) => {
                    if (error.response) {
                        const errorMsg = error.response.data.msg;
                        dispatch(
                            changeErrorMessageType("RFID creation failed")
                        );
                        dispatch(changeErrorMessage(errorMsg));
                        dispatch(changeShowErrorMessage(true));
                    }
                    setSubmitting(false);
                });
        },
        validationSchema: Yup.object({
            day: Yup.string(" ")
                .matches(/^\d+$/, " ")
                .matches(/^0[1-9]$|^1[0-9]$|^2[0-9]$|^3[0-1]$/, " "),
            month: Yup.string(" ")
                .matches(/^\d+$/, " ")
                .matches(/^0[1-9]$|^1[0-2]$/, " "),
            year: Yup.string(" ")
                .matches(/^\d+$/, " ")
                .matches(/^19[0-9][0-9]$|^20[0-9][0-9]$/, " "),
            name: Yup.string(),
            rfid: Yup.string(),
            parentRFID: Yup.string(),
        }),
    });
    const handleEffect = async () => {
        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}apiUser?limit=100&username=${usernameSearch}`
            );
            const { apiUser } = response.data;
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
    }, [usernameSearch]);

    return (
        <>
            {openForm && (
                <div
                    className={`fixed inset-0 z-50 grid overflow-auto px-4 py-4 text-left sm:overflow-visible sm:px-8 sm:py-0`}
                >
                    <div
                        onClick={() => setOpenForm(false)}
                        className={`fixed bottom-0 left-0 right-0 top-0 z-50 bg-primary bg-opacity-20 backdrop-blur-sm`}
                    ></div>

                    <form
                        onSubmit={formik.handleSubmit}
                        className={`relative z-[60] grid  w-full grid-cols-1 gap-x-8 gap-y-3 place-self-center rounded-xl bg-white p-10 shadow-lg transition-all duration-500 sm:max-w-2xl sm:grid-cols-2`}
                    >
                        <div className="mb-4 flex w-full flex-col gap-2 sm:col-span-2">
                            <div className="flex w-full items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    Create RFID
                                </h2>
                                <FaTimes
                                    onClick={() => setOpenForm(false)}
                                    className="h-10 cursor-pointer"
                                />
                            </div>
                            <hr />
                        </div>
                        <div className="flex h-full w-full flex-col">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="name"
                            >
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    formik.touched.name && formik.errors.name
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.name}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.name && formik.errors.name
                                    ? formik.errors.name
                                    : ""}
                            </p>
                        </div>
                        <div className="flex h-full w-full flex-col">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="rfid"
                            >
                                RFID
                            </label>
                            <input
                                id="rfid"
                                name="rfid"
                                type="text"
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    formik.touched.rfid && formik.errors.rfid
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.rfid}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.rfid && formik.errors.rfid
                                    ? formik.errors.rfid
                                    : ""}
                            </p>
                        </div>
                        <div className="h-full w-full sm:col-span-2 sm:mb-8">
                            <h2 className="mb-2 text-sm font-semibold">
                                Expires
                            </h2>
                            <div className="w-full grid-cols-3 sm:grid sm:gap-4">
                                <div className="group relative z-0 mb-4 w-full sm:mb-auto">
                                    <input
                                        maxLength="2"
                                        type="text"
                                        onChange={formik.handleChange}
                                        value={formik.values.day}
                                        onBlur={formik.handleBlur}
                                        name="day"
                                        className={`peer block h-10 w-full appearance-none rounded-md border-2 bg-transparent px-2 py-1  text-lg text-gray-900 transition duration-300 focus:border-2 focus:outline-none focus:ring-0   sm:max-w-[150px] ${
                                            formik.touched.day &&
                                            formik.errors.day
                                                ? "border-red-500 focus:border-red-600  "
                                                : "focus:border-primary "
                                        } `}
                                        placeholder=" "
                                        autoComplete="off"
                                    />
                                    <label
                                        htmlFor="day"
                                        className={`absolute left-2 top-2 z-10 origin-[0] -translate-y-[20px] scale-75 transform bg-white px-1  text-base duration-200 peer-placeholder-shown:left-2 peer-placeholder-shown:-z-10 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-2 peer-focus:z-10 peer-focus:-translate-y-[20px] peer-focus:scale-75 peer-focus:font-medium   ${
                                            formik.touched.day &&
                                            formik.errors.day
                                                ? "text-red-500 focus:text-red-600  "
                                                : "focus:text-black "
                                        } `}
                                    >
                                        Day{" "}
                                        <span
                                            className={`text-[12px]  ${
                                                formik.touched.day &&
                                                formik.errors.day
                                                    ? "text-red-500 focus:text-red-600  "
                                                    : "focus:text-gray-400 "
                                            } `}
                                        >
                                            [ DD ]
                                        </span>
                                    </label>
                                </div>

                                <div className="group relative z-0 mb-4 w-full sm:mb-auto">
                                    <input
                                        maxLength="2"
                                        type="text"
                                        onChange={formik.handleChange}
                                        value={formik.values.month}
                                        onBlur={formik.handleBlur}
                                        name="month"
                                        className={`peer block h-10 w-full appearance-none rounded-md border-2 bg-transparent px-2 py-1  text-lg text-gray-900 transition duration-300 focus:border-2 focus:outline-none focus:ring-0   sm:max-w-[150px] ${
                                            formik.touched.month &&
                                            formik.errors.month
                                                ? "border-red-500 focus:border-red-600  "
                                                : "focus:border-primary "
                                        } `}
                                        placeholder=" "
                                        autoComplete="off"
                                    />
                                    <label
                                        htmlFor="month"
                                        className={`absolute left-2 top-2 z-10 origin-[0] -translate-y-[20px] scale-75 transform bg-white px-1  text-base duration-200 peer-placeholder-shown:left-2 peer-placeholder-shown:-z-10 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-2 peer-focus:z-10 peer-focus:-translate-y-[20px] peer-focus:scale-75 peer-focus:font-medium   ${
                                            formik.touched.month &&
                                            formik.errors.month
                                                ? "text-red-500 focus:text-red-600  "
                                                : "focus:text-black "
                                        } `}
                                    >
                                        Month{" "}
                                        <span
                                            className={`text-[12px]  ${
                                                formik.touched.month &&
                                                formik.errors.month
                                                    ? "text-red-500 focus:text-red-600  "
                                                    : "focus:text-gray-400 "
                                            } `}
                                        >
                                            [ MM ]
                                        </span>
                                    </label>
                                </div>
                                <div className="group relative z-0 mb-4 w-full sm:mb-auto">
                                    <input
                                        maxLength="4"
                                        type="text"
                                        onChange={formik.handleChange}
                                        value={formik.values.year}
                                        onBlur={formik.handleBlur}
                                        name="year"
                                        className={`peer block h-10 w-full appearance-none rounded-md border-2 bg-transparent px-2 py-1  text-lg text-gray-900 transition duration-300 focus:border-2 focus:outline-none focus:ring-0   sm:max-w-[150px] ${
                                            formik.touched.year &&
                                            formik.errors.year
                                                ? "border-red-500 focus:border-red-600  "
                                                : "focus:border-primary "
                                        } `}
                                        placeholder=" "
                                        autoComplete="off"
                                    />
                                    <label
                                        htmlFor="year"
                                        className={`absolute left-2 top-2 z-10 origin-[0] -translate-y-[20px] scale-75 transform bg-white px-1  text-base duration-200 peer-placeholder-shown:left-2 peer-placeholder-shown:-z-10 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-2 peer-focus:z-10 peer-focus:-translate-y-[20px] peer-focus:scale-75 peer-focus:font-medium   ${
                                            formik.touched.year &&
                                            formik.errors.year
                                                ? "text-red-500 focus:text-red-600  "
                                                : "focus:text-black "
                                        } `}
                                    >
                                        Year{" "}
                                        <span
                                            className={`text-[12px]  ${
                                                formik.touched.year &&
                                                formik.errors.year
                                                    ? "text-red-500 focus:text-red-600  "
                                                    : "focus:text-gray-400 "
                                            } `}
                                        >
                                            [ YYYY ]
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <p className="ml-1 mt-1 text-sm text-red-500">
                                {(formik.touched.day && formik.errors.day) ||
                                (formik.touched.month && formik.errors.month) ||
                                (formik.touched.year && formik.errors.year)
                                    ? formik.errors.day ||
                                      formik.errors.month ||
                                      formik.errors.year
                                    : ""}
                            </p>
                        </div>
                        <div className="flex  h-full w-full flex-col">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="parentRFID"
                            >
                                Parent RFID{" "}
                            </label>
                            <input
                                id="parentRFID"
                                name="parentRFID"
                                type="text"
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    formik.touched.parentRFID &&
                                    formik.errors.parentRFID
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.parentRFID}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.parentRFID &&
                                formik.errors.parentRFID
                                    ? formik.errors.parentRFID
                                    : ""}
                            </p>
                        </div>
                        <div className="relative flex h-full w-full flex-col">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="mobile"
                            >
                                Api User{" "}
                            </label>
                            <div
                                onClick={() => setShowApiUser(!showApiUser)}
                                className={`flex min-h-[2.5rem] items-center  rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    username ? "justify-between" : "justify-end"
                                }`}
                            >
                                {username || " "}
                                <IoIosArrowDown />
                            </div>
                            <div
                                className={`scrollbar-table absolute left-1/2 top-full z-[70] grid max-h-52 w-64 -translate-x-1/2 gap-y-4 overflow-x-auto overflow-y-auto rounded-md bg-white transition-all duration-300  ${
                                    showApiUser
                                        ? "border-2 p-2 opacity-100 shadow-lg"
                                        : "h-0 opacity-0"
                                }`}
                            >
                                {loading ? (
                                    <div className="flex h-40 items-center justify-center">
                                        <PuffLoader color="#191970" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="relative w-full">
                                            <input
                                                id="username"
                                                name="username"
                                                type="text"
                                                placeholder="username . . ."
                                                className={`w-full rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 `}
                                                onChange={(e) => {
                                                    setUsernameSearch(
                                                        e.target.value
                                                    );
                                                }}
                                                value={usernameSearch}
                                            />
                                            <BiSearch className="text-slate absolute bottom-0 right-2 top-0 mb-auto mt-auto h-5 w-5 text-gray-400" />
                                        </div>
                                        <div className="h-full font-medium [&>div]:border-t">
                                            {users.map((user) => {
                                                return (
                                                    <div
                                                        key={user._id}
                                                        onClick={() => {
                                                            setApiUserId(
                                                                user._id
                                                            );
                                                            setUsername(
                                                                user.username
                                                            );
                                                            setApiUserIdError(
                                                                ""
                                                            );
                                                        }}
                                                        className={`cursor-pointer p-2 transition-all duration-200 hover:bg-accent hover:bg-opacity-10 ${
                                                            apiUserId ==
                                                            user._id
                                                                ? "bg-accent bg-opacity-10 "
                                                                : ""
                                                        }`}
                                                    >
                                                        {user.username}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {apiUserIdError}
                            </p>
                        </div>

                        <div className="flex h-full w-full gap-x-4 sm:col-span-2">
                            <label className="font-semibold" htmlFor="name">
                                Block RFID
                            </label>
                            <input
                                id="blocked"
                                name="blocked"
                                type="checkbox"
                                className={`w-6`}
                                onChange={formik.handleChange}
                                value={formik.values.blocked}
                                checked={formik.values.blocked}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        <button
                            disabled={formik.isSubmitting}
                            type="submit"
                            className={`mt-4 rounded-md bg-primary py-2 text-white sm:col-span-2 ${
                                formik.isSubmitting && "bg-opacity-40"
                            }`}
                        >
                            Edit
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default CreateFormModal;
