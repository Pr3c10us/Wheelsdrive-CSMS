import React from "react";
import JsPDF from "jspdf";
import { FaTimes } from "react-icons/fa";
import { IoMdDoneAll } from "react-icons/io";
import { LuPlugZap } from "react-icons/lu";

const PDF = ({ setShowReceipt, showReceipt, sessions }) => {
    const generatePDF = () => {
        // const report = new JsPDF("portrait", "pt", "a4");
        // report.html(document.querySelector("#report")).then(() => {
        //     report.save("report.pdf");
        // });
         const doc = new JsPDF();

         const yPosIncrement = 10;

         let yPos = 20;

         doc.setFontSize(18);
         doc.text("Wheelsdrive Receipt", 105, yPos, { align: "center" });

         yPos += yPosIncrement;

         // Iterate through session details and add them to the PDF
         const sessionDetails = [
             { label: "Transaction Id :", value: sessions.transactionUniqueId },
             {
                 label: "Start Time :",
                 value: new Date(sessions.startTime).toUTCString(),
             },
             {
                 label: "Stop Time :",
                 value: new Date(sessions.stopTime).toUTCString(),
             },
             {
                 label: "Status :",
                 value: !sessions.stopTime ? "Ongoing" : "Completed",
             },
             {
                 label: "Location Name :",
                 value: sessions.chargePoint ? sessions.location.name : "",
             },
             {
                 label: "Charge Station :",
                 value: sessions.chargePoint
                     ? sessions.chargePoint.endpoint
                     : "",
             },
             {
                 label: "Duration :",
                 value: sessions.stopTime
                     ? `${
                           Math.round(
                               ((new Date(sessions.stopTime).getTime() -
                                   new Date(sessions.startTime).getTime()) /
                                   (1000 * 60 * 60)) *
                                   100
                           ) / 100
                       } hours`
                     : 0,
             },
             {
                 label: "Total Energy :",
                 value: sessions.totalEnergy
                     ? `${Math.round(sessions.totalEnergy * 100) / 100} kWh`
                     : 0,
             },
             {
                 label: "Total Cost :",
                 value: sessions.cost
                     ? `$${Math.round(sessions.cost * 100) / 100}`
                     : 0,
             },
         ];

         sessionDetails.forEach((detail) => {
             doc.setFontSize(14);
             doc.text(`${detail.label} ${detail.value}`, 10, yPos, );
             yPos += yPosIncrement;
         });

         doc.save("receipt.pdf");
    };
    return (
        <div
            className={`fixed inset-0 z-50 grid overflow-auto px-4 py-4 sm:overflow-visible sm:px-8 sm:py-0`}
        >
            <div
                onClick={() => setShowReceipt(false)}
                className={`fixed bottom-0 left-0 right-0 top-0 z-50 bg-primary bg-opacity-20 backdrop-blur-sm`}
            ></div>
            <div
                id="report"
                className={`relative z-[60] grid w-full gap-x-8 gap-y-3 place-self-center rounded-xl bg-white px-4 py-10 shadow-lg transition-all duration-500 sm:max-w-2xl  sm:px-10 `}
            >
                <div className="flex w-full flex-col gap-2 ">
                    <div className="flex w-full items-center justify-between">
                        <h2 className="text-2xl font-semibold">
                            Session receipt
                        </h2>
                        <FaTimes
                            onClick={() => setShowReceipt(false)}
                            className="h-10 cursor-pointer"
                        />
                    </div>
                    <hr />
                </div>
                <div className="">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Transaction Id :
                        </h2>
                        <p className="whitespace-nowrap px-4 py-4 font-medium text-text">
                            <span className="p-2">
                                {sessions.transactionUniqueId}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Start Time :</h2>
                        <p className=" whitespace-nowrap break-words px-4 py-4 font-medium text-text">
                            {sessions.startTime &&
                                new Date(sessions.startTime).toUTCString()}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Stop Time :</h2>
                        <p className="whitespace-nowrap px-4 py-4 font-medium text-text">
                            {sessions.stopTime &&
                                new Date(sessions.stopTime).toUTCString()}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Status :</h2>
                        <p className="grid place-content-center whitespace-nowrap px-4 py-4 font-medium text-text">
                            {!sessions.stopTime ? (
                                <LuPlugZap className="h-6 w-6 text-accent" />
                            ) : (
                                <IoMdDoneAll className="h-6 w-6 text-green-400" />
                            )}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Location Name :
                        </h2>
                        <p className="whitespace-nowrap px-4 py-4 font-medium text-text">
                            {sessions.chargePoint && (
                                <span className="p-2">
                                    {sessions.location.name}
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Charge Station :
                        </h2>
                        <p className="whitespace-nowrap px-4 py-4 font-medium text-text">
                            {sessions.chargePoint && (
                                <span className="p-2">
                                    {sessions.chargePoint.endpoint}
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Duration :</h2>
                        <p className="whitespace-nowrap px-4 py-4 font-medium text-text">
                            {sessions.stopTime && (
                                <span className="p-2">
                                    {Math.round(
                                        ((new Date(
                                            sessions.stopTime
                                        ).getTime() -
                                            new Date(
                                                sessions.startTime
                                            ).getTime()) /
                                            (1000 * 60 * 60)) *
                                            100
                                    ) / 100}
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Total Energy :
                        </h2>
                        <p className="whitespace-nowrap px-4 py-4 font-medium text-text">
                            {sessions.totalEnergy && (
                                <span>
                                    {Math.round(sessions.totalEnergy * 100) /
                                        100}
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Total Cost :</h2>
                        <p className="whitespace-nowrap px-4 py-4 font-medium text-text">
                            {sessions.cost && (
                                <span>
                                    {Math.round(sessions.cost * 100) / 100}
                                </span>
                            )}
                        </p>
                    </div>
                    <p className="whitespace-nowrap px-4 py-4 font-medium text-text">
                        <button
                            className="rounded bg-primary px-6 py-2 text-white"
                            onClick={() => generatePDF()}
                        >
                            Download receipt{" "}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PDF;
