import React from "react";
import Head from "next/head";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import { getCookie, removeCookies } from "cookies-next";

import { authLogout } from "../../api";
import { Loading } from "../../components";
import { handleGraphQLError, useGQLMutation, withAuth } from "../../utils";

import type { NextPage } from "next";

const Logout: NextPage = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [rendered, setRendered] = React.useState(true);

    const { mutate } = useGQLMutation(authLogout, {
        onSuccess: () => {
            toast.success("You have been logged out");

            queryClient.removeQueries(["auth-user"]);
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        },
        onSettled: () => {
            removeCookies("access_token");
            removeCookies("refresh_token");

            router.push("/auth/login");
        }
    });

    React.useEffect(() => {
        if (rendered) {
            setRendered(false);
        }

        if (!rendered) {
            mutate({ refreshToken: getCookie("refresh_token") });
        }
    }, [rendered]);

    return (
        <>
            <Head>
                <title>Logout | Gild</title>
            </Head>

            <Loading isParent={true} />
        </>
    );
};

export default withAuth(Logout);
