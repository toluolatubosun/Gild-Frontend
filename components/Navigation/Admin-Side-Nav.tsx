import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { BiLogOut } from "react-icons/bi";
import { GiTakeMyMoney } from "react-icons/gi";
import { FaTimes, FaBars } from "react-icons/fa";
import { MdOutlineDashboard, MdOutlineLoop } from "react-icons/md";
import { AiOutlineUserAdd, AiOutlineSetting } from "react-icons/ai";

import UserDropDown from "./DropDown/User-DropDown";
import logo_trans from "../../public/logo/logo_trans.png";

const AdminSideNav = ({ user }: any) => {
    const [collapseShow, setCollapseShow] = React.useState("hidden");
    const router = useRouter();

    return (
        <>
            <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-2 px-6">
                <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
                    {/* Toggle */}
                    <button className="cursor-pointer text-gray-900 md:hidden px-3 py-1 text-xl" onClick={() => setCollapseShow("bg-white py-3 px-6")}>
                        <FaBars className="" />
                    </button>

                    {/* Brand */}
                    <Link href="/" passHref>
                        <div className="cursor-pointer font-Sora md:block text-center md:pb-2 text-secondary tracking-wider mr-0 inline-block whitespace-nowrap text-xl md:text-3xl uppercase font-bold md:p-4 px-0">
                            <div className="flex place-items-center">
                                <div className="w-16 md:w-20 h-16 md:h-20 cursor-pointer">
                                    <Image src={logo_trans} alt="logo" />
                                </div>
                                <div className="ml-4">GILD</div>
                            </div>
                        </div>
                    </Link>

                    {/* User */}
                    <ul className="md:hidden items-center flex flex-wrap list-none">
                        <li className="inline-block relative">
                            <UserDropDown
                                image={
                                    (user && (user.image || `https://ui-avatars.com/api/?format=svg&background=0066CC&color=fff&name=${user.name}`)) ||
                                    `https://ui-avatars.com/api/?format=svg&background=0066CC&color=fff&name=A`
                                }
                            />
                        </li>
                    </ul>

                    {/* Menu */}
                    <div
                        className={
                            "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
                            collapseShow
                        }
                    >
                        {/* Mobile DropDown Nav header */}
                        <div className="md:min-w-full md:hidden block mb-2">
                            <div className="flex flex-wrap">
                                <div className="w-6/12">
                                    <Link href="/" passHref>
                                        <div className="cursor-pointer font-Sora md:block text-secondary hover:text-primary text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-lg uppercase font-bold py-4 px-0">
                                            GILD
                                        </div>
                                    </Link>
                                </div>
                                <div className="w-6/12 flex justify-end">
                                    <button className="cursor-pointer text-gray-900 md:hidden px-3 py-1 text-xl" onClick={() => setCollapseShow("hidden")}>
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <ul className="md:flex-col md:min-w-full flex flex-col space-y-2">
                            <hr className="my-4 md:min-w-full" />

                            <li className="items-center cursor-pointer">
                                <Link passHref href="/admin">
                                    <div
                                        className={
                                            "text-xl capitalize py-3 font-semibold tracking-wide flex flex-row space-x-2 items-center " +
                                            (router.pathname == "/admin" ? "text-secondary" : "text-gray-900 hover:text-secondary")
                                        }
                                    >
                                        <MdOutlineDashboard />
                                        <p>Dashboard</p>
                                    </div>
                                </Link>
                            </li>

                            <li className="items-center cursor-pointer">
                                <Link passHref href="/admin/transactions">
                                    <div
                                        className={
                                            "text-xl capitalize py-3 font-semibold tracking-wide flex flex-row space-x-2 items-center " +
                                            (router.pathname == "/admin/transactions" ? "text-secondary" : "text-gray-900 hover:text-secondary")
                                        }
                                    >
                                        <GiTakeMyMoney />
                                        <p>Transactions</p>
                                    </div>
                                </Link>
                            </li>

                            <li className="items-center cursor-pointer">
                                <Link passHref href="/admin/users">
                                    <div
                                        className={
                                            "text-xl capitalize py-3 font-semibold tracking-wide flex flex-row space-x-2 items-center " +
                                            (router.pathname == "/admin/users" ? "text-secondary" : "text-gray-900 hover:text-secondary")
                                        }
                                    >
                                        <AiOutlineUserAdd />
                                        <p>Users</p>
                                    </div>
                                </Link>
                            </li>

                            <li className="items-center cursor-pointer">
                                <Link passHref href="/admin/system-settings">
                                    <div
                                        className={
                                            "text-xl capitalize py-3 font-semibold tracking-wide flex flex-row space-x-2 items-center " +
                                            (router.pathname == "/app/system-settings" ? "text-secondary" : "text-gray-900 hover:text-secondary")
                                        }
                                    >
                                        <AiOutlineSetting />
                                        <p>System Settings</p>
                                    </div>
                                </Link>
                            </li>

                            <li className="items-center cursor-pointer">
                                <Link passHref href="/auth/logout">
                                    <div
                                        className={
                                            "text-xl capitalize py-3 font-semibold tracking-wide flex flex-row space-x-2 items-center " +
                                            (router.pathname == "/auth/logout" ? "text-secondary" : "text-gray-900 hover:text-secondary")
                                        }
                                    >
                                        <BiLogOut />
                                        <p>Logout</p>
                                    </div>
                                </Link>
                            </li>

                            <hr className="my-4 md:min-w-full" />

                            <li className="items-center cursor-pointer">
                                <Link passHref href="/app">
                                    <div
                                        className={
                                            "text-lg capitalize py-3 font-semibold tracking-wide flex flex-row space-x-2 items-center " +
                                            (router.pathname == "/app" ? "text-secondary" : "text-gray-900 hover:text-secondary")
                                        }
                                    >
                                        <p>Go to User View</p>
                                        <MdOutlineLoop />
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default AdminSideNav;
