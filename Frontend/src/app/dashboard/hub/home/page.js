"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DiHtml5Connectivity } from "react-icons/di";
import { BsEvStationFill, BsFillLightningFill } from "react-icons/bs";
import { HiLocationMarker } from "react-icons/hi";
import LineChart from "./components/chart";
import Map from "./components/map";

const Home = () => {
    const [dashboardData, setDashboardData] = useState({});
    const [loading, setLoading] = useState(false);

    const handleEffect = async () => {
        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}admin/dashboard/`
            );
            const dashboardData = response.data;
            setDashboardData(dashboardData);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        handleEffect();
    }, []);

    if (loading) {
        return <div>loading . . .</div>;
    }

    return (
        <main className="flex flex-col space-y-12 px-2 sm:px-0">
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <div className="flex flex-col items-center justify-center gap-y-2 rounded border border-primary px-4 py-6 font-semibold shadow-xl">
                    <span className="text-xs">Created ChargeStations</span>
                    <div className="flex items-center justify-center gap-x-1">
                        <BsEvStationFill
                            title="Connected"
                            className="h-5 w-5 text-primary"
                        />
                        <span>{dashboardData.totalChargePoints}</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 items-center justify-center gap-y-2 rounded border border-primary px-4 py-6 font-semibold shadow-xl">
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-xs">Online</span>
                        <div className="flex items-center justify-center gap-x-1">
                            <DiHtml5Connectivity
                                title="Connected"
                                className="h-7 w-7 text-green-400"
                            />
                            <span>
                                {dashboardData.totalConnectedChargePoints}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-xs">Offline</span>
                        <div className="flex items-center justify-center gap-x-1">
                            <DiHtml5Connectivity
                                title="Connected"
                                className="h-7 w-7 text-gray-400"
                            />
                            <span>
                                {dashboardData.totalDisconnectedChargePoints}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-y-2 rounded border border-primary px-4 py-6 font-semibold shadow-xl">
                    <span className="text-xs">Locations</span>
                    <div className="flex items-center justify-center gap-x-1">
                        <HiLocationMarker
                            title="Connected"
                            className="h-5 w-5 text-primary"
                        />
                        <span>{dashboardData.totalLocations}</span>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-y-2 rounded border border-primary px-4 py-6 font-semibold shadow-xl">
                    <span className="text-xs">Total Energy Delivered</span>
                    <div className="flex items-center justify-center gap-x-1">
                        <BsFillLightningFill
                            title="Connected"
                            className="h-5 w-5 text-primary"
                        />
                        <span>
                            {dashboardData.totalPower &&
                                Math.round(dashboardData.totalPower)}
                            <span className=" ml-1 text-xs font-normal">
                                Kw/h
                            </span>
                        </span>
                    </div>
                </div>
            </section>
            <section className="gap-6 space-y-6 xl:grid xl:grid-cols-2 xl:space-y-0">
                <div className="flex rounded border border-primary p-4">
                    <Map />
                </div>
                <LineChart type={"revenue"} />
                <LineChart type={"totalTransaction"} />
                <LineChart type={"power"} />
            </section>
        </main>
    );
};

export default Home;
