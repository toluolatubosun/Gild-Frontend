import React from "react";
import Head from "next/head";

import { handleGraphQLError, useGQLQuery, withAuth } from "../../../utils";
import { SideNavLayout } from "../../../components";

import type { NextPage } from "next";
import { notificationGetAllMine } from "../../../api/paths/notification.api";

const Activity: NextPage = () => {
    const [notifications, setNotifications] = React.useState<any[]>([]);
    const [pagination, setPagination] = React.useState({ next: "", limit: 2 });

    const [cursors, setCursors] = React.useState<string[]>([""]);
    const [cursorIndex, setCursorIndex] = React.useState<number>(-1);

    const { isLoading } = useGQLQuery(
        ["my-notifications", pagination.next],
        { query: notificationGetAllMine, variables: { pagination } },
        {
            onSuccess: ({ data }) => {
                setNotifications(data.notifications);
                
                if (data.pagination.hasNext && !cursors.includes(data.pagination.next)) {
                    setCursors((prev) => [...prev, data.pagination.next]);
                    setCursorIndex((prev) => prev + 1);
                }
            },
            onError: (error: GraphQLErrorResponse) => {
                handleGraphQLError(error);
            },
            refetchOnMount: false,
            refetchOnWindowFocus: false
        }
    );

    const nextPage = () => {
        if (cursorIndex === cursors.length - 1) return;
        setPagination({ ...pagination, next: cursors[cursorIndex + 1] });
        setCursorIndex((prev) => prev + 1);
    };

    const previousPage = () => {
        if (cursorIndex === 0) return;
        setPagination({ ...pagination, next: cursors[cursorIndex - 1] });
        setCursorIndex((prev) => prev - 1);
    };
    
    return (
        <>
            <Head>
                <title>Activity | Gild</title>
            </Head>

            <SideNavLayout isLoading={isLoading}>
                <div className="my-5">
                    <h1 className="font-Sora font-bold text-3xl">Activity</h1>
                </div>

                <div className="px-4 md:px-8 lg:px-16 py-12 bg-secondary rounded-lg shadow-lg text-center text-white md:mt-10">
                    <h1 className="font-Sora font-bold text-2xl md:text-3xl lg:text-4xl">Your Activity</h1>

                    <p className="font-bold text-lg md:text-xl lg:text-2xl mt-5">See all you recent transactions in one place</p>
                </div>

                <div className="my-5 md:mt-19">
                    {notifications.length === 0 && (
                        <div className="flex flex-col items-center justify-center">
                            <h1 className="font-Sora font-bold text-gray-700 text-3xl">No Activity Found</h1>
                        </div>
                    )}
                    {notifications.length > 0 && (
                        <div>
                            {notifications.map((notification) => (
                                <div key={notification.id}>
                                    <p>{notification.source.name}</p>
                                    <p>{notification.createdAt}</p>
                                    <p>{notification.title}</p>
                                    <p>{notification.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <button
                        onClick={previousPage}
                    >
                        Previous
                    </button>
                    <button
                        onClick={nextPage}
                    >
                        Next
                    </button>
                </div>
            </SideNavLayout>
        </>
    );
};

export default withAuth(Activity);
