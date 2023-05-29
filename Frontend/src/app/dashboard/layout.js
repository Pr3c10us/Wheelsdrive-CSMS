"use client";
import { useRouter, usePathname } from "next/navigation";
import { Children, useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { createAdminInfo } from "@/redux/adminDetails";
import pages from "@/utils/pages";
import PageIcon from "@/utils/pageIcon";
import SideBar from "@/utils/sideBar";
import NavBar from "@/utils/navBar";
import div from "next/link";
import BreadCrumb from "@/utils/breadCrumb";

const Layout = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [showSearch, setShowSearch] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    const handleEffect = async (req, res) => {
        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}admin/details/`
            );
            const { admin } = response.data;

            // if (!admin.isVerified) {
            //     router.push("/verifyAccount");
            // }
            dispatch(createAdminInfo(admin));
            setLoading(false);
        } catch (error) {
            router.push("/login/admin");
        }
    };
    useEffect(() => {
        handleEffect();
    }, []);

    const adminInfo = useSelector((state) => state.adminDetails.adminInfo);

    if (loading) {
        return <div>loading . . .</div>;
    }
    return (
        <main className="h-full flex flex-col">
            <SideBar openMenu={openMenu} pages={pages} PageIcon={PageIcon} />
            <NavBar
                setOpenMenu={setOpenMenu}
                adminInfo={adminInfo}
                openMenu={openMenu}
                pages={pages}
                PageIcon={PageIcon}
                showSearch={showSearch}
                setShowSearch={setShowSearch}
            />
            <section className="bg-secondary overflow-auto h-full flex">
                <div className="w-80 pt-8 h-full px-8 hidden space-y-4 items-center lg:flex flex-col">
                    <BreadCrumb />
                    {pathname.includes("hub") && (
                        <div className="bg-white border overflow-hidden shadow-xl w-full rounded border-primary ">
                            {pages
                                .filter((page) => page.url.includes("hub"))
                                .map((page) => {
                                    return (
                                        <div
                                            key={page.id}
                                            className={`flex px-6 py-2.5 cursor-pointer w-full items-center text-lg gap-2 ${
                                                pathname == page.url
                                                    ? "text-white bg-accent border-l-2 border-l-primary"
                                                    : " text-text hover:text-accent"
                                            }`}
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
                    )}
                    {pathname.includes("assets") && (
                        <div className="bg-white border overflow-hidden shadow-xl w-full rounded border-primary ">
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
                                            className={`flex px-6 py-2.5 cursor-pointer w-full items-center text-lg gap-2 ${
                                                pathname == page.url
                                                    ? "text-white bg-accent border-l-2 border-l-primary"
                                                    : " text-text hover:text-accent"
                                            }`}
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
                    )}{" "}
                </div>
                <div className="w-full h-full overflow-auto space-y-8 px-4 xs:px-8 py-4">
                    <div className="lg:hidden">
                        <BreadCrumb />
                    </div>
                    {children}
                </div>
            </section>
        </main>
    );
};

export default Layout;
