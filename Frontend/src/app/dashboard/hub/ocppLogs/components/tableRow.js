import { FiEdit3 } from "react-icons/fi";
import { GrMonitor } from "react-icons/gr";
import { MdEvStation } from "react-icons/md";

const TableRow = ({ logs }) => {
    return (
        <>
            <tr className="text-sm">
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    <span className="p-2">
                        {new Date(logs.createdAt).toUTCString()}
                    </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text">
                    {logs.origin == "charger" && <MdEvStation  className="w-6 h-6" />}
                    {logs.origin == "csms" && <GrMonitor className="w-6 h-6" />}
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
        </>
    );
};

export default TableRow;
