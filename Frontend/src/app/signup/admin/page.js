"use client";
// import Image from "next/image";
import React, { useEffect } from "react";
import {
    changeErrorMessage,
    changeErrorMessageType,
    changeShowErrorMessage,
} from "../../../redux/errorMessage";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { BsEvStation, BsEvStationFill } from "react-icons/bs";
import Alert from "@/utils/alert";
import axios from "axios";
import { useRouter } from "next/navigation";

const SignupPage = () => {
    // Create state for phone
    const [mobileNumber, setMobileNumber] = React.useState("");
    const [mobileError, setMobileError] = React.useState("");

    // get router
    const router = useRouter();

    // get errorMessageReducer Values
    const errorMessage = useSelector(
        (state) => state.errorMessage.errorMessage
    );
    const errorMessageType = useSelector(
        (state) => state.errorMessage.errorMessageType
    );
    const showErrorMessage = useSelector(
        (state) => state.errorMessage.showErrorMessage
    );

    //  get dispatch functions
    const dispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => {
            dispatch(changeShowErrorMessage(false));
            dispatch(changeErrorMessageType(""));
            dispatch(changeErrorMessage(""));
        }, 10000);
    }, [showErrorMessage]);

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            mobile: "",
            password: "",
            confirmPassword: "",
            country: "",
            company: "",
        },

        onSubmit: async (values) => {
            if (!mobileNumber) {
                setMobileError("Please fill mobile number");
            }
            try {
                const user = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    mobile: mobileNumber,
                    password: values.password,
                    country: values.country,
                    company: values.company,
                };

                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}admin/auth/signup`,
                    user
                );

                setTimeout(() => {
                    router.push(`/login`);
                }, 3000);
            } catch (error) {
                if (error.response) {
                    const errorMsg = error.response.data.msg;
                    if (errorMsg.includes("email")) {
                        dispatch(
                            changeErrorMessageType("Account creation failed")
                        );
                    }
                    dispatch(changeErrorMessage(errorMsg));
                    dispatch(changeShowErrorMessage(true));
                }
            }
        },

        validationSchema: Yup.object({
            firstName: Yup.string().required("Please fill out your FirstName"),
            lastName: Yup.string().required("Please fill out your LastName"),
            email: Yup.string()
                .email()
                .required("Please fill out your Email Address"),
            password: Yup.string()
                .matches(
                    /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1}).*$/,
                    "use 8+ chars, mix of letters, numbers & symbols"
                )
                .required("Please fill out your preferred password"),
            confirmPassword: Yup.string()
                .oneOf(
                    [
                        Yup.ref("password"),
                        "focus:border-primary focus:outline-primary",
                    ],
                    "Passwords do not match"
                )
                .required("Please Confirm Password"),
            country: Yup.string().required(
                "Please fill out your Country of operation"
            ),
            company: Yup.string().required(
                "Please fill out your company's name"
            ),
        }),
    });

    return (
        <main className="flex relative overflow-hidden h-full flex-row">
            <Alert
                errorMessage={errorMessage}
                errorMessageType={errorMessageType}
                showErrorMessage={showErrorMessage}
            />

            <section className="h-full lg:flex justify-center items-center relative flex-1 hidden w-full ">
                <div className="w-full blur-sm h-full bg-gradient-to-tr from-accent to-primary "></div>
                <div className="w-min p-10 font-semibold bg-opacity-10 text-white bg-white aspect-square flex flex-col gap-y-12 justify-center text-6xl absolute z-50 ">
                    <h2>
                        <BsEvStation className="inline" /> Charge Station
                        Management System
                    </h2>
                    <span className="text-base max-w-xs">
                        Monitor and control all your EV charger in just one
                        place
                    </span>
                </div>
            </section>
            <div className=" flex-1 overflow-auto grid pt-4 pb-10 sm:py-8 w-full space-y-8 sm:space-y-10 ">
                <div className="flex">
                    <Link href="/" className="sm:ml-8 inline-block ml-4">
                        <Image
                            className="inline-block w-32 sm:w-36"
                            src="/wheelsdrive.svg"
                            height={50}
                            width={50}
                            alt="logo-wheelsdrive"
                            priority
                        />
                    </Link>
                </div>
                <form
                    className="w-full flex flex-col max-w-xs sm:max-w-none sm:px-24 space-y-8 items-center justify-center place-self-center"
                    onSubmit={formik.handleSubmit}
                >
                    <section className="space-y-8 w-full">
                        <div className="space-y-2">
                            <h2 className="font-bold font-raleway text-2xl sm:text-3xl">
                                Let's get you started . . .{" "}
                            </h2>
                            <p className="sm:text-sm text-xs font-light">
                                Fill the form so you can create a wheelsdrive
                                account .
                            </p>
                        </div>
                    </section>
                    <section className="gap-x-4 gap-y-4 w-full flex flex-col sm:grid sm:grid-cols-2">
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
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 ${
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
                                htmlFor="lastName"
                            >
                                Lastname
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 ${
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
                        <div className="flex flex-col w-full h-full sm:col-span-2">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="email"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="text"
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 ${
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
                        <div className="flex flex-col w-full h-full sm:col-span-2">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="email"
                            >
                                Mobile Number
                            </label>
                            <PhoneInput
                                onlyCountries={["in"]}
                                inputProps={{
                                    id: "mobile",
                                    required: true,
                                    name: "mobile",
                                }}
                                type="text"
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 ${
                                    mobileError &&
                                    "border-red-500 focus:outline-red-500"
                                }`}
                                onChange={(phone) => setMobileNumber(phone)}
                                value={mobileNumber}
                                containerStyle={{
                                    width: "100%",
                                    paddingLeft: 0,
                                    paddingTop: "0.25rem",
                                    paddingBottom: "0.25rem",
                                    height: "100%",
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
                                    height: "100%",
                                }}
                            />
                            <p className="text-xs px-2 font-medium text-red-600 h-2 sm:h-4">
                                {mobileError ? mobileError : ""}
                            </p>
                        </div>
                        <div className="flex flex-col w-full h-full">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 ${
                                    formik.touched.password &&
                                    formik.errors.password
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                onBlur={formik.handleBlur}
                            />
                            <p className="text-xs px-2 font-medium text-red-600 h-2 sm:h-4">
                                {formik.touched.password &&
                                formik.errors.password
                                    ? formik.errors.password
                                    : ""}
                            </p>
                        </div>
                        <div className="flex flex-col w-full h-full">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="confirmPassword"
                            >
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 ${
                                    formik.touched.confirmPassword &&
                                    formik.errors.confirmPassword
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.confirmPassword}
                                onBlur={formik.handleBlur}
                            />
                            <p className="text-xs px-2 font-medium text-red-600 h-2 sm:h-4">
                                {formik.touched.confirmPassword &&
                                formik.errors.confirmPassword
                                    ? formik.errors.confirmPassword
                                    : ""}
                            </p>
                        </div>
                        <div className="flex flex-col w-full h-full">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="country"
                            >
                                Country
                            </label>
                            <input
                                id="country"
                                name="country"
                                type="text"
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 ${
                                    formik.touched.country &&
                                    formik.errors.country
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.country}
                                onBlur={formik.handleBlur}
                            />
                            <p className="text-xs px-2 font-medium text-red-600 h-2 sm:h-4">
                                {formik.touched.country && formik.errors.country
                                    ? formik.errors.country
                                    : ""}
                            </p>
                        </div>
                        <div className="flex flex-col w-full h-full">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="company"
                            >
                                Company's Name
                            </label>
                            <input
                                id="company"
                                name="company"
                                type="text"
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 ${
                                    formik.touched.company &&
                                    formik.errors.company
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.company}
                                onBlur={formik.handleBlur}
                            />
                            <p className="text-xs px-2 font-medium text-red-600 h-2 sm:h-4">
                                {formik.touched.company && formik.errors.company
                                    ? formik.errors.company
                                    : ""}
                            </p>
                        </div>
                    </section>

                    <section className="flex gap-y-4 w-full justify-center items-center flex-col ">
                        <button
                            disabled={formik.isSubmitting}
                            type="submit"
                            className={`py-3 w-full px-12 rounded-md bg-primary text-white ${
                                formik.isSubmitting && "bg-opacity-50"
                            }`}
                        >
                            Signup
                        </button>
                        <p className="">
                            <span>Have an account?</span>
                            <Link
                                href="/login/admin"
                                className="font-semibold underline ml-1 inline-block h-min text-base text-primary"
                            >
                                Login
                            </Link>
                        </p>
                    </section>
                </form>
                {/* <button
                    onClick={() => {
                        dispatch(changeShowErrorMessage(true));
                    }}
                >
                    Show
                </button> */}
            </div>
        </main>
    );
};

export default SignupPage;
