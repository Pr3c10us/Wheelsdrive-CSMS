import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MdOutlineNaturePeople } from "react-icons/md";
import { SiHubspot } from "react-icons/si";
import { BiSearch, BiLogOut } from "react-icons/bi";
import axios from "axios";

const NavBar = ({
    setOpenMenu,
    showSearch,
    setShowSearch,
    adminInfo,
    openMenu,
    pages,
    PageIcon,
}) => {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}admin/auth/logout`);
        router.push("/login/admin");
    };

    return (
        <nav className="flex py-1.5 md:py-0 relative bg-background shadow-lg z-40 px-4 border-b-2 border-b-primary items-center gap-x-6 ">
            <div className="flex flex-1 lg:justify-around items-center gap-4 ">
                <Link href="/" className="flex">
                    <Image
                        className="w-28 md:w-36"
                        src="/wheelsdrive.svg"
                        height={100}
                        width={100}
                        alt="logo-wheelsdrive"
                        priority
                    />
                </Link>
                <button className="hidden lg:flex h-min border-2 text-gray-400 border-primary py-1 px-2 rounded-md items-center justify-between w-96">
                    <span className="text-xl">Search</span>
                    <BiSearch className="w-6 h-6 " />
                </button>
            </div>
            <div className="hidden md:flex flex-1 items-center justify-center">
                <div className="flex w-80  items-center justify-center relative">
                    <div className={`relative flex justify-center flex-1 `}>
                        <button
                            className={`peer font-medium py-4 px-4 flex gap-x-2 justify-center items-center ${
                                pathname.includes("hub") && "text-accent "
                            }`}
                        >
                            {" "}
                            <SiHubspot />
                            Hub
                        </button>
                        <div className="hidden -translate-x-1/2 top-[90%] left-1/2 overflow-hidden border shadow-xl rounded-md bg-white absolute peer-hover:flex flex-col hover:flex z-20">
                            {pages
                                .filter((page) => page.url.includes("hub"))
                                .map((page) => {
                                    return (
                                        <div
                                            key={page.id}
                                            className="flex px-4 py-2 w-full items-center text-xl hover:text-accent cursor-pointer  gap-2"
                                            onClick={() =>
                                                router.push(page.url)
                                            }
                                        >
                                            <PageIcon name={page.name} />
                                            {page.name}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                    <div className={`relative flex justify-center flex-1`}>
                        <button
                            className={`peer font-medium py-4 px-4 flex gap-x-2 justify-center items-center ${
                                pathname.includes("assets") && "text-accent "
                            }`}
                        >
                            <MdOutlineNaturePeople />
                            Assets
                        </button>
                        <div className="hidden -translate-x-1/2 top-[90%] left-1/2 overflow-hidden border shadow-xl rounded-md bg-white absolute peer-hover:flex flex-col hover:flex z-20">
                            {pages
                                .filter(
                                    (page) =>
                                        page.url.includes("assets") &&
                                        page.name != "Rfids"
                                )
                                .map((page) => {
                                    return (
                                        <div
                                            key={page.id}
                                            className="flex px-6 py-2 w-full items-center text-lg hover:text-accent cursor-pointer  gap-2"
                                            onClick={() =>
                                                router.push(page.url)
                                            }
                                        >
                                            <PageIcon name={page.name} />
                                            {page.name}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                    <div
                        className={`w-40 bg-accent left-0 absolute bottom-0 h-1 transition-all duration-200 ${
                            pathname.includes("hub") && ""
                        } ${pathname.includes("assets") && "translate-x-40"}`}
                    ></div>
                </div>
            </div>
            <div className={`relative`}>
                <div className="peer w-20 grid place-content-center py-2   ">
                    <button
                        className={`gap-x-2 justify-center items-center w-9 h-9 bg-accent text-sm grid place-content-center font-semibold text-white rounded-full`}
                    >
                        {`${adminInfo.firstName.split("")[0]}${
                            adminInfo.lastName.split("")[0]
                        }`}
                    </button>
                </div>

                <div className="hidden space-y-2 px-4 py-2 -translate-x-2/3 md:-translate-x-[90%] left-1/4 overflow-hidden border shadow-xl rounded-md bg-white absolute peer-hover:flex flex-col hover:flex z-20">
                    <div className="flex items-center gap-x-4">
                        <div className="w-12 h-12 bg-accent grid place-content-center font-semibold text-white rounded-full">{`${
                            adminInfo.firstName.split("")[0]
                        }${adminInfo.lastName.split("")[0]}`}</div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-medium">
                                {adminInfo.email}
                            </h2>
                            <h3 className="">{adminInfo._id}</h3>
                            <h3 className="">{adminInfo.company}</h3>
                        </div>
                    </div>
                    <hr />
                    <button
                        onClick={handleLogout}
                        className="w-full hover:text-accent items-center text-lg gap-x-2 py-2 flex"
                    >
                        <BiLogOut />
                        Logout
                    </button>
                </div>
            </div>
            <button
                className="ml-auto space-y-1 md:hidden"
                onClick={() => setOpenMenu(!openMenu)}
            >
                <div
                    className={
                        openMenu
                            ? "h-[3px] w-7 translate-y-[7px] rotate-45 rounded-xl bg-black transition-all duration-300"
                            : "h-[3px] w-7 rounded-xl bg-black transition-all duration-300"
                    }
                ></div>
                <div
                    className={
                        openMenu
                            ? "h-[3px] w-7 rounded-xl bg-black opacity-0 transition-all duration-300 "
                            : "h-[3px] w-7 rounded-xl bg-black transition-all duration-300"
                    }
                ></div>
                <div
                    className={
                        openMenu
                            ? "m-0 h-[3px] w-7 -translate-y-[7px] -rotate-45 rounded-xl bg-black transition-all duration-300"
                            : "h-[3px] w-7 rounded-xl bg-black transition-all duration-300"
                    }
                ></div>
            </button>
        </nav>
    );
};

export default NavBar;
