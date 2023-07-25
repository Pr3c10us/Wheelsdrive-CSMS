import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";

const LogsModal = ({ openForm, setOpenForm, chargePoint }) => {
    const adminInfo = useSelector((state) => state.adminDetails.adminInfo);
    const [logs, setLogs] = useState([]);

    const handleEffect = async () => {
        axios.defaults.withCredentials = true;
        try {
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}logs?limit=10&page=1&chargePoint=${chargePoint._id}`
            );
            setLogs(data.logs);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleEffect();
    }, []);

    return (
        <>
            {openForm && (
                <div
                    className={`fixed inset-0 z-50 grid overflow-auto px-4 py-4 text-left`}
                >
                    <div
                        onClick={() => setOpenForm(false)}
                        className={`fixed bottom-0 left-0 right-0 top-0 z-50 bg-primary bg-opacity-20 backdrop-blur-sm`}
                    ></div>

                    <form
                        className={`relative z-[60] grid w-full grid-cols-1 gap-x-8 gap-y-3 place-self-center rounded-xl bg-white p-10 shadow-lg transition-all duration-500 sm:max-w-3xl`}
                    >
                        <div className="col-span-2 mb-4 flex w-full flex-col gap-2">
                            <div className="flex w-full items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    ChargePoint {chargePoint.name} Recent Logs
                                </h2>
                                <FaTimes
                                    onClick={() => setOpenForm(false)}
                                    className="h-10 cursor-pointer"
                                />
                            </div>
                            <hr />
                        </div>
                        {logs.length > 0 ? (
                            <div className="col-span-2 mb-4 flex w-full flex-col gap-y-4 rounded bg-black text-white last:border-none">
                                {logs.map((log) => {
                                    return (
                                        <div className="flex w-full flex-col text-base border-b border-white p-4">
                                            <h2 className="font-semibold">
                                                <span className="text-sm font-semibold text-accent">
                                                    message :
                                                </span>{" "}
                                                {log.message}
                                            </h2>
                                            <h2 className="font-semibold">
                                                <span className="text-sm font-semibold text-accent">
                                                    origin :
                                                </span>{" "}
                                                {log.origin}
                                            </h2>
                                            {log.result && (
                                                <pre className="text-left">
                                                    <span className="text-sm font-semibold text-accent">
                                                        payload :
                                                    </span>{" "}
                                                    {JSON.stringify(
                                                        JSON.parse(log.result),
                                                        null,
                                                        2
                                                    )}
                                                </pre>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <h1>No Logs Found</h1>
                        )}
                    </form>
                </div>
            )}
        </>
    );
};

export default LogsModal;
