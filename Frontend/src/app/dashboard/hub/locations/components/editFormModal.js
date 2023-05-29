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

const EditFormModal = ({ openForm, setOpenForm, location }) => {
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            name: location.name,
            address: location.address,
            zipCode: location.zipCode,
            city: location.city,
            state: location.state,
            country: location.country,
            latitude: location.latitude,
            longitude: location.longitude,
            display: location.display,
        },
        onSubmit: (values, { setSubmitting }) => {
            const locationDetails = values;
            axios.defaults.withCredentials = true;
            axios
                .put(
                    `${process.env.NEXT_PUBLIC_API_URL}location/admin/${location._id}`,
                    locationDetails
                )
                .then((data) => {
                    setOpenForm(false);
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
            name: Yup.string().required("Please fill out Location Name"),
            address: Yup.string().required(
                "Please fill out Location street Address"
            ),
            zipCode: Yup.string().required("Please fill out Location Zip Code"),
            city: Yup.string().required("Please fill out Location City"),
            state: Yup.string().required("Please fill out Location State"),
            country: Yup.string().required("Please fill out Location Country"),
            latitude: Yup.string().required(
                "Please fill out Location Latitude"
            ),
            longitude: Yup.string().required(
                "Please fill out Location Longitude"
            ),
        }),
    });
    return (
        <>
            {openForm && (
                <div
                    className={`fixed text-left z-50 inset-0 py-4 sm:py-0 sm:px-8 px-4 sm:overflow-visible overflow-auto grid`}
                >
                    <div
                        onClick={() => setOpenForm(false)}
                        className={`fixed z-50 top-0 left-0 right-0 bottom-0 backdrop-blur-sm bg-primary bg-opacity-20`}
                    ></div>

                    <form
                        onSubmit={formik.handleSubmit}
                        className={`grid place-self-center shadow-lg  w-full sm:w-auto z-[60] rounded-xl p-10 gap-y-3 gap-x-8 transition-all duration-500 relative bg-white grid-cols-1 sm:grid-cols-2 `}
                    >
                        <div className="flex sm:col-span-2 flex-col w-full gap-2">
                            <div className="flex w-full justify-between items-center">
                                <h2 className="font-semibold text-lg">
                                    Edit Location
                                </h2>
                                <FaTimes
                                    onClick={() => setOpenForm(false)}
                                    className="h-10 cursor-pointer"
                                />
                            </div>
                            <hr />
                        </div>
                        <div className="flex sm:col-span-2 flex-col w-full h-full">
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
                        <div className="flex sm:col-span-2 flex-col w-full h-full">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="name"
                            >
                                Address
                            </label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 focus:border-primary focus:outline-primary ${
                                    formik.touched.address &&
                                    formik.errors.address
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.address}
                                onBlur={formik.handleBlur}
                            />
                            <p className="text-xs px-2 font-medium text-red-600 h-2 sm:h-4">
                                {formik.touched.address && formik.errors.address
                                    ? formik.errors.address
                                    : ""}
                            </p>
                        </div>
                        <div className="flex flex-col w-full h-full">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="name"
                            >
                                ZipCode
                            </label>
                            <input
                                id="zipCode"
                                name="zipCode"
                                type="text"
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 focus:border-primary focus:outline-primary ${
                                    formik.touched.zipCode &&
                                    formik.errors.zipCode
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.zipCode}
                                onBlur={formik.handleBlur}
                            />
                            <p className="text-xs px-2 font-medium text-red-600 h-2 sm:h-4">
                                {formik.touched.zipCode && formik.errors.zipCode
                                    ? formik.errors.zipCode
                                    : ""}
                            </p>
                        </div>
                        <div className="flex  flex-col w-full h-full">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="name"
                            >
                                City
                            </label>
                            <input
                                id="city"
                                name="city"
                                type="text"
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 focus:border-primary focus:outline-primary ${
                                    formik.touched.city && formik.errors.city
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.city}
                                onBlur={formik.handleBlur}
                            />
                            <p className="text-xs px-2 font-medium text-red-600 h-2 sm:h-4">
                                {formik.touched.city && formik.errors.city
                                    ? formik.errors.city
                                    : ""}
                            </p>
                        </div>
                        <div className="flex  flex-col w-full h-full">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="name"
                            >
                                State
                            </label>
                            <input
                                id="state"
                                name="state"
                                type="text"
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 focus:border-primary focus:outline-primary ${
                                    formik.touched.state && formik.errors.state
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.state}
                                onBlur={formik.handleBlur}
                            />
                            <p className="text-xs px-2 font-medium text-red-600 h-2 sm:h-4">
                                {formik.touched.state && formik.errors.state
                                    ? formik.errors.state
                                    : ""}
                            </p>
                        </div>
                        <div className="flex  flex-col w-full h-full">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="name"
                            >
                                Country
                            </label>
                            <input
                                id="country"
                                name="country"
                                type="text"
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 focus:border-primary focus:outline-primary ${
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
                        <div className="flex  flex-col w-full h-full">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="name"
                            >
                                Latitude
                            </label>
                            <input
                                id="latitude"
                                name="latitude"
                                type="text"
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 focus:border-primary focus:outline-primary ${
                                    formik.touched.latitude &&
                                    formik.errors.latitude
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.latitude}
                                onBlur={formik.handleBlur}
                            />
                            <p className="text-xs px-2 font-medium text-red-600 h-2 sm:h-4">
                                {formik.touched.latitude &&
                                formik.errors.latitude
                                    ? formik.errors.latitude
                                    : ""}
                            </p>
                        </div>
                        <div className="flex  flex-col w-full h-full">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="name"
                            >
                                Longitude
                            </label>
                            <input
                                id="longitude"
                                name="longitude"
                                type="text"
                                className={`border-2 text-lg px-2 transition-all duration-200 focus:ring-0 rounded-md py-1 focus:border-primary focus:outline-primary ${
                                    formik.touched.longitude &&
                                    formik.errors.longitude
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.longitude}
                                onBlur={formik.handleBlur}
                            />
                            <p className="text-xs px-2 font-medium text-red-600 h-2 sm:h-4">
                                {formik.touched.longitude &&
                                formik.errors.longitude
                                    ? formik.errors.longitude
                                    : ""}
                            </p>
                        </div>
                        <div className="flex sm:col-span-2 gap-x-4 w-full h-full">
                            <label className="font-semibold" htmlFor="name">
                                Display To Public
                            </label>
                            <input
                                id="display"
                                name="display"
                                type="checkbox"
                                className={`w-6`}
                                onChange={formik.handleChange}
                                value={formik.values.display}
                                checked={formik.values.display}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        <button
                            disabled={formik.isSubmitting}
                            type="submit"
                            className={`sm:col-span-2 bg-primary mt-4 text-white py-2 rounded-md ${
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
