import React from "react";
import Head from "next/head";
import Link from "next/link";
import { AiOutlineBank, AiOutlineSetting, AiOutlineUserAdd } from "react-icons/ai";
import { GiTakeMyMoney } from "react-icons/gi";
import { HiOutlineBanknotes } from "react-icons/hi2";

import { walletGetMine } from "../../api";
import { SideNavLayout } from "../../components";
import { handleGraphQLError, useGQLQuery, useUser, withAuth } from "../../utils";

import type { NextPage } from "next";

const Dashboard: NextPage = () => {
    const { user } = useUser();

    const quickActions = [
        { name: "View Transactions", icon: "GiTakeMyMoney", link: "/admin/transactions" },
        { name: "Manage Users", icon: "AiOutlineUserAdd", link: "/admin/users" },
        { name: "System Settings", icon: "AiOutlineSetting", link: "/admin/system-settings" }
    ];

    return (
        <>
            <Head>
                <title>Dashboard | Gild</title>
            </Head>

            <SideNavLayout isAdmin={true}>
                <div className="my-5">
                    <h1 className="font-Sora font-bold text-3xl">
                        Hello, <span className="text-secondary">@{user?.username || "username"}</span>
                    </h1>
                </div>

                <div className="px-4 md:px-8 lg:px-16 py-12 bg-secondary rounded-lg shadow-lg text-center text-white md:mt-10">
                    <h1 className="font-Sora font-bold text-2xl md:text-3xl lg:text-4xl">
                        <span className="text-primary">Gild</span> Admin Dashboard
                    </h1>
                    <p className="font-bold text-lg md:text-xl lg:text-2xl mt-5">Manage the Gild application very easily</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-4 my-5 md:mt-10">
                    {quickActions.map((action, index) => (
                        <Link key={index} href={action.link}>
                            <div className="cursor-pointer border-4 border-secondary rounded-md py-3 hover:bg-secondary hover:text-white">
                                <div className="flex flex-row items-center justify-center">
                                    <div className="bg-primary rounded-full p-4">
                                        {action.icon === "AiOutlineUserAdd" && <AiOutlineUserAdd className="text-3xl text-secondary" />}
                                        {action.icon === "AiOutlineSetting" && <AiOutlineSetting className="text-3xl text-secondary" />}
                                        {action.icon === "GiTakeMyMoney" && <GiTakeMyMoney className="text-3xl text-secondary" />}
                                    </div>
                                    <h1 className="font-Sora font-bold text-xl ml-10 lg:ml-5">{action.name}</h1>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </SideNavLayout>
        </>
    );
};

export default withAuth(Dashboard);
