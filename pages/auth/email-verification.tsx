import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { authVerifyEmail } from "../../api";
import { useGQLMutation } from "../../utils";
import { CardLayout } from "../../components";

import type { NextPage } from "next";
import Link from "next/link";

const EmailVerification: NextPage = () => {
    const router = useRouter();
    const { userId, verifyToken } = router.query;

    const [helpText, setHelpText] = React.useState("Loading... Please wait");
    const [helpTextColor, setHelpTextColor] = React.useState("text-secondary");

    React.useEffect(() => {
        if (!router.isReady) return;

        if (userId == null || verifyToken == null) {
            setHelpTextColor("text-red-500");
            setHelpText("Invalid verification link");
            return;
        }

        mutate({ userId, verifyToken });
    }, [router.isReady]);

    const { mutate } = useGQLMutation(authVerifyEmail, {
        onSuccess: (response: any) => {
            setHelpText("Email Verified Successfully");
            setHelpTextColor("text-green-500");

            router.push("/app");
        },
        onError: (error: GraphQLErrorResponse) => {
            if (error.response.errors) {
                setHelpTextColor("text-red-500");
                setHelpText(error.response.errors[0].message);
            } else {
                setHelpTextColor("text-red-500");
                setHelpText("Something went wrong");
            }
        }
    });

    return (
        <>
            <Head>
                <title>Email Verification | Gild</title>
            </Head>

            <CardLayout>
                <h1 className="font-Sora font-bold text-2xl md:text-3xl text-center mb-4">Email verification</h1>
                <p className={`text-xl font-semibold ${helpTextColor} text-center`}>{helpText}</p>

                <p className="text-center text font-medium mt-4 text-gray-600">
                    Request Email Verification.{" "}
                    <Link href="/auth/request-email-verification" passHref>
                        <span className="text-primary cursor-pointer">Click Here</span>
                    </Link>
                </p>
            </CardLayout>
        </>
    );
};

export default EmailVerification;
