import div from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { MdOutlineNaturePeople } from "react-icons/md";
import { SiHubspot } from "react-icons/si";

const SideBar = ({ openMenu, pages, PageIcon, setOpenMenu }) => {
    const pathname = usePathname();
    const router = useRouter();
    
    return (

        <section
            className={
                openMenu
                    ? "fixed inset-0 z-30 flex flex-col gap-6 border-b-4 border-b-primary bg-white px-4 py-20 transition-all duration-500 md:hidden"
                    : "fixed inset-0 z-30 flex -translate-y-full flex-col gap-6 border-b-4 border-b-primary bg-white px-10 py-20 transition-all duration-500 md:hidden"
            }
        >
            <div>
                <button
                    className={`flex items-center justify-center gap-x-6 text-xl font-medium ${
                        pathname.includes("hub") && "text-accent"
                    }`}
                >
                    <SiHubspot />
                    My Hub
                </button>
                <div className="pl-10">
                    {pages
                        .filter((page) => page.url.includes("hub"))
                        .map((page) => {
                            return (
                                <div
                                    key={page.id}
                                    className={`flex w-full cursor-pointer items-center gap-2 pb-0.5 pt-2 text-xl hover:text-accent ${
                                        pathname == page.url
                                            ? "border-b-2 border-b-accent text-accent"
                                            : " text-text"
                                    }`}
                                    onClick={() => {
                                        router.push(page.url);
                                        setOpenMenu(false);
                                    }}
                                >
                                    <PageIcon name={page.name} />
                                    {page.name}
                                </div>
                            );
                        })}
                </div>
            </div>
            <div>
                <button
                    className={`flex items-center justify-center gap-x-6 text-xl font-medium ${
                        pathname.includes("assets") && "text-accent"
                    }`}
                >
                    <MdOutlineNaturePeople />
                    My Assets
                </button>
                <div className="pl-10">
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
                                    className={`flex w-full cursor-pointer items-center gap-2 pb-0.5 pt-2 text-xl hover:text-accent ${
                                        pathname == page.url
                                            ? "border-b-2 border-b-accent text-accent"
                                            : " text-text"
                                    }`}
                                    onClick={() => {
                                        router.push(page.url);
                                        setOpenMenu(false);
                                    }}
                                >
                                    <PageIcon name={page.name} />
                                    {page.name}
                                </div>
                            );
                        })}
                </div>
            </div>
        </section>
    );
};

export default SideBar;
