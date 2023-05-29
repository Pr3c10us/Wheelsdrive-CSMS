import { HiPencil } from "react-icons/hi";
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
            <tr>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-text">
                    <span className="p-2">{user.username}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-text">
                    <span className="p-2">{user.firstName}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-text">
                    <span className="p-2">{user.lastName}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-2 grid place-content-center font-medium text-text">
                    <span className="text-lg p-2">{user.email}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-text">
                    <span className="text-lg p-2">{user.mobile}</span>
                </td>
                <td className="whitespace-nowrap gap-x-4 px-4 py-2 font-medium flex text-text">
                    <button
                        onClick={() => setOpenEditForm(true)}
                        className="flex w-full items-center justify-center"
                    >
                        <HiPencil className="h-6 w-6 hover:text-primary transition-all duration-200 hover:scale-110" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex w-full items-center justify-center"
                    >
                        <MdDelete className="h-6 w-6 hover:text-red-500 transition-all duration-200 hover:scale-110" />
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
