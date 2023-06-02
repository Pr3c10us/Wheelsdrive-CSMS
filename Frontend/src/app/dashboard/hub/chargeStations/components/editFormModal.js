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
import { BiPlus, BiSearch } from "react-icons/bi";
import { createLocation, createUsers } from "@/redux/adminDetails";
import { PuffLoader } from "react-spinners";
import { usePathname, useRouter } from "next/navigation";

const EditFormModal = ({
    openForm,
    setOpenForm,
    handleRefresh,
    chargePoint,
}) => {
    const [locationId, setLocationId] = useState(chargePoint.location._id);
    const [loading, setLoading] = useState(false);
    const [locationName, setLocationName] = useState(chargePoint.location.name);
    const [locationNameSearch, setLocationNameSearch] = useState("");
    const [showLocation, setShowLocation] = useState(false);
    const [locationIdError, setLocationIdError] = useState("");
    const locations = useSelector((state) => state.adminDetails.locations);
    const dispatch = useDispatch();
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            name: chargePoint.name,
            clientCertificate: chargePoint.clientCertificate,
            notes: chargePoint.notes,
        },
        onSubmit: (values, { setSubmitting }) => {
            console.log(values);
            if (!locationId) {
                setLocationIdError("Please select an ChargeStation");
                return setSubmitting(false);
            }
            const chargePointDetails = {
                name: values.name,
                clientCertificate: values.clientCertificate,
                notes: values.notes,
                locationId,
            };

            axios.defaults.withCredentials = true;
            axios
                .put(
                    `${process.env.NEXT_PUBLIC_API_URL}chargePoint/${chargePoint._id}`,
                    chargePointDetails
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
            name: Yup.string().required("Please fill out ChargeStation name"),
            notes: Yup.string().required("Please fill out ChargeStation notes"),
        }),
    });
    const handleEffect = async () => {
        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}location/admin?limit=100&name=${locationNameSearch}`
            );
            const { locations } = response.data;
            dispatch(createLocation(locations));
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
    }, [locationNameSearch]);

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
                                    Edit ChargeStation
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

                        <div className="flex  h-full w-full flex-col">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="clientCertificate"
                            >
                                Client Certificate
                            </label>
                            <input
                                id="clientCertificate"
                                name="clientCertificate"
                                type="text"
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    formik.touched.clientCertificate &&
                                    formik.errors.clientCertificate
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.clientCertificate}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.clientCertificate &&
                                formik.errors.clientCertificate
                                    ? formik.errors.clientCertificate
                                    : ""}
                            </p>
                        </div>
                        <div className="relative flex h-full w-full flex-col sm:col-span-2">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="mobile"
                            >
                                Location{" "}
                            </label>
                            <div
                                onClick={() => setShowLocation(!showLocation)}
                                className={`flex min-h-[2.5rem] items-center  rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    locationName
                                        ? "justify-between"
                                        : "justify-end"
                                }`}
                            >
                                {locationName || " "}
                                <IoIosArrowDown />
                            </div>
                            <div
                                className={`scrollbar-drop-down absolute left-1/2 top-full z-[70] grid max-h-52 w-full -translate-x-1/2 gap-y-4 overflow-x-auto overflow-y-auto rounded-md bg-white transition-all duration-300  ${
                                    showLocation
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
                                                id="locationName"
                                                name="locationName"
                                                type="text"
                                                placeholder="locationName . . ."
                                                className={`w-full rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 `}
                                                onChange={(e) => {
                                                    setLocationNameSearch(
                                                        e.target.value
                                                    );
                                                }}
                                                value={locationNameSearch}
                                            />
                                            <BiSearch className="text-slate absolute bottom-0 right-2 top-0 mb-auto mt-auto h-5 w-5 text-gray-400" />
                                        </div>
                                        <div className="h-full font-medium">
                                            <div
                                                onClick={() =>
                                                    router.push(
                                                        "/dashboard/hub/locations"
                                                    )
                                                }
                                                className="flex cursor-pointer items-center gap-x-4 py-2 hover:bg-accent hover:bg-opacity-10"
                                            >
                                                <BiPlus /> Create new Location
                                            </div>
                                            {locations.map((location) => {
                                                return (
                                                    <div
                                                        key={location._id}
                                                        onClick={() => {
                                                            setLocationId(
                                                                location._id
                                                            );
                                                            setLocationName(
                                                                location.name
                                                            );
                                                            setLocationIdError(
                                                                ""
                                                            );
                                                        }}
                                                        className={`cursor-pointer p-2 transition-all duration-200 hover:bg-accent hover:bg-opacity-10 ${
                                                            locationId ==
                                                            location._id
                                                                ? "bg-accent bg-opacity-10 "
                                                                : ""
                                                        }`}
                                                    >
                                                        {location.name}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {locationIdError}
                            </p>
                        </div>
                        <div className="flex h-full w-full flex-col sm:col-span-2">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="notes"
                            >
                                Note
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                type="text"
                                className={`min-h-[5rem] rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    formik.touched.notes && formik.errors.notes
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.notes}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.notes && formik.errors.notes
                                    ? formik.errors.notes
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
