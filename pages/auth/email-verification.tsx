import React from "react";
import Head from "next/head";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";

import { authVerifyEmail } from "../../api";
import { CardLayout } from "../../components";

import type { NextPage } from "next";
import type { AxiosError, AxiosResponse } from "axios";

const EmailVerification: NextPage = () => {
    const router = useRouter();
    const { userId, verifyToken } = router.query;

    const [helpText, setHelpText] = React.useState("Loading... Please wait");

    React.useEffect(() => {
        if (!router.isReady) return;

        if (userId == null || verifyToken == null) {
            toast.error("Invalid verification link");
            setHelpText("Invalid verification link");

            return;
        }

        mutate({ userId, verifyToken });
    }, [router.isReady]);

    const { mutate, data, isLoading, error } = useMutation(authVerifyEmail, {
        onSuccess: (response: AxiosResponse) => {
            toast.dismiss();
            toast.success("Email Verified Successfully");
            setHelpText("Email Verified Successfully");

            router.push("/app");
        },
        onError: (error: AxiosError) => {
            toast.dismiss();
            toast.error(error.response ? error.response.data.message : error.message);
            setHelpText(error.response ? error.response.data.message : error.message);
        }
    });

    return (
        <>
            <Head>
                <title>Email Verification | MySVote</title>
            </Head>

            <CardLayout>
                <h1 className="font-Sora font-bold text-2xl md:text-3xl text-center mb-4">Email verification</h1>

                <p className="text-lg text-gray-700 text-center">{helpText}</p>
            </CardLayout>
        </>
    );
};

export default EmailVerification;
