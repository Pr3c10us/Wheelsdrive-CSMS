import React, { useEffect, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { HiOutlineStatusOnline } from "react-icons/hi";
import EditFormModal from "./editFormModal";
import { useSelector, useDispatch } from "react-redux";
import {
    changeErrorMessage,
    changeErrorMessageType,
    changeShowErrorMessage,
} from "@/redux/errorMessage";
import { MdNotStarted, MdOutlineStopCircle } from "react-icons/md";
import { BsFillUnlockFill } from "react-icons/bs";
import { GrPowerReset } from "react-icons/gr";
import { IoQrCode } from "react-icons/io5";
import axios from "axios";

const TableRow = ({ connector, handleRefresh, chargePointId }) => {
    const [openForm, setOpenForm] = React.useState(false);
    const admin = useSelector((state) => state.adminDetails.adminInfo);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const remoteActionFunction = async (remoteAction) => {
        const data = {
            connectorId: connector.connectorId,
        };
        const websocket = process.env.NEXT_PUBLIC_WEBSOCKET_API_URI;
        try {
            setLoading(true);
            if (
                connector.lastStatus != "Available" &&
                remoteAction == "startTransaction"
            ) {
                dispatch(changeErrorMessageType("Can't Start Transaction"));
                dispatch(changeErrorMessage("Connector is not available"));
                dispatch(changeShowErrorMessage(true));
                return setLoading(false);
            }
            if (
                connector.lastStatus == "Available" &&
                remoteAction == "stopTransaction"
            ) {
                dispatch(changeErrorMessageType("Can't Stop Transaction"));
                dispatch(changeErrorMessage("Connector is not charging"));
                dispatch(changeShowErrorMessage(true));
                return setLoading(false);
            }

            await axios.post(
                `${websocket}admin/${remoteAction}/${connector._id}`,
                data,
                {
                    headers: {
                        Authorization: `JWT ${localStorage.getItem("token")}`,
                    },
                }
            );
            handleRefresh();
            setLoading(false);
        } catch (error) {
            if (error.response) {
                setLoading(false);
                const errorMsg = error.response.data.msg;
                dispatch(changeErrorMessageType("Remote Action Error"));
                dispatch(changeErrorMessage(errorMsg));
                dispatch(changeShowErrorMessage(true));
            }
            setLoading(false);
        }
        setLoading(false);
    };

    return (
        <>
            {/* Create Loading animation that blocks whole screen on loading true */}
            <div
                className={`fixed  inset-0 z-[80] grid place-content-center ${
                    loading ? "backdrop-blur-sm" : "hidden"
                }`}
                role="status"
            >
                <svg
                    ariaHidden="true"
                    className="z-[90] mr-2 h-10 w-10 animate-spin fill-accent text-gray-200 "
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                    />
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                    />
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
            <tr className="text-base">
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{connector.connectorId}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{connector.lastStatus}</span>
                </td>
                <td className="grid place-content-center whitespace-nowrap px-4 py-4 font-medium text-text">
                    <HiOutlineStatusOnline
                        className={`h-6 w-6 ${
                            connector.active
                                ? "text-green-500"
                                : "text-gray-400"
                        }`}
                    />
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{connector.format}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{connector.type}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{connector.powerType}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{connector.power}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    {!connector.rate ? (
                        ""
                    ) : (
                        <span className="p-2">{connector.rate.price}</span>
                    )}
                </td>
                <td className="flex items-center justify-center gap-x-2 whitespace-nowrap px-4 py-4 font-medium text-text">
                    <div className="relative flex cursor-pointer items-center  justify-end">
                        {/* <BiDotsVerticalRounded className="peer w-8 h-8 text-3xl transition-all duration-200" /> */}
                        <div className="flex  items-center gap-x-2">
                            <button
                                title="Edit Connector Info"
                                onClick={() => setOpenForm(true)}
                                className="flex w-full items-center justify-center transition-all duration-200 hover:scale-110"
                            >
                                <FiEdit3 className="h-7 w-7 transition-all duration-200 " />
                            </button>
                            <button
                                onClick={() => remoteActionFunction("reset")}
                                title="Remote Reset"
                                className=" transition-all duration-200 hover:scale-110"
                            >
                                <GrPowerReset className="h-6 w-6" />
                            </button>
                            <button
                                onClick={() =>
                                    remoteActionFunction("unlockConnector")
                                }
                                title="Remote Unlock"
                                className=" transition-all duration-200 hover:scale-110"
                            >
                                <BsFillUnlockFill className="h-6 w-6" />
                            </button>
                            <button
                                onClick={() =>
                                    remoteActionFunction("startTransaction")
                                }
                                title="Remote Start"
                                className=" transition-all duration-200 hover:scale-110"
                            >
                                <MdNotStarted className="h-7 w-7 text-green-500" />
                            </button>
                            <button
                                onClick={() =>
                                    remoteActionFunction("stopTransaction")
                                }
                                title="Remote Stop"
                                className=" transition-all duration-200 hover:scale-110"
                            >
                                <MdOutlineStopCircle className="h-7 w-7 text-red-500" />
                            </button>
                            <button
                                title="Download Qr Code"
                                className=" transition-all duration-200 hover:scale-110"
                            >
                                <a href={connector.qrcode_url} target="_blank">
                                    <IoQrCode className="h-7 w-7 text-black" />
                                </a>
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
            <EditFormModal
                openForm={openForm}
                setOpenForm={setOpenForm}
                handleRefresh={handleRefresh}
                connector={connector}
            />
        </>
    );
};

export default TableRow;
