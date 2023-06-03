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
        <nav className="relative z-40 flex items-center gap-x-6 border-b-2 border-b-primary bg-background px-4 py-1.5 shadow-lg md:py-0 ">
            <div className="flex flex-1 items-center gap-4 lg:justify-start lg:pl-8">
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
                {/* <button className="hidden lg:flex h-min border-2 text-gray-400 border-primary py-1 px-2 rounded-md items-center justify-between w-96">
                    <span className="text-xl">Search</span>
                    <BiSearch className="w-6 h-6 " />
                </button> */}
            </div>
            <div className="hidden flex-1 items-center justify-center md:flex">
                <div className="relative flex  w-80 items-center justify-center">
                    <div className={`relative flex flex-1 justify-center `}>
                        <button
                            className={`peer flex items-center justify-center gap-x-2 px-4 py-4 font-medium ${
                                pathname.includes("hub") && "text-accent "
                            }`}
                        >
                            {" "}
                            <SiHubspot />
                            Hub
                        </button>
                        <div className="absolute left-1/2 top-[90%] z-20 hidden -translate-x-1/2 flex-col overflow-hidden rounded-md border bg-white shadow-xl peer-hover:flex hover:flex">
                            {pages
                                .filter((page) => page.url.includes("hub"))
                                .map((page) => {
                                    return (
                                        <div
                                            key={page.id}
                                            className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-xl  hover:text-accent"
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
                    <div className={`relative flex flex-1 justify-center`}>
                        <button
                            className={`peer flex items-center justify-center gap-x-2 px-4 py-4 font-medium ${
                                pathname.includes("assets") && "text-accent "
                            }`}
                        >
                            <MdOutlineNaturePeople />
                            Assets
                        </button>
                        <div className="absolute left-1/2 top-[90%] z-20 hidden -translate-x-1/2 flex-col overflow-hidden rounded-md border bg-white shadow-xl peer-hover:flex hover:flex">
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
                                            className="flex w-full cursor-pointer items-center gap-2 px-6 py-2 text-lg  hover:text-accent"
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
                        className={`absolute bottom-0 left-0 h-1 w-40 bg-accent transition-all duration-200 ${
                            pathname.includes("hub") && ""
                        } ${pathname.includes("assets") && "translate-x-40"}`}
                    ></div>
                </div>
            </div>
            <div className={`relative`}>
                <div className="peer grid w-20 place-content-center py-2   ">
                    <button
                        className={`grid h-9 w-9 place-content-center items-center justify-center gap-x-2 rounded-full bg-accent text-sm font-semibold text-white`}
                    >
                        {`${adminInfo.firstName.split("")[0]}${
                            adminInfo.lastName.split("")[0]
                        }`}
                    </button>
                </div>

                <div className="absolute left-1/4 z-20 hidden -translate-x-2/3 flex-col space-y-2 overflow-hidden rounded-md border bg-white px-4 py-2 shadow-xl peer-hover:flex hover:flex md:-translate-x-[90%]">
                    <div className="flex items-center gap-x-4">
                        <div className="grid h-12 w-12 place-content-center rounded-full bg-accent font-semibold text-white">{`${
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
                        className="flex w-full items-center gap-x-2 py-2 text-lg hover:text-accent"
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
