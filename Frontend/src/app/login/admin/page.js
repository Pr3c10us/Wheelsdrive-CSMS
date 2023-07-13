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
                const res = await axios(
                    `${process.env.NEXT_PUBLIC_API_URL}admin/auth/login`,
                    {
                        method: "POST",
                        data: values,
                        withCredentials: true,
                    }
                );
                localStorage.setItem("token", res.data.token);
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
        <main className="relative flex h-full flex-row overflow-hidden">
            <Alert
                errorMessage={errorMessage}
                errorMessageType={errorMessageType}
                showErrorMessage={showErrorMessage}
            />{" "}
            <div className=" grid w-full flex-1 space-y-8 overflow-auto pb-10 pt-4 sm:space-y-10 sm:py-8 ">
                <form
                    className="flex w-full max-w-sm flex-col items-center justify-center space-y-8 place-self-center sm:max-w-none sm:px-44"
                    onSubmit={formik.handleSubmit}
                >
                    <section className="flex w-full flex-col items-center justify-center space-y-8">
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
                            <h2 className="font-raleway text-3xl font-semibold sm:text-4xl">
                                Welcome Back{" "}
                            </h2>
                        </div>
                    </section>
                    <section className="flex w-full flex-col gap-x-4 gap-y-2">
                        <div className="flex h-full w-full flex-col sm:col-span-2">
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
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:ring-0 ${
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

                        <div className="flex h-full w-full flex-col">
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
                                className={`rounded-md border-2 px-2  py-1 text-lg transition-all duration-200 focus:ring-0 ${
                                    formik.touched.password &&
                                    formik.errors.password
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.password &&
                                formik.errors.password
                                    ? formik.errors.password
                                    : ""}
                            </p>
                        </div>
                    </section>

                    <section className="flex w-full flex-col items-center justify-center gap-y-4 ">
                        <button
                            disabled={formik.isSubmitting}
                            type="submit"
                            className="w-full rounded-md bg-primary px-12 py-3 text-white"
                        >
                            Login
                        </button>
                        <p className="">
                            <span>Don't have an account?</span>
                            <Link
                                href="/signup/admin"
                                className="ml-1 inline-block h-min text-base font-semibold text-primary underline"
                            >
                                Signup
                            </Link>
                        </p>
                    </section>
                </form>
            </div>
            <section className="relative hidden h-full w-full flex-1 items-center justify-center lg:flex ">
                <div className="h-full w-full bg-gradient-to-tr from-primary to-accent blur-sm "></div>
                <div className="absolute z-50 flex aspect-square w-min flex-col justify-center gap-y-12 bg-white bg-opacity-10 p-10 text-6xl font-semibold text-white ">
                    <h2>
                        <MdOutlineElectricalServices className="inline" />{" "}
                        Electric Vehicle Charging Management Platform
                    </h2>
                    <span className="max-w-xs text-base">
                        Manage your e-mobility service with our smart and
                        scalable solution
                    </span>
                </div>
            </section>
        </main>
    );
};

export default LoginPage;
