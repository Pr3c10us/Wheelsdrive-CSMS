import { HiPencil } from "react-icons/hi";
import { FiEdit3 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import EditFormModal from "./editFormModal";
import { useState } from "react";

const TableRow = ({ rate, handleRefresh }) => {
    const [openEditForm, setOpenEditForm] = useState(false);

    const handleDelete = async () => {
        await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}rate/${rate._id}`
        );
        handleRefresh();
    };
    return (
        <>
            <tr className="text-base">
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{rate.name}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{rate.description}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{rate.discount}%</span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{rate.price}</span>
                </td>
                <td className="flex gap-x-4 whitespace-nowrap px-4 py-4 font-medium text-text">
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
                rate={rate}
                handleRefresh={handleRefresh}
            />
        </>
    );
};

export default TableRow;
