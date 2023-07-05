import React from "react";

import TableRow from "./tableRow";

const ConnectorTable = ({ chargePoint, handleRefresh }) => {
    return (
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
                                Active
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
                                Power{" "}
                                <span className="text-xs text-white">
                                    {` `}(KwH)
                                </span>
                            </th>
                            <th className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                Rate
                                <span className="text-xs text-white">
                                    {` `}(₹)
                                </span>
                            </th>
                            <th className="whitespace-nowrap px-4 py-4 font-medium text-text">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 text-center">
                        {chargePoint.connectors.map((connector) => {
                            return (
                                <TableRow
                                    handleRefresh={handleRefresh}
                                    key={connector._id}
                                    connector={connector}
                                    chargePointId={chargePoint._id}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </td>
        </tr>
    );
};

export default ConnectorTable;
