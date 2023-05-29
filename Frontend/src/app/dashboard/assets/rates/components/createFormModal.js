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

const CreateFormModal = ({ openForm, setOpenForm, handleRefresh }) => {
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            discount: 0,
            price: 0,
        },
        onSubmit: (values, { setSubmitting }) => {
            const location = values;
            axios.defaults.withCredentials = true;
            axios
                .post(`${process.env.NEXT_PUBLIC_API_URL}rate`, location)
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
                    className={`fixed z-50 inset-0 py-4 sm:py-0 sm:px-8 px-4 sm:overflow-visible overflow-auto grid`}
                >
                    <div
                        onClick={() => setOpenForm(false)}
                        className={`fixed z-50 top-0 left-0 right-0 bottom-0 backdrop-blur-sm bg-primary bg-opacity-20`}
                    ></div>

                    <form
                        onSubmit={formik.handleSubmit}
                        className={`grid place-self-center shadow-lg  w-full sm:max-w-4xl z-[60] rounded-xl p-10 gap-y-3 gap-x-8 transition-all duration-500 relative bg-white grid-cols-1 sm:grid-cols-2 `}
                    >
                        <div className="flex sm:col-span-2 flex-col w-full gap-2">
                            <div className="flex w-full justify-between items-center">
                                <h2 className="font-semibold text-lg">
                                    Add Charge Rate
                                </h2>
                                <FaTimes
                                    onClick={() => setOpenForm(false)}
                                    className="h-10 cursor-pointer"
                                />
                            </div>
                            <hr />
                        </div>
                        <div className="flex flex-col w-full h-full">
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
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 focus:border-primary focus:outline-primary ${
                                    formik.touched.name && formik.errors.name
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.name}
                                onBlur={formik.handleBlur}
                            />
                            <p className="text-xs px-2 font-medium text-red-600 h-2 sm:h-4">
                                {formik.touched.name && formik.errors.name
                                    ? formik.errors.name
                                    : ""}
                            </p>
                        </div>
                        <div className="flex flex-col w-full h-full">
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
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 focus:border-primary focus:outline-primary ${
                                    formik.touched.description &&
                                    formik.errors.description
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.description}
                                onBlur={formik.handleBlur}
                            />
                            <p className="text-xs px-2 font-medium text-red-600 h-2 sm:h-4">
                                {formik.touched.description &&
                                formik.errors.description
                                    ? formik.errors.description
                                    : ""}
                            </p>
                        </div>
                        <div className="flex flex-col w-full h-full">
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
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 focus:border-primary focus:outline-primary ${
                                    formik.touched.price && formik.errors.price
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.price}
                                onBlur={formik.handleBlur}
                            />
                            <p className="text-xs px-2 font-medium text-red-600 h-2 sm:h-4">
                                {formik.touched.price && formik.errors.price
                                    ? formik.errors.price
                                    : ""}
                            </p>
                        </div>
                        <div className="flex  flex-col w-full h-full">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="name"
                            >
                                Discount{" "}
                                <span className="text-gray-300 ml-2">%</span>
                            </label>
                            <input
                                id="discount"
                                name="discount"
                                type="number"
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 focus:border-primary focus:outline-primary ${
                                    formik.touched.discount &&
                                    formik.errors.discount
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.discount}
                                onBlur={formik.handleBlur}
                            />
                            <p className="text-xs px-2 font-medium text-red-600 h-2 sm:h-4">
                                {formik.touched.discount &&
                                formik.errors.discount
                                    ? formik.errors.discount
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
