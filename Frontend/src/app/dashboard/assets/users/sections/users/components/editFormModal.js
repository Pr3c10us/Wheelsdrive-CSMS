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
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";


const CreateFormModal = ({ openForm, setOpenForm, handleRefresh, apiUser }) => {
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            username: apiUser.username,
            firstName: apiUser.firstName,
            lastName: apiUser.lastName,
            email: apiUser.email,
            mobile: apiUser.mobile,
        },
        onSubmit: (values, { setSubmitting }) => {
            const apiUserDetails = values;
            axios.defaults.withCredentials = true;
            axios
                .put(
                    `${process.env.NEXT_PUBLIC_API_URL}apiUser/${apiUser._id}`,
                    apiUserDetails
                )
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
                    className={`fixed inset-0 z-50 grid overflow-auto px-4 py-4 text-left sm:overflow-visible sm:px-8 sm:py-0`}
                >
                    <div
                        onClick={() => setOpenForm(false)}
                        className={`fixed bottom-0 left-0 right-0 top-0 z-50 bg-primary bg-opacity-20 backdrop-blur-sm`}
                    ></div>

                    <form
                        onSubmit={formik.handleSubmit}
                        className={`relative z-[60] grid  w-full grid-cols-1 gap-x-8 gap-y-2 place-self-center rounded-xl bg-white p-10 shadow-lg transition-all duration-500 sm:max-w-4xl sm:grid-cols-2`}
                    >
                        <div className="mb-4 flex w-full flex-col gap-2 sm:col-span-2">
                            <div className="flex w-full items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    Edit ApiUser
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
                                htmlFor="username"
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    formik.touched.username &&
                                    formik.errors.username
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.username}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.username &&
                                formik.errors.username
                                    ? formik.errors.username
                                    : ""}
                            </p>
                        </div>
                        <div className="flex h-full w-full flex-col">
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
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    formik.touched.firstName &&
                                    formik.errors.firstName
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.firstName}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.firstName &&
                                formik.errors.firstName
                                    ? formik.errors.firstName
                                    : ""}
                            </p>
                        </div>
                        <div className="flex h-full w-full flex-col">
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
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    formik.touched.lastName &&
                                    formik.errors.lastName
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.lastName}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.lastName &&
                                formik.errors.lastName
                                    ? formik.errors.lastName
                                    : ""}
                            </p>
                        </div>
                        <div className="flex  h-full w-full flex-col">
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
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    formik.touched.email && formik.errors.email
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.email && formik.errors.email
                                    ? formik.errors.email
                                    : ""}
                            </p>
                        </div>
                        {/* <div className="flex h-full w-full flex-col sm:col-span-2">
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
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    formik.touched.mobile &&
                                    formik.errors.mobile
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.mobile}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.mobile && formik.errors.mobile
                                    ? formik.errors.mobile
                                    : ""}
                            </p>
                        </div> */}
                        <div className="flex h-full w-full flex-col sm:col-span-2">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="email"
                            >
                                Mobile Number
                            </label>
                            <PhoneInput
                                onlyCountries={["in"]}
                                country={"in"}
                                inputProps={{
                                    id: "mobile",
                                    required: true,
                                    name: "mobile",
                                }}
                                type="text"
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:ring-0 ${
                                    formik.touched.mobile &&
                                    formik.errors.mobile
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={(phone) =>
                                    formik.setFieldValue("mobile", phone)
                                }
                                value={formik.values.mobile}
                                containerStyle={{
                                    width: "100%",
                                    paddingLeft: 0,
                                    paddingTop: "0.25rem",
                                    paddingBottom: "0.25rem",
                                    // height: "100%",
                                }}
                                buttonStyle={{
                                    background: "none",
                                    border: "none",
                                    borderRight: "solid 1px",
                                    borderColor: "gray",
                                }}
                                inputStyle={{
                                    width: "100%",
                                    border: "none",
                                    fontSize: "1.125rem",
                                    lineHeight: "1.75rem",
                                    // height: "100%",
                                }}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.mobile && formik.errors.mobile
                                    ? formik.errors.mobile
                                    : ""}
                            </p>
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
