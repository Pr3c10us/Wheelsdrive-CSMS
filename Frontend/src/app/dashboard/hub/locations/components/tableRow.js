import { HiInformationCircle, HiPencil } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import axios from "axios";
import { useState } from "react";
import EditFormModal from "./editFormModal";

const TableRow = ({ location }) => {
    const [openEditForm, setOpenEditForm] = useState(false);
    const handleDelete = async () => {
        await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}location/admin/${location._id}`
        );
    };
    return (
        <>
            <tr>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{location.name}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{location.address}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{location.city}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="text-lg p-2 grid place-content-center">
                        {location.display ? (
                            <BsEyeFill className="text-green-400 text-lg" />
                        ) : (
                            <BsEyeSlashFill className="text-gray-400 text-lg" />
                        )}
                    </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium flex w-full text-text gap-x-2">
                    {/* <button className="flex gap-x-2 border-primary hover:text-primary transition-all duration-200 hover:scale-105 border w-full py-2 px-2 rounded items-center justify-center">
                        <HiInformationCircle />
                        Details
                    </button>{" "} */}
                    <button
                        onClick={() => setOpenEditForm(true)}
                        className="flex gap-x-2 flex-1 border-black hover:border-primary border-2 hover:text-primary transition-all duration-200 hover:scale-105 w-24 py-2 px-2 rounded items-center justify-center"
                    >
                        <HiPencil />
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex gap-x-2 flex-1 border-black border-2 hover:border-red-500 hover:text-red-500 transition-all duration-200 hover:scale-105 w-24 py-2 px-2 rounded items-center justify-center"
                    >
                        <MdDelete /> Delete
                    </button>
                </td>
            </tr>
            <EditFormModal
                openForm={openEditForm}
                setOpenForm={setOpenEditForm}
                location={location}
            />
        </>
    );
};

export default TableRow;
