import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
const containerStyle = {
    width: "100%",
    height: "400px",
};

const DetailsModal = ({ openForm, setOpenForm, chargePoint }) => {
    const [info, setInfo] = useState([]);
    const [map, setMap] = useState(null);

    const [location, setLocation] = useState({
        lat: Number(chargePoint.location.latitude),
        lng: Number(chargePoint.location.longitude),
    });

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    });

    const onLoad = React.useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(location);
        map.fitBounds(bounds);

        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

    const handleEffect = () => {
        console.log(location);
        const info = [
            {
                name: "Name",
                value: chargePoint.name,
            },
            {
                name: "Endpoint",
                value: chargePoint.endpoint,
            },
            {
                name: "ClientCertificate",
                value: chargePoint.clientCertificate,
            },

            {
                name: "Connected",
                value: chargePoint.isConnected ? "Yes" : "No",
            },
            {
                name: "Display",
                value: chargePoint.display ? "Yes" : "No",
            },
            {
                name: "Number of Connectors",
                value: chargePoint.connectors.length,
            },
            {
                name: "FirmwareVersion",
                value: chargePoint.firmwareVersion,
            },
            {
                name: "ICCID",
                value: chargePoint.iccid,
            },
            {
                name: "IMSI",
                value: chargePoint.imsi,
            },
            {
                name: "Model",
                value: chargePoint.model,
            },
            {
                name: "OCPP Version",
                value: chargePoint.ocppVersion,
            },
            {
                name: "Serial Number",
                value: chargePoint.serialNumber,
            },
            {
                name: "Vendor",
                value: chargePoint.vendor,
            },
            {
                name: "Notes",
                value: chargePoint.notes,
            },
        ];
        setInfo(info);
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
                        className={`relative z-[60] grid w-full grid-cols-1 gap-x-8 gap-y-3 place-self-center rounded-xl bg-white p-10 shadow-lg transition-all duration-500 sm:max-w-2xl`}
                    >
                        <div className="mb-4 flex w-full flex-col gap-2 sm:col-span-2">
                            <div className="flex w-full items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    ChargeStation Details
                                </h2>
                                <FaTimes
                                    onClick={() => setOpenForm(false)}
                                    className="h-10 cursor-pointer"
                                />
                            </div>
                            <hr />
                        </div>
                        <div className="flex w-full flex-col items-center justify-center gap-y-4 text-center text-lg">
                            {info.map((D, index) => {
                                    return (
                                    <div
                                        key={index}
                                        className="flex w-full items-center justify-between"
                                    >
                                        <span className="font-medium">
                                            {D.name} :
                                        </span>
                                        <span>{D.value}</span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="w-full sm:col-span-2">
                            {isLoaded ? (
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={location}
                                zoom={10}
                                onLoad={onLoad}
                                onUnmount={onUnmount}
                            >
                                {/* Child components, such as markers, info windows, etc. */}
                                 <Marker position={location} />
                            </GoogleMap>
                        ) : (
                            <></>
                        )}
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default DetailsModal;
