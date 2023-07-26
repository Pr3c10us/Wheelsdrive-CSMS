import React, { useState, useMemo } from "react";
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
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getDetails,
    getGeocode,
    getLatLng,
    getZipCode,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
const containerStyle = {
    width: "100%",
    height: "300px",
};

const CreateFormModal = ({ openForm, setOpenForm,handleRefresh }) => {
    const dispatch = useDispatch();
    const [selectedAddress, setSelectedAddress] = useState("");
    const [selectedLat, setSelectedLat] = useState("");
    const [selectedLng, setSelectedLng] = useState("");
    const [addressError, setAddressError] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [map, setMap] = useState(null);
    const center = useMemo(() => ({ lat: 20.59, lng: 78.96 }), []);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });
    const onLoad = React.useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds({
            lat: 20.5937,
            lng: 78.9629,
        });
        map.fitBounds(bounds);

        setMap(map);
    }, []);
    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete();
    const ref = useOnclickOutside(() => {
        // When user clicks outside of the component, we can dismiss
        // the searched suggestions by calling this method
        clearSuggestions();
    });
    const handleInput = (e) => {
        // Update the keyword of the input element
        setValue(e.target.value);
    };
    const handleSelect =
        ({ description }) =>
        () => {
            // When user selects a place, we can replace the keyword without request data from API
            // by setting the second parameter to "false"
            setValue(description, false);
            clearSuggestions();

            // Get latitude and longitude via utility functions
            getGeocode({ address: description }).then((results) => {
                const { lat, lng } = getLatLng(results[0]);
                map.setCenter({ lat, lng });
                // setSelectedAddress({ lat, lng });
                console.log({ "📍 Coordinates: ": { lat, lng }, results });
                setZipCode(getZipCode(results[0], false));
                setSelectedLat(lat);
                setSelectedLng(lng);
                setSelectedAddress(results[0].formatted_address);
                setAddressError("")
            });
        };
    const renderSuggestions = () =>
        data.map((suggestion) => {
            const {
                place_id,
                structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
                <li
                    key={place_id}
                    onClick={handleSelect(suggestion)}
                    className="cursor-pointer overflow-hidden border-b border-gray-200 p-4 py-1 text-sm hover:bg-primary hover:bg-opacity-20 sm:text-lg"
                >
                    <strong>{main_text}</strong> <small>{secondary_text}</small>
                </li>
            );
        });

    const formik = useFormik({
        initialValues: {
            name: "",

            display: false,
        },
        onSubmit: (values, { setSubmitting }) => {
            if (!selectedAddress || !selectedLat || !selectedLng) {
                setAddressError("Select a proper address");
                return setSubmitting(false);
            }
            const location = values;
            location.address = selectedAddress;
            location.latitude = selectedLat;
            location.longitude = selectedLng;
            location.zipCode = zipCode;
            location.state =
                selectedAddress.split(",")[
                    selectedAddress.split(",").length - 2
                ];
            location.country =
                selectedAddress.split(",")[
                    selectedAddress.split(",").length - 1
                ];
            axios.defaults.withCredentials = true;
            axios
                .post(
                    `${process.env.NEXT_PUBLIC_API_URL}location/admin`,
                    location
                )
                .then((data) => {
                    setOpenForm(false);
                    handleRefresh()
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
        }),
    });
    if (!isLoaded) {
        return <div>Loading...</div>;
    }
    return (
        <>
            {openForm && (
                <div
                    className={`fixed inset-0 z-50 grid overflow-auto px-4 py-4 sm:overflow-visible sm:px-8 sm:py-0`}
                >
                    <div
                        onClick={() => setOpenForm(false)}
                        className={`fixed bottom-0 left-0 right-0 top-0 z-50 bg-primary bg-opacity-20 backdrop-blur-sm`}
                    ></div>

                    <form
                        onSubmit={formik.handleSubmit}
                        className={`relative z-[60] grid  w-full gap-x-8 gap-y-3 place-self-center rounded-xl bg-white px-4 py-10 shadow-lg transition-all duration-500 sm:max-w-3xl  sm:px-10 `}
                    >
                        <div className="flex w-full flex-col gap-2 ">
                            <div className="flex w-full items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    Add Location
                                </h2>
                                <FaTimes
                                    onClick={() => setOpenForm(false)}
                                    className="h-10 cursor-pointer"
                                />
                            </div>
                            <hr />
                        </div>
                        <div className="flex h-full w-full flex-col ">
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
                        <div
                            ref={ref}
                            className="relative z-20 flex h-full w-full flex-col "
                        >
                            <label
                                className="text-sm font-semibold"
                                htmlFor="name"
                            >
                                Address
                            </label>
                            <input
                                value={value}
                                onChange={handleInput}
                                disabled={!ready}
                                placeholder="Where is the location located :) ?"
                                className={`rounded-md border-2 px-2 py-2 text-xl transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0`}
                            />
                            {/* We can use the "status" to decide whether we should display the dropdown or not */}
                            {status === "OK" && (
                                <ul className="scrollbar-table absolute left-0 mt-20 flex w-full flex-col flex-nowrap overflow-auto rounded-xl border bg-white pt-2 shadow-lg">
                                    {renderSuggestions()}
                                </ul>
                            )}
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {addressError ? addressError : ""}
                            </p>
                        </div>
                        <div className="flex w-full items-center justify-center">
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                // zoom={5}
                                // center={center}
                                onLoad={onLoad}
                                onUnmount={onUnmount}
                            >
                                {selectedLat && selectedLng && (
                                    <Marker
                                        position={{
                                            lat: selectedLat,
                                            lng: selectedLng,
                                        }}
                                    />
                                )}
                            </GoogleMap>
                        </div>
                        {/*
                        <div className="flex h-full w-full flex-col sm:col-span-2">
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
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    formik.touched.address &&
                                    formik.errors.address
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.address}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.address && formik.errors.address
                                    ? formik.errors.address
                                    : ""}
                            </p>
                        </div>
                        <div className="flex h-full w-full flex-col">
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
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    formik.touched.zipCode &&
                                    formik.errors.zipCode
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.zipCode}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.zipCode && formik.errors.zipCode
                                    ? formik.errors.zipCode
                                    : ""}
                            </p>
                        </div>
                        <div className="flex  h-full w-full flex-col">
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
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    formik.touched.city && formik.errors.city
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.city}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.city && formik.errors.city
                                    ? formik.errors.city
                                    : ""}
                            </p>
                        </div>
                        <div className="flex  h-full w-full flex-col">
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
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    formik.touched.state && formik.errors.state
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.state}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.state && formik.errors.state
                                    ? formik.errors.state
                                    : ""}
                            </p>
                        </div>
                        <div className="flex  h-full w-full flex-col">
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
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    formik.touched.country &&
                                    formik.errors.country
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.country}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.country && formik.errors.country
                                    ? formik.errors.country
                                    : ""}
                            </p>
                        </div>
                        <div className="flex  h-full w-full flex-col">
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
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    formik.touched.latitude &&
                                    formik.errors.latitude
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.latitude}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.latitude &&
                                formik.errors.latitude
                                    ? formik.errors.latitude
                                    : ""}
                            </p>
                        </div>
                        <div className="flex  h-full w-full flex-col">
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
                                className={`rounded-md border-2 px-2 py-1 text-lg transition-all duration-200 focus:border-primary focus:outline-primary focus:ring-0 ${
                                    formik.touched.longitude &&
                                    formik.errors.longitude
                                        ? "border-red-500 focus:outline-red-500"
                                        : "focus:border-primary focus:outline-primary"
                                }`}
                                onChange={formik.handleChange}
                                value={formik.values.longitude}
                                onBlur={formik.handleBlur}
                            />
                            <p className="h-2 px-2 text-xs font-medium text-red-600 sm:h-4">
                                {formik.touched.longitude &&
                                formik.errors.longitude
                                    ? formik.errors.longitude
                                    : ""}
                            </p>
                        </div>
                         */}
                        <div className="mt-2 flex h-full w-full gap-x-4">
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
                            className={`mt-4 rounded-md bg-primary py-2 text-white ${
                                formik.isSubmitting && "bg-opacity-40"
                            }`}
                        >
                            Add
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default CreateFormModal;
