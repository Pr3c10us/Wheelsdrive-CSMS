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

const EditFormModal = ({ openForm, setOpenForm, handleRefresh, rate }) => {
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            name: rate.name,
            description: rate.description,
            discount: rate.discount,
            price: rate.price,
        },
        onSubmit: (values, { setSubmitting }) => {
            const rateDetails = values;
            axios.defaults.withCredentials = true;
            axios
                .put(
                    `${process.env.NEXT_PUBLIC_API_URL}rate/${rate._id}`,
                    rateDetails
                )
                .then((data) => {
                    setOpenForm(false);
                    handleRefresh();
                })
                .catch((error) => {
                    if (error.response) {
                        const errorMsg = error.response.data.msg;
                        dispatch(
                            changeErrorMessageType("Location creation failed")
                        );
                        dispatch(changeErrorMessage(errorMsg));
                        dispatch(changeShowErrorMessage(true));
                    }
                    setSubmitting(false);
                });
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Please fill out rate Name"),
            description: Yup.string().required(
                "Please give rate a description"
            ),
            price: Yup.number("Price must be a number").required(
                "Please fill out Price"
            ),
            discount: Yup.number("Discount must be a number")
                // .moreThan(-1, "Discount must be more than or equals to 0")
                .lessThan(101, "Discount not be more than 100")
                .required("Please fill out Discount"),
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
                        className={`relative z-[60] grid  w-full grid-cols-1 gap-x-8 gap-y-3 place-self-center rounded-xl bg-white p-10 shadow-lg transition-all duration-500 sm:max-w-4xl sm:grid-cols-2 `}
                    >
                        <div className="flex w-full flex-col gap-2 sm:col-span-2">
                            <div className="flex w-full items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    Edit Charge Rate
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
                                htmlFor="name"
                            >
                                Description
                            </label>
                            <input
                                id="description"
                                name="description"
                                type="text"
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    formik.touched.description &&
                                    formik.errors.description
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.description}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.description &&
                                formik.errors.description
                                    ? formik.errors.description
                                    : ""}
                            </p>
                        </div>
                        <div className="flex h-full w-full flex-col">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="name"
                            >
                                Price
                            </label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    formik.touched.price && formik.errors.price
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.price}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.price && formik.errors.price
                                    ? formik.errors.price
                                    : ""}
                            </p>
                        </div>
                        <div className="flex  h-full w-full flex-col">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="name"
                            >
                                Discount{" "}
                                <span className="ml-2 text-gray-300">%</span>
                            </label>
                            <input
                                id="discount"
                                name="discount"
                                type="number"
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    formik.touched.discount &&
                                    formik.errors.discount
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.discount}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.discount &&
                                formik.errors.discount
                                    ? formik.errors.discount
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

export default EditFormModal;
