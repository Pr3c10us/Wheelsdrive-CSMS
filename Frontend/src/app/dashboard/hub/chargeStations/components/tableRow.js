import { useEffect, useState } from "react";
import {
    HiOutlineStatusOnline,
    HiInformationCircle,
    HiMenu,
} from "react-icons/hi";
import { DiHtml5Connectivity } from "react-icons/di";
import { FiEdit3 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { HiMinus, HiPlus } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import {
    changeErrorMessage,
    changeErrorMessageType,
    changeShowErrorMessage,
} from "@/redux/errorMessage";
import axios from "axios";
import EditFormModal from "./editFormModal";
import ConnectorTable from "./connectorComponents/conectorTable";
import DetailsModal from "./detailsModal";
import { CgNotes } from "react-icons/cg";
import LogsModal from "./logsModal";

const TableRow = ({ chargePoint, handleRefresh }) => {
    const [openEditForm, setOpenEditForm] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [showConnectors, setShowConnectors] = useState(false);
    const [showLogs, setShowLogs] = useState(false);

    const dispatch = useDispatch();

    const handleDelete = async () => {
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}chargePoint/${chargePoint._id}`
            );
            handleRefresh();
        } catch (error) {
            if (error.response) {
                const errorMsg = error.response.data.msg;
                dispatch(changeErrorMessageType("Rfid deletion failed"));
                dispatch(changeErrorMessage(errorMsg));
                dispatch(changeShowErrorMessage(true));
            }
        }
    };
    return (
        <>
            <tr className="text-base">
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    {chargePoint.connectors.length > 0 && (
                        <button
                            onClick={() => setShowConnectors(!showConnectors)}
                        >
                            {!showConnectors ? <HiPlus /> : <HiMinus />}
                        </button>
                    )}
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{chargePoint.name}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{chargePoint.location.name}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{chargePoint.endpoint}</span>
                </td>
                <td className="grid place-content-center whitespace-nowrap px-4 py-4 font-medium text-text">
                    {chargePoint.isConnected ? (
                        <DiHtml5Connectivity
                            title="Connected"
                            className="h-7 w-7 text-green-400"
                        />
                    ) : (
                        <DiHtml5Connectivity
                            title="Not Connected"
                            className="h-7 w-7 text-gray-400"
                        />
                    )}
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2 ">
                        {chargePoint.connectors.length}
                    </span>
                </td>
                <td className="z-0 flex w-full gap-x-2 whitespace-nowrap px-4 py-4 font-medium text-text">
                    <button
                        onClick={() => setOpenDetails(true)}
                        className="flex flex-1 items-center justify-center gap-x-2 rounded border border-black px-2.5 py-2 transition-all duration-200 hover:scale-105 hover:border-primary hover:text-primary"
                    >
                        <HiInformationCircle />
                        Details
                    </button>
                    <button
                        onClick={() => setShowLogs(true)}
                        className="flex flex-1 items-center justify-center gap-x-2 rounded border border-black px-4 py-2 transition-all duration-200 hover:scale-105 hover:border-primary hover:text-primary"
                    >
                        <CgNotes />
                        Logs
                    </button>
                    <button
                        onClick={() => setOpenEditForm(true)}
                        className="flex items-center justify-center"
                    >
                        <FiEdit3 className="h-6 w-6 transition-all duration-200 hover:scale-110 hover:text-primary" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex items-center justify-center"
                    >
                        <MdDelete className="h-6 w-6 transition-all duration-200 hover:scale-110 hover:text-red-500" />
                    </button>
                </td>
            </tr>

            {showConnectors && (
                <ConnectorTable
                    chargePoint={chargePoint}
                    handleRefresh={handleRefresh}
                />
            )}
            <EditFormModal
                openForm={openEditForm}
                setOpenForm={setOpenEditForm}
                handleRefresh={handleRefresh}
                chargePoint={chargePoint}
            />
            <DetailsModal
                openForm={openDetails}
                setOpenForm={setOpenDetails}
                chargePoint={chargePoint}
            />
            <LogsModal
                openForm={showLogs}
                setOpenForm={setShowLogs}
                chargePoint={chargePoint}
            />
        </>
    );
};

export default TableRow;
