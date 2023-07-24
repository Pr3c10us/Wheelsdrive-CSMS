import React, { useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useEffect } from "react";
import axios from "axios";

const Map = () => {
    const [location, setLocation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [map, setMap] = useState(null);

    const handleEffect = async () => {
        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}location/admin`
            );
            const { locations } = response.data;
            console.log({ response, locations });

            // create a new array of objects with the location that consists of lat and lng of each location
            const location = locations.map((location) => {
                return {
                    lat: Number(location.latitude),
                    lng: Number(location.longitude),
                };
            });
            setLocation(location);

            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleEffect();
    }, []);

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    });

    const onLoad = React.useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(location[0]);
        map.fitBounds(bounds);

        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

    const containerStyle = {
        width: "100%",
        height: "100%",
        minHeight: "24rem",
    };

    return (
        <div className="w-full ">
            {isLoaded ? (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={location[0]}
                    zoom={10}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                >
                    {/* Child components, such as markers, info windows, etc. */}
                    {location.map((location) => {
                        return (
                            <Marker
                                key={location.lat}
                                position={location}
                                // icon={{
                                //     url: "/images/charging-station.png",
                                //     scaledSize: new window.google.maps.Size(
                                //         30,
                                //         30
                                //     ),
                                // }}
                            />
                        );
                    })}
                </GoogleMap>
            ) : (
                <div className="w-full"></div>
            )}
        </div>
    );
};

export default Map;
