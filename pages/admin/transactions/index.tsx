import React from "react";
import Head from "next/head";

import { transactionGetStats } from "../../../api";
import { SideNavLayout } from "../../../components";
import { handleGraphQLError, useGQLQuery, withAuth } from "../../../utils";

import type { NextPage } from "next";

const Transactions: NextPage = () => {
    const [transactionStats, setTransactionStats] = React.useState({
        totalDepositCount: 0,
        totalDepositAmount: 0,
        totalTransferCount: 0,
        totalTransferAmount: 0,
        totalWithdrawalCount: 0,
        totalWithdrawalAmount: 0
    });

    useGQLQuery(
        ["system-settings"],
        { query: transactionGetStats, variables: {} },
        {
            onSuccess: ({ stats }) => {
                setTransactionStats(stats);
            },
            onError: (error: GraphQLErrorResponse) => {
                handleGraphQLError(error);
            }
        }
    );

    return (
        <>
            <Head>
                <title>Transactions | Gild</title>
            </Head>

            <SideNavLayout isAdmin={true}>
                <div className="my-5">
                    <h1 className="font-Sora font-bold text-3xl">Transactions</h1>
                </div>

                <div className="px-4 md:px-8 lg:px-16 py-12 bg-secondary rounded-lg shadow-lg text-center text-white md:mt-10">
                    <h1 className="font-Sora font-bold text-2xl md:text-3xl lg:text-4xl">
                        Overview of <span className="text-primary">Gild</span> Transaction
                    </h1>
                    <p className="font-bold text-lg md:text-xl lg:text-2xl mt-5">Monitor the volume of user's actions on the platform</p>
                </div>

                <br />

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="font-Sora text-base text-white tracking-wider capitalize bg-primary">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Stat
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Value
                                </th>
                            </tr>
                        </thead>
                        <tbody className="font-medium">
                            <tr className="border-b odd:bg-white even:bg-secondary/10">
                                <td className="px-6 py-4">Total Transfer Count</td>
                                <td className="px-6 py-4">{transactionStats.totalTransferCount}</td>
                            </tr>
                            <tr className="border-b odd:bg-white even:bg-secondary/10">
                                <td className="px-6 py-4">Total Transfer Amount</td>
                                <td className="px-6 py-4">
                                    {transactionStats.totalTransferAmount} <span className="font-Sora font-bold text-primary">Gild</span>
                                </td>
                            </tr>
                            <tr className="border-b odd:bg-white even:bg-secondary/10">
                                <td className="px-6 py-4">Total Deposit Count</td>
                                <td className="px-6 py-4">{transactionStats.totalDepositCount}</td>
                            </tr>
                            <tr className="border-b odd:bg-white even:bg-secondary/10">
                                <td className="px-6 py-4">Total Deposit Amount</td>
                                <td className="px-6 py-4">
                                    {transactionStats.totalDepositAmount} <span className="font-Sora font-bold text-primary">Gild</span>
                                </td>
                            </tr>
                            <tr className="border-b odd:bg-white even:bg-secondary/10">
                                <td className="px-6 py-4">Total Withdrawal Count</td>
                                <td className="px-6 py-4">{transactionStats.totalWithdrawalCount}</td>
                            </tr>
                            <tr className="border-b odd:bg-white even:bg-secondary/10">
                                <td className="px-6 py-4">Total Withdrawal Amount</td>
                                <td className="px-6 py-4">
                                    {transactionStats.totalWithdrawalAmount} <span className="font-Sora font-bold text-primary">Gild</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </SideNavLayout>
        </>
    );
};

export default withAuth(Transactions);
