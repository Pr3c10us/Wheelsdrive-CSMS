import { FiEdit3 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useState } from "react";

const TableRow = ({ sessions }) => {
    return (
        <>
            <tr className="text-xs">
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{sessions._id}</span>
                </td>
                <td className="w-[50px] whitespace-nowrap break-words px-4 py-4 font-medium text-text">
                        {sessions.startTime &&
                            new Date(sessions.startTime).toUTCString()}
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                        {sessions.stopTime &&
                            new Date(sessions.stopTime).toUTCString()}
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    {!sessions.stopTime ? (
                        <span className="p-2 text-accent">In-Progress</span>
                    ) : (
                        <span className="p-2 text-primary">Completed</span>
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
                            { (new Date(sessions.stopTime).getTime() -
                                 new Date(sessions.startTime).getTime()) / (1000 * 60 * 60)}
                        </span>
                    )}
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{sessions.totalEnergy}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{sessions.cost}</span>
                </td>
            </tr>
        </>
    );
};

export default TableRow;
