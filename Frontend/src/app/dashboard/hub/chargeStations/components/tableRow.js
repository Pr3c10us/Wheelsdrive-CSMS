import { useEffect, useState } from "react";
import { HiOutlineStatusOnline, HiInformationCircle } from "react-icons/hi";
import { IoMdPower } from "react-icons/io";
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

const TableRow = ({ chargePoint, handleRefresh }) => {
    const [openEditForm, setOpenEditForm] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [showConnectors, setShowConnectors] = useState(false);
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
                        <IoMdPower className="text-2xl text-green-400" />
                    ) : (
                        <IoMdPower className="text-2xl text-gray-400" />
                    )}
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2 ">
                        {chargePoint.connectors.length}
                    </span>
                </td>
                <td className="flex w-full gap-x-2 whitespace-nowrap px-4 py-4 font-medium text-text">
                    <button
                        onClick={() => setOpenDetails(true)}
                        className="flex w-24 flex-1 items-center justify-center gap-x-2 rounded border border-black px-2 py-2 transition-all duration-200 hover:scale-105 hover:border-primary hover:text-primary"
                    >
                        <HiInformationCircle />
                        Details
                    </button>
                    <button
                        onClick={() => setOpenEditForm(true)}
                        className="flex w-24 flex-1 items-center justify-center gap-x-2 rounded border border-black px-2 py-2 transition-all duration-200 hover:scale-105 hover:border-primary hover:text-primary"
                    >
                        <FiEdit3 />
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex w-24 flex-1 items-center justify-center gap-x-2 rounded border border-black px-2 py-2 transition-all duration-200 hover:scale-105 hover:border-red-500 hover:text-red-500"
                    >
                        <MdDelete /> Delete
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
        </>
    );
};

export default TableRow;