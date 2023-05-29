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
import { useDispatch } from "react-redux";
import { HiInformationCircle } from "react-icons/hi2";

const CreateFormModal = ({ openForm, setOpenForm, handleRefresh }) => {
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            username: "",
            firstName: "",
            lastName: "",
            email: "",
            mobile: "",
        },
        onSubmit: (values, { setSubmitting }) => {
            const apiUser = values;
            axios.defaults.withCredentials = true;
            axios
                .post(`${process.env.NEXT_PUBLIC_API_URL}apiUser`, apiUser)
                .then((data) => {
                    setOpenForm(false);
                    handleRefresh();
                })
                .catch((error) => {
                    if (error.response) {
                        const errorMsg = error.response.data.msg;
                        dispatch(
                            changeErrorMessageType("Api user creation failed")
                        );
                        dispatch(changeErrorMessage(errorMsg));
                        dispatch(changeShowErrorMessage(true));
                    }
                    setSubmitting(false);
                });
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Please fill out ApiUser username"),
            firstName: Yup.string().required(
                "Please fill out ApiUser firstName"
            ),
            lastName: Yup.string().required("Please fill out ApiUser lastName"),
            email: Yup.string().required("Please fill out ApiUser email"),
            mobile: Yup.string().required("Please fill out ApiUser mobile"),
        }),
    });
    return (
        <>
            {openForm && (
                <div
                    className={`fixed z-50 inset-0 py-4 sm:py-0 sm:px-8 px-4 sm:overflow-visible overflow-auto grid`}
                >
                    <div
                        onClick={() => setOpenForm(false)}
                        className={`fixed z-50 top-0 left-0 right-0 bottom-0 backdrop-blur-sm bg-primary bg-opacity-20`}
                    ></div>

                    <form
                        onSubmit={formik.handleSubmit}
                        className={`grid place-self-center shadow-lg  w-full sm:max-w-4xl z-[60] rounded-xl p-10 gap-y-3 gap-x-8 transition-all duration-500 relative bg-white grid-cols-1 sm:grid-cols-2`}
                    >
                        <div className="flex sm:col-span-2 flex-col w-full gap-2">
                            <div className="flex w-full justify-between items-center">
                                <h2 className="font-semibold text-lg">
                                    Add Api User
                                </h2>
                                <FaTimes
                                    onClick={() => setOpenForm(false)}
                                    className="h-10 cursor-pointer"
                                />
                            </div>
                            <hr />
                        </div>
                        <div className="sm:col-span-2 sm:px-8 mb-4">
                            <div className="bg-primary text-xs sm:text-base items-center rounded-lg font-medium bg-opacity-40 border-2 border-primary flex gap-x-4 px-4 py-4">
                                <HiInformationCircle className="w-10 h-10" />
                                <p>
                                    This will create a Wheelsdrive API user
                                    object and not a driver app user. App users
                                    can only signup using the driver app.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col w-full h-full">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="username"
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 focus:border-primary focus:outline-primary ${
                                    formik.touched.username &&
                                    formik.errors.username
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.username}
                                onBlur={formik.handleBlur}
                            />
                            <p className="text-xs px-2 font-medium text-red-600 h-2 sm:h-4">
                                {formik.touched.username &&
                                formik.errors.username
                                    ? formik.errors.username
                                    : ""}
                            </p>
                        </div>
                        <div className="flex flex-col w-full h-full">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="firstName"
                            >
                                Firstname
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 focus:border-primary focus:outline-primary ${
                                    formik.touched.firstName &&
                                    formik.errors.firstName
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.firstName}
                                onBlur={formik.handleBlur}
                            />
                            <p className="text-xs px-2 font-medium text-red-600 h-2 sm:h-4">
                                {formik.touched.firstName &&
                                formik.errors.firstName
                                    ? formik.errors.firstName
                                    : ""}
                            </p>
                        </div>
                        <div className="flex flex-col w-full h-full">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="lastname"
                            >
                                LastName
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 focus:border-primary focus:outline-primary ${
                                    formik.touched.lastName &&
                                    formik.errors.lastName
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.lastName}
                                onBlur={formik.handleBlur}
                            />
                            <p className="text-xs px-2 font-medium text-red-600 h-2 sm:h-4">
                                {formik.touched.lastName &&
                                formik.errors.lastName
                                    ? formik.errors.lastName
                                    : ""}
                            </p>
                        </div>
                        <div className="flex  flex-col w-full h-full">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="email"
                            >
                                Email{" "}
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="text"
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 focus:border-primary focus:outline-primary ${
                                    formik.touched.email && formik.errors.email
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                onBlur={formik.handleBlur}
                            />
                            <p className="text-xs px-2 font-medium text-red-600 h-2 sm:h-4">
                                {formik.touched.email && formik.errors.email
                                    ? formik.errors.email
                                    : ""}
                            </p>
                        </div>
                        <div className="flex sm:col-span-2 flex-col w-full h-full">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="mobile"
                            >
                                Mobile{" "}
                            </label>
                            <input
                                id="mobile"
                                name="mobile"
                                type="text"
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 focus:border-primary focus:outline-primary ${
                                    formik.touched.mobile &&
                                    formik.errors.mobile
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.mobile}
                                onBlur={formik.handleBlur}
                            />
                            <p className="text-xs px-2 font-medium text-red-600 h-2 sm:h-4">
                                {formik.touched.mobile && formik.errors.mobile
                                    ? formik.errors.mobile
                                    : ""}
                            </p>
                        </div>

                        <button
                            disabled={formik.isSubmitting}
                            type="submit"
                            className={`sm:col-span-2 bg-primary mt-4 text-white py-2 rounded-md ${
                                formik.isSubmitting && "bg-opacity-40"
                            }`}
                        >
                            Create
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default CreateFormModal;
