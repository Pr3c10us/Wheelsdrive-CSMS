import { MdDelete } from "react-icons/md";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useState } from "react";
import { LuPlugZap } from "react-icons/lu";
import { IoMdDoneAll } from "react-icons/io";

const TableRow = ({ sessions }) => {
    return (
        <>
            <tr className="text-xs">
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{sessions.transactionUniqueId}</span>
                </td> 
                <td className="w-[50px] whitespace-nowrap break-words px-4 py-4 font-medium text-text">
                    {sessions.startTime &&
                        new Date(sessions.startTime).toUTCString()}
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    {sessions.stopTime &&
                        new Date(sessions.stopTime).toUTCString()}
                </td>
                <td className="grid place-content-center whitespace-nowrap px-4 py-4 font-medium text-text">
                    {!sessions.stopTime ? (
                        <LuPlugZap className="h-6 w-6 text-accent" />
                    ) : (
                        <IoMdDoneAll className="h-6 w-6 text-green-400" />
                    )}
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    {sessions.chargePoint && (
                        <span className="p-2">{sessions.location.name}</span>
                    )}
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    {sessions.chargePoint && (
                        <span className="p-2">
                            {sessions.chargePoint.endpoint}
                        </span>
                    )}
                </td>

                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    {sessions.stopTime && (
                        <span className="p-2">
                            {Math.round(
                                ((new Date(sessions.stopTime).getTime() -
                                    new Date(sessions.startTime).getTime()) /
                                    (1000 * 60 * 60)) *
                                    100
                            ) / 100}
                        </span>
                    )}
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    {sessions.totalEnergy && (
                        <span className="p-2">
                            {Math.round(sessions.totalEnergy * 100) / 100}
                        </span>
                    )}
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    {sessions.cost && (
                        <span className="p-2">
                            {Math.round(sessions.cost * 100) / 100}
                        </span>
                    )}
                </td>
            </tr>
        </>
    );
};

export default TableRow;
