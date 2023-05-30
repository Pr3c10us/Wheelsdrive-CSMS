import { useEffect, useState } from "react";
import {
    HiOutlineStatusOnline,
    HiInformationCircle,
    HiPencil,
} from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { HiMinus, HiPlus } from "react-icons/hi2";

const TableRow = ({ chargePoint }) => {
    const [showConnectors, setShowConnectors] = useState(false);

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
                        <HiOutlineStatusOnline className="text-2xl text-green-400" />
                    ) : (
                        <HiOutlineStatusOnline className="text-2xl text-gray-400" />
                    )}
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2 ">
                        {chargePoint.connectors.length}
                    </span>
                </td>
                <td className="flex gap-x-2 whitespace-nowrap px-4 py-4 font-medium text-text">
                    <button className="flex w-full items-center justify-center gap-x-2 rounded border border-primary px-2 py-2">
                        <HiInformationCircle />
                        Details
                    </button>{" "}
                    <button className="flex w-full items-center justify-center gap-x-2 rounded border border-primary px-2 py-2">
                        <HiPencil />
                        Edit
                    </button>
                    <button className="flex w-full items-center justify-center gap-x-2 rounded border border-primary px-2 py-2">
                        <MdDelete /> Delete
                    </button>
                </td>
            </tr>

            {showConnectors && (
                <tr id="jane-doe-details" className="">
                    <td colSpan="7" className="p-8">
                        {/* Another table with details for Jane Doe */}
                        <table className="min-w-full">
                            <thead className="ltr:text-left rtl:text-right">
                                <tr className="bg-primary bg-opacity-25 font-medium">
                                    <th className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                        Connector Id
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                        Status
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                        Format
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                        Type
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                        PowerType
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                        Power
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 text-center">
                                {chargePoint.connectors.map((connector) => {
                                    return (
                                        <tr className="text-base">
                                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                                <span className="p-2">
                                                    {connector.connectorId}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                                <span className="p-2">
                                                    {connector.lastStatus}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                                <span className="p-2">
                                                    {connector.format}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                                <span className="p-2">
                                                    {connector.type}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                                <span className="p-2">
                                                    {connector.powerType}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                                <span className="p-2">
                                                    {connector.power}
                                                </span>
                                            </td>
                                            <td className="flex gap-x-2 whitespace-nowrap px-4 py-4 font-medium text-text">
                                                <button className="flex w-full items-center justify-center gap-x-2 rounded border border-primary px-2 py-2">
                                                    <HiInformationCircle />
                                                    Details
                                                </button>{" "}
                                                <button className="flex w-full items-center justify-center gap-x-2 rounded border border-primary px-2 py-2">
                                                    <HiPencil />
                                                    Edit
                                                </button>
                                                <button className="flex w-full items-center justify-center gap-x-2 rounded border border-primary px-2 py-2">
                                                    <MdDelete /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </td>
                </tr>
            )}
        </>
    );
};

export default TableRow;
