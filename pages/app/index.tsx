import React from "react";
import Link from "next/link";
import { GiTakeMyMoney } from "react-icons/gi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { walletGetMine } from "../../api";
import { SideNavLayout } from "../../components";
import { handleGraphQLError, useGQLQuery, useUser, withAuth } from "../../utils";

import type { NextPage } from "next";

const Dashboard: NextPage = () => {
    const { user } = useUser();

    const [showBalance, setShowBalance] = React.useState<boolean>(false);
    const [wallet, setWallet] = React.useState<{ balance: number } | null>(null);

    const quickActions = [
        { name: "Deposit", icon: "GiTakeMyMoney", link: "/app/deposit" },
        { name: "Withdraw", icon: "GiTakeMyMoney", link: "/app/withdraw" },
        { name: "Transfer", icon: "GiTakeMyMoney", link: "/app/transfer" }
    ];

    useGQLQuery(
        ["my-wallet"],
        { query: walletGetMine, variables: {} },
        {
            onSuccess: ({ wallet }: any) => {
                setWallet(wallet);
            },
            onError: (error: any) => {
                handleGraphQLError(error);
            }
        }
    );

    return (
        <>
            <SideNavLayout>
                <div className="my-5">
                    <h1 className="font-Sora font-bold text-3xl">
                        Hello, <span className="text-secondary">@{user?.username || "username"}</span>
                    </h1>
                </div>

                <div className="px-4 md:px-8 lg:px-16 py-12 bg-secondary rounded-lg shadow-lg text-center text-white md:mt-10">
                    <h1 className="font-Sora font-bold text-2xl md:text-3xl lg:text-4xl">
                        Welcome to <span className="text-primary">Gild</span>
                    </h1>
                    <p className="font-bold text-lg md:text-xl lg:text-2xl mt-5">The best way to move money across boarders</p>

                    <div className="flex place-items-center">
                        <p className="font-Sora font-bold text-left text-xl md:text-2xl lg:text-3xl mt-5">
                            Wallet Balance :{" "}
                            <button onClick={() => setShowBalance(!showBalance)} className="text-primary">
                                {showBalance ? wallet?.balance.toLocaleString("en-US") || 0 : "****"} GILD
                            </button>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-4 my-5 md:mt-10">
                    {quickActions.map((action, index) => (
                        <Link key={index} href={action.link}>
                            <div className="cursor-pointer border-4 border-secondary rounded-md py-3 hover:bg-secondary hover:text-white">
                                <div className="flex flex-row items-center justify-center">
                                    <div className="bg-primary rounded-full p-4">{action.icon === "GiTakeMyMoney" && <GiTakeMyMoney className="text-3xl text-white" />}</div>
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
