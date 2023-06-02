import { HiPencil } from "react-icons/hi";
import { FiEdit3 } from "react-icons/fi";

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

const TableRow = ({ user, handleRefresh }) => {
    const [openEditForm, setOpenEditForm] = useState(false);
    const dispatch = useDispatch();

    const handleDelete = async () => {
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}apiUser/${user._id}`
            );
            handleRefresh();
        } catch (error) {
            if (error.response) {
                const errorMsg = error.response.data.msg;
                dispatch(changeErrorMessageType("Api user creation failed"));
                dispatch(changeErrorMessage(errorMsg));
                dispatch(changeShowErrorMessage(true));
            }
        }
    };
    return (
        <>
            <tr className="text-base">
                <td className="whitespace-nowrap px-4 py-2 font-medium text-text">
                    <span className="p-2">{user.username}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-text">
                    <span className="p-2">{user.firstName}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-text">
                    <span className="p-2">{user.lastName}</span>
                </td>
                <td className="grid place-content-center whitespace-nowrap px-4 py-2 font-medium text-text">
                    <span className="p-2 ">{user.email}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-text">
                    <span className="p-2 ">{user.mobile}</span>
                </td>
                <td className="flex gap-x-4 whitespace-nowrap px-4 py-2 font-medium text-text">
                    <button
                        onClick={() => setOpenEditForm(true)}
                        className="flex w-full items-center justify-center"
                    >
                        <FiEdit3 className="h-6 w-6 transition-all duration-200 hover:scale-110 hover:text-primary" />
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
                apiUser={user}
                handleRefresh={handleRefresh}
            />
        </>
    );
};

export default TableRow;
