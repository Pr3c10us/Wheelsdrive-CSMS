import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Legend,
    Tooltip,
    Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Filler
);

const LineChart = ({ type }) => {
    const [key, setKey] = useState([]);
    const [value, setValue] = useState([]);
    const [dateType, setDateType] = useState("day");

    const handleEffect = async (req, res) => {
        axios.defaults.withCredentials = true;
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}admin/dashboard/${type}?type=${dateType}`
        );
        let data = await response.data;

        // const key = data.slice(0, 7).map((value, index) => {
        //     return value._id;
        // });
        // if dateType is day, then create a new array with last 30 days date and then create a new array of the same length with values that matches the date
        if (dateType === "day") {
            let date = new Date();
            let last30Days = [];
            let last30DaysValues = [];
            for (let i = 0; i < 30; i++) {
                let dateStr = date.toISOString().slice(0, 10);
                let formattedDate = date.toDateString();
                last30Days.push(dateStr);
                let value = data.find((value) => value._id === dateStr);
                if (value) {
                    last30DaysValues.push(value[`${type}`]);
                } else {
                    last30DaysValues.push(0);
                }
                date.setDate(date.getDate() - 1);
            }
            setKey(last30Days);
            setValue(last30DaysValues);
        }
        // if dateType is month, then create a new array with last 12 months date and then create a new array of the same length with values that matches the date
        else if (dateType === "month") {
            let date = new Date();
            let last12Months = [];
            let last12MonthsValues = [];
            for (let i = 0; i < 12; i++) {
                let dateStr = date.toISOString().slice(0, 7);
                let formattedDate = date.toLocaleString("default", {
                    month: "short",
                });
                last12Months.push(formattedDate);
                let value = data.find((value) => value._id === dateStr);
                if (value) {
                    last12MonthsValues.push(value[`${type}`]);
                } else {
                    last12MonthsValues.push(0);
                }
                date.setMonth(date.getMonth() - 1);
            }
            setKey(last12Months);
            setValue(last12MonthsValues);
        }
    };
    useEffect(() => {
        handleEffect();
    }, []);
    useEffect(() => {
        handleEffect();
    }, [dateType]);

    const data = {
        labels: key,
        datasets: [
            {
                data: value,
                backgroundColor: "#191970",
                borderColor: "#191970",
                borderWidth: 1,
                pointBorderColor: "transparent",
                pointBorderWidth: 5,
                tension: 0,
                pointRadius: 1,
            },
        ],
    };

    const options = {
        interaction: {
            intersect: false,
            mode: "index",
        },
        plugins: {
            legend: false,
            tooltip: {
                backgroundColor: "#ed5331",
                titleFont: {
                    size: "10",
                },
                displayColors: false,
            },
        },
        scales: {
            x: {
                border: { display: true },
                grid: {
                    display: true,
                },
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 5,
                },
                reverse: true,
            },
            y: {
                // min: 100,
                border: { display: true },

                ticks: {
                    display: true,
                },
                grid: {
                    display: true,
                },
            },
        },
        beginAtZero: true,
    };
    return (
        <div className="flex flex-col gap-y-4 rounded border border-primary p-4">
            <div className="flex justify-between">
                <div className="flex w-full">
                    <h1 className="sm:text-xl font-semibold text-text">
                        {type === "power" && "Total Energy"}
                        {type === "revenue" && "Revenue "}
                        {type === "totalTransaction" && "Total Transactions"}
                    </h1>
                </div>
                <div className="p-y-1 flex w-full items-center justify-end gap-2">
                    <button
                        onClick={() => setDateType("day")}
                        className={`${
                            dateType === "day"
                                ? "border bg-primary text-white"
                                : "border bg-secondary"
                        } w-16 rounded border-primary py-1`}
                    >
                        Day
                    </button>

                    <button
                        onClick={() => setDateType("month")}
                        className={`${
                            dateType === "month"
                                ? "bg-primary text-white"
                                : "border bg-secondary"
                        } w-16 rounded border-primary py-1`}
                    >
                        Month
                    </button>
                </div>
            </div>
            <Line className="" data={data} options={options} />
        </div>
    );
};

export default LineChart;
