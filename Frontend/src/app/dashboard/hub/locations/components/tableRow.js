import { FiEdit3 } from "react-icons/fi";
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
            <tr className="text-base">
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
                    <span className="grid place-content-center p-2 text-lg">
                        {location.display ? (
                            <BsEyeFill className="text-lg text-green-400" />
                        ) : (
                            <BsEyeSlashFill className="text-lg text-gray-400" />
                        )}
                    </span>
                </td>
                <td className="flex w-full gap-x-2 whitespace-nowrap px-4 py-4 font-medium text-text">
                    {/* <button className="flex gap-x-2 border-primary hover:text-primary transition-all duration-200 hover:scale-105 border w-full py-2 px-2 rounded items-center justify-center">
                        <HiInformationCircle />
                        Details
                    </button>{" "} */}
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
            <EditFormModal
                openForm={openEditForm}
                setOpenForm={setOpenEditForm}
                location={location}
            />
        </>
    );
};

export default TableRow;
