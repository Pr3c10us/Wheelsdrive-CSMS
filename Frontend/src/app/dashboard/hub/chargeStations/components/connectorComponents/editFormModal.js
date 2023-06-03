import Select from "react-select";
import { connect, useFormik } from "formik";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import * as Yup from "yup";
import {
    changeErrorMessage,
    changeErrorMessageType,
    changeShowErrorMessage,
} from "@/redux/errorMessage";
import { useDispatch, useSelector } from "react-redux";

const EditFormModal = ({ openForm, setOpenForm, handleRefresh, connector }) => {
    const rates = useSelector((state) => state.adminDetails.rates);
    const dispatch = useDispatch();
    const [connectorTypes, setConnectorTypes] = useState([
        { value: "type2", label: "Type 2" },
        { value: "chademo", label: "Chademo" },
        { value: "ccs1", label: "CCS1" },
        { value: "ccs2", label: "CCS2" },
        { value: "j1772", label: "J1772" },
    ]);
    const [connectorFormats, setConnectorFormats] = useState([
        { value: "socket", label: "Socket" },
        { value: "cable", label: "Cable" },
    ]);
    const [connectorPowerTypes, setConnectorPowerTypes] = useState([
        { value: "AC", label: "AC" },
        { value: "DC", label: "DC" },
    ]);
    const [connectorRate, setConnectorRate] = useState([]);

    const [type, setType] = useState(connector.type);
    const [format, setFormat] = useState(connector.format);
    const [powerType, setPowerType] = useState(connector.powerType);
    const [power, setPower] = useState(connector.power);
    const [active, setActive] = useState(connector.active);
    const [chargeRate, setChargeRate] = useState(connector.rate);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (!type || !format || !powerType || !power || !chargeRate) {
            dispatch(changeErrorMessageType("Failed to Update"));
            dispatch(changeErrorMessage("Please fill in all fields"));
            dispatch(changeShowErrorMessage(true));
            return setIsSubmitting(false);
        }
        const connectorDetails = {
            type,
            format,
            powerType,
            power,
            active,
            rate: chargeRate,
        };
        console.log(connectorDetails);

        axios.defaults.withCredentials = true;
        axios
            .put(
                `${process.env.NEXT_PUBLIC_API_URL}connector/${connector._id}`,
                connectorDetails
            )
            .then((data) => {
                setOpenForm(false);
                handleRefresh();
            })
            .catch((error) => {
                if (error.response) {
                    const errorMsg = error.response.data.msg;
                    dispatch(changeErrorMessageType("RFID creation failed"));
                    dispatch(changeErrorMessage(errorMsg));
                    dispatch(changeShowErrorMessage(true));
                }
                setIsSubmitting(false);
            });
    };

    const customStyles = {
        option: (defaultStyles, state) => ({
            ...defaultStyles,
            "&:hover": {
                backgroundColor: "#1919703e",
            },
            // color: state.isSelected ? "#191970" : "#000",
            backgroundColor: state.isSelected ? "#191970" : "#fff",
        }),

        control: (defaultStyles, state) => ({
            ...defaultStyles,
            // backgroundColor: "#212529",
            outline: state.isFocused
                ? "1px solid #191970"
                : "0px none transparent",
            borderColor: "rgb(209 213 219 )",

            "&:hover": {
                borderColor: state.isFocused ? "transparent" : "#191970",
            },
            // border: "none",
            // boxShadow: "none",
        }),
        singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#000" }),
    };

    const handleEffect = async () => {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}rate`
            );
            const { rates } = response.data;
            if (!rates || rates.length <= 0) {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}rate`
                );
                const { rates } = response.data;
                // dispatch(createRates(rates));

                const selectRate = rates.map((rate) => {
                    return { value: rate._id, label: rate.name };
                });
                setConnectorRate([...selectRate]);

                console.log(connectorRate);
            }
            // dispatch(createRates(rates));
            const selectRate = rates.map((rate) => {
                console.log(rate);
                return { value: rate._id, label: rate.name };
            });
            setConnectorRate([...selectRate]);

            console.log(connectorRate);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        handleEffect();
    }, []);

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
                        onSubmit={onSubmit}
                        className={`relative z-[60] grid  w-full grid-cols-1 gap-x-8 gap-y-6 place-self-center rounded-xl bg-white p-10 shadow-lg transition-all duration-500 sm:max-w-4xl sm:grid-cols-2 lg:grid-cols-4`}
                    >
                        <div className="mb-4 flex w-full flex-col gap-2 sm:col-span-2 lg:col-span-4">
                            <div className="flex w-full items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    Edit Connector
                                </h2>
                                <FaTimes
                                    onClick={() => setOpenForm(false)}
                                    className="h-10 cursor-pointer"
                                />
                            </div>
                            <hr />
                        </div>
                        <div className="flex h-full w-full flex-col gap-y-2">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="clientCertificate"
                            >
                                Connector Type
                            </label>
                            <Select
                                styles={customStyles}
                                name="type"
                                options={connectorTypes}
                                value={connectorTypes.find(
                                    (item) => item.value === type
                                )}
                                onChange={(selectedOption) => {
                                    setType(selectedOption.value);
                                }}
                            />
                        </div>
                        <div className="flex h-full w-full flex-col gap-y-2">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="clientCertificate"
                            >
                                Connector Format
                            </label>
                            <Select
                                styles={customStyles}
                                name="format"
                                options={connectorFormats}
                                value={connectorFormats.find(
                                    (item) => item.value === format
                                )}
                                onChange={(selectedOption) => {
                                    setFormat(selectedOption.value);
                                }}
                            />
                        </div>
                        <div className="flex h-full w-full flex-col gap-y-2">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="clientCertificate"
                            >
                                Connector Power Type
                            </label>
                            <Select
                                styles={customStyles}
                                name="powerType"
                                options={connectorPowerTypes}
                                value={connectorPowerTypes.find(
                                    (item) => item.value === powerType
                                )}
                                onChange={(selectedOption) => {
                                    setPowerType(selectedOption.value);
                                }}
                            />
                        </div>
                        <div className="flex h-full w-full flex-col gap-y-2">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="Rate"
                            >
                                Connector Charge Rate
                            </label>
                            <Select
                                styles={customStyles}
                                name="powerType"
                                options={connectorRate}
                                value={connectorRate.find(
                                    (item) => item.value === powerType
                                )}
                                onChange={(selectedOption) => {
                                    setChargeRate(selectedOption.value);
                                }}
                            />
                        </div>
                        <div className="flex h-full w-full flex-col gap-y-2">
                            <label
                                className="text-sm font-semibold"
                                htmlFor="clientCertificate"
                            >
                                Connector Power{" "}
                                <span className="text-xs text-gray-300">
                                    {` `}(KwH)
                                </span>
                            </label>
                            <input
                                type="text"
                                name="power"
                                value={power}
                                className="rounded border  border-gray-300 px-2 py-1 text-lg hover:border-primary focus:ring-0"
                                onChange={(e) => {
                                    setPower(e.target.value);
                                }}
                            />
                        </div>

                        <div className="flex h-full w-full gap-x-4 sm:col-span-2 lg:col-span-4">
                            <label className="font-semibold" htmlFor="name">
                                Active
                            </label>
                            <input
                                id="active"
                                name="active"
                                type="checkbox"
                                className={`w-6`}
                                onChange={(e) => setActive(e.target.checked)}
                                value={active}
                                checked={active}
                            />
                        </div>
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className={`mt-4 rounded-md bg-primary py-2 text-white sm:col-span-2 lg:col-span-4 ${
                                isSubmitting && "bg-opacity-40"
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
