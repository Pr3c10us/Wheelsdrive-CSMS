import { HiPencil } from "react-icons/hi";
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
            <tr>
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
                <td className="whitespace-nowrap gap-x-4 px-4 py-4 font-medium flex text-text">
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
                rate={rate}
                handleRefresh={handleRefresh}
            />
        </>
    );
};

export default TableRow;
