import { HiMinus, HiPlus } from "react-icons/hi2";
import { GrMonitor } from "react-icons/gr";
import { MdEvStation } from "react-icons/md";
import { useState } from "react";

const TableRow = ({ logs }) => {
    const [showResult, setShowResult] = useState(false);

    return (
        <>
            <tr className="text-sm">
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    {logs.result && (
                        <button onClick={() => setShowResult(!showResult)}>
                            {!showResult ? <HiPlus className="w-5 h-5" /> : <HiMinus className="w-5 h-5" />}
                        </button>
                    )}
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">
                        {new Date(logs.createdAt).toUTCString()}
                    </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    {logs.origin == "charger" && (
                        <MdEvStation className="h-6 w-6" />
                    )}
                    {logs.origin == "csms" && <GrMonitor className="h-6 w-6" />}
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    {logs.chargePoint && (
                        <span className="p-2">{logs.chargePoint.endpoint}</span>
                    )}
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{logs.message}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">{logs.errorCode}</span>
                </td>
            </tr>
            {showResult && logs.result && (
                <tr className="text-xs">
                    <td colSpan="6" className="bg-gray-100 px-8 py-2">
                        <pre className="text-left">
                            <span className="text-sm font-semibold text-primary">
                                payload :
                            </span>{" "}
                            {JSON.stringify(JSON.parse(logs.result), null, 2)}
                        </pre>
                    </td>
                </tr>
            )}
        </>
    );
};

export default TableRow;
