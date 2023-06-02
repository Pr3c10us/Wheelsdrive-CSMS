import React from "react";
import { FiEdit3 } from "react-icons/fi";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { HiOutlineStatusOnline } from "react-icons/hi";
import EditFormModal from "./editFormModal";

const TableRow = ({ connector, handleRefresh }) => {
    const [openForm, setOpenForm] = React.useState(false);
    return (
        <>
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
                <td className="flex items-center justify-center gap-x-2 whitespace-nowrap px-4 py-4 font-medium text-text">
                    <button
                        onClick={() => setOpenForm(true)}
                        className="flex w-full items-center justify-center gap-x-2 rounded border border-black px-2 py-2"
                    >
                        <FiEdit3 className="text-xl transition-all duration-200 " />
                        Edit
                    </button>
                    <button className="flex items-center justify-end">
                        <BiDotsVerticalRounded className="text-3xl transition-all duration-200" />
                    </button>
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
