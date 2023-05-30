import { HiBan, HiPencil } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import EditFormModal from "./editFormModal";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
    changeErrorMessage,
    changeErrorMessageType,
    changeShowErrorMessage,
} from "@/redux/errorMessage";
import { LuCircleSlash2 } from "react-icons/lu";
import { FaCircle } from "react-icons/fa";

const TableRow = ({ rfid, handleRefresh }) => {
    const [openEditForm, setOpenEditForm] = useState(false);
    const dispatch = useDispatch();

    const handleDelete = async () => {
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}rfid/${rfid._id}`
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
                <td className="whitespace-nowrap px-4 py-2 font-medium text-text">
                    <span className="p-2">{rfid.name}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-text">
                    <span className="p-2">{rfid.rfid}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-text">
                    <span className="p-2">
                        {rfid.expires && new Date(rfid.expires).toDateString()}
                    </span>
                </td>
                <td className="grid place-content-center whitespace-nowrap px-4 py-2 font-medium text-text">
                    <span className="p-2">
                        {rfid.blocked ? (
                            <LuCircleSlash2 className="h-5 w-5 text-red-500" />
                        ) : (
                            <FaCircle className="h-5 w-5 text-green-500" />
                        )}
                    </span>
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-text">
                    <span className="p-2">{rfid.parentRFID}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-text">
                    <span className="p-2">{rfid.apiUser.username}</span>
                </td>
                <td className="flex gap-x-4 whitespace-nowrap px-4 py-2 font-medium text-text">
                    <button
                        onClick={() => setOpenEditForm(true)}
                        className="flex w-full items-center justify-center"
                    >
                        <HiPencil className="h-6 w-6 transition-all duration-200 hover:scale-110 hover:text-primary" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex w-full items-center justify-center"
                    >
                        <MdDelete className="h-6 w-6 transition-all duration-200 hover:scale-110 hover:text-red-500" />
                    </button>
                </td>
            </tr>
            <EditFormModal
                openForm={openEditForm}
                setOpenForm={setOpenEditForm}
                rfid={rfid}
                handleRefresh={handleRefresh}
            />
        </>
    );
};

export default TableRow;
