"use client";
// import Image from "next/image";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Image from "next/image";
import { MdOutlineElectricalServices } from "react-icons/md";
import { useRouter } from "next/navigation";
import axios from "axios";
import Alert from "@/utils/alert";
import { useSelector, useDispatch } from "react-redux";
import {
    changeErrorMessage,
    changeErrorMessageType,
    changeShowErrorMessage,
} from "@/redux/errorMessage";


const LoginPage = () => {
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
            email: "",
            password: "",
        },

        onSubmit: async (values) => {
            try {
                axios.defaults.withCredentials = true;
                await axios(
                    `${process.env.NEXT_PUBLIC_API_URL}admin/auth/login`,
                    {
                        method: "POST",
                        data: values,
                        withCredentials: true,
                    }
                );
                router.push("/dashboard/hub/home");
            } catch (error) {
                if (error.response) {
                    const errorMsg = error.response.data.msg;
                    dispatch(changeErrorMessageType("Login failed"));
                    dispatch(changeErrorMessage(errorMsg));
                    dispatch(changeShowErrorMessage(true));
                }
            }
        },

        validationSchema: Yup.object({
            email: Yup.string()
                .email()
                .required("Please fill out your Email Address"),
            password: Yup.string().required(
                "Please fill out your preferred password"
            ),
        }),
    });

    return (
        <main className="flex relative overflow-hidden h-full flex-row">
            <Alert
                errorMessage={errorMessage}
                errorMessageType={errorMessageType}
                showErrorMessage={showErrorMessage}
            />{" "}
            <div className=" flex-1 overflow-auto grid pt-4 pb-10 sm:py-8 w-full space-y-8 sm:space-y-10 ">
                <form
                    className="w-full flex flex-col max-w-sm sm:max-w-none sm:px-44 space-y-8 items-center justify-center place-self-center"
                    onSubmit={formik.handleSubmit}
                >
                    <section className="space-y-8 flex items-center justify-center flex-col w-full">
                        <div className="flex">
                            <Link href="/" className="flex">
                                <Image
                                    className="w-36 sm:w-52"
                                    src="/wheelsdrive.svg"
                                    height={100}
                                    width={100}
                                    alt="logo-wheelsdrive"
                                    priority
                                />
                            </Link>
                        </div>
                        <div className="space-y-2">
                            <h2 className="font-semibold font-raleway text-3xl sm:text-4xl">
                                Welcome Back{" "}
                            </h2>
                        </div>
                    </section>
                    <section className="gap-x-4 gap-y-2 w-full flex flex-col">
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
                                className={`border-2 text-lg px-2  transition-all duration-200 focus:ring-0 rounded-md py-1 ${
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
                    </section>

                    <section className="flex gap-y-4 w-full justify-center items-center flex-col ">
                        <button
                            disabled={formik.isSubmitting}
                            type="submit"
                            className="py-3 w-full px-12 rounded-md bg-primary text-white"
                        >
                            Login
                        </button>
                        <p className="">
                            <span>Don't have an account?</span>
                            <Link
                                href="/signup/admin"
                                className="font-semibold underline ml-1 inline-block h-min text-base text-primary"
                            >
                                Signup
                            </Link>
                        </p>
                    </section>
                </form>
            </div>
            <section className="h-full lg:flex justify-center items-center relative flex-1 hidden w-full ">
                <div className="w-full blur-sm h-full bg-gradient-to-tr to-accent from-primary "></div>
                <div className="w-min p-10 font-semibold bg-opacity-10 text-white bg-white aspect-square flex flex-col gap-y-12 justify-center text-6xl absolute z-50 ">
                    <h2>
                        <MdOutlineElectricalServices className="inline" />{" "}
                        Electric Vehicle Charging Management Platform
                    </h2>
                    <span className="text-base max-w-xs">
                        Manage your e-mobility service with our smart and
                        scalable solution
                    </span>
                </div>
            </section>
        </main>
    );
};

export default LoginPage;
