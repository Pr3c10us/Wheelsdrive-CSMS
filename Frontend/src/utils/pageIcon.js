import React from "react";
import { HiHome } from "react-icons/hi2";
import { HiLocationMarker,HiUsers } from "react-icons/hi";
import { BsEvStationFill, BsCashStack } from "react-icons/bs";
import { MdHistory } from "react-icons/md";
import { CgNotes } from "react-icons/cg";

const PageIcon = ({ name }) => {
    if (name == "Home") {
        return <HiHome className="text-base" />;
    }
    if (name == "Locations") {
        return <HiLocationMarker className="text-base" />;
    }
    if (name == "ChargeStations") {
        return <BsEvStationFill className="text-base" />;
    }
    if (name == "Sessions") {
        return <MdHistory className="text-base" />;
    }
    if (name == "Logs") {
        return <CgNotes className="text-base" />;
    }
    if (name == "Users") {
        return <HiUsers className="text-base" />;
    }
    if (name == "Rfids") {
        return <HiUsers className="text-base" />;
    }
    if (name == "Rates") {
        return <BsCashStack className="text-base" />;
    }
};

export default PageIcon;
