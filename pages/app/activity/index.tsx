import React from "react";
import Head from "next/head";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";

import { SideNavLayout } from "../../../components";
import { notificationGetAllMine } from "../../../api";
import { handleGraphQLError, useGQLQuery, withAuth, moment } from "../../../utils";

import type { NextPage } from "next";

const Activity: NextPage = () => {
    const [notifications, setNotifications] = React.useState<any[]>([]);
    const [pagination, setPagination] = React.useState({ next: "", limit: 5 });

    const [cursors, setCursors] = React.useState<string[]>([""]);
    const [cursorIndex, setCursorIndex] = React.useState<number>(0);

    const { isLoading, isFetching } = useGQLQuery(
        ["my-notifications", pagination.next],
        { query: notificationGetAllMine, variables: { pagination } },
        {
            onSuccess: ({ data }) => {
                setNotifications(data.notifications);

                if (data.pagination.hasNext && !cursors.includes(data.pagination.next)) {
                    setCursors((prev) => [...prev, data.pagination.next]);
                }
            },
            onError: (error: GraphQLErrorResponse) => {
                handleGraphQLError(error);
            }
        }
    );

    const hasNext = () => cursorIndex !== cursors.length - 1 && !isFetching && !isLoading;
    const nextPage = () => {
        if (!hasNext) return;
        setPagination({ ...pagination, next: cursors[cursorIndex + 1] });
        setCursorIndex((prev) => prev + 1);
    };

    const hasPrevious = () => cursorIndex !== 0 && !isFetching && !isLoading;
    const previousPage = () => {
        if (!hasPrevious) return;
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

                    <p className="font-bold text-lg md:text-xl lg:text-2xl mt-5">View your account history in one place</p>
                </div>

                <div className="my-5 md:mt-19">
                    {notifications.length === 0 && (
                        <div className="flex flex-col items-center justify-center">
                            <h1 className="font-Sora font-bold text-gray-700 text-3xl">No Activity Found</h1>
                        </div>
                    )}
                    {notifications.length > 0 && (
                        <>
                            <div className="space-y-5">
                                {notifications.map((notification) => (
                                    <div key={notification.id} className="px-4 md:px-8 lg:px-16 py-6 border-4 border-secondary rounded-lg shadow-lg font-medium text-gray-600 md:mt-8">
                                        <div className="flex place-items-center space-x-4">
                                            <img
                                                alt={notification.source.name}
                                                className="w-24 h-24 object-cover rounded-full align-middle border-none shadow-lg"
                                                src={notification.source.image || `https://ui-avatars.com/api/?format=svg&background=0066CC&color=fff&name=${notification.source.name}`}
                                            />
                                            <div>
                                                <p>@{notification.source.username}</p>
                                                <h1 className="font-Sora font-bold text-xl text-secondary">{notification.source.name}</h1>
                                                <p className="font-Sora font-light">{moment.getDateTime(parseInt(notification.createdAt))}</p>
                                            </div>
                                        </div>
                                        <p className="font-Sora font-semibold text-2xl mt-4">{notification.title}</p>
                                        <p className="mt-1">{notification.message}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex place-items-center justify-center my-5">
                                <button
                                    onClick={previousPage}
                                    disabled={!hasPrevious()}
                                    className="font-Sora tracking-wider bg-secondary text-white font-semibold py-2 px-4 rounded-sm mr-2 flex place-items-center space-x-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    <IoArrowBackOutline />
                                    <div>Previous</div>
                                </button>
                                <button
                                    onClick={nextPage}
                                    disabled={!hasNext()}
                                    className="font-Sora tracking-wider bg-secondary text-white font-semibold py-2 px-4 rounded-sm mr-2 flex place-items-center space-x-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    <div>Next</div>
                                    <IoArrowForwardOutline />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </SideNavLayout>
        </>
    );
};

export default withAuth(Activity);
