import React from "react";
import { useRouter } from "next/router";

import { CardLayout } from "../../components";

import type { NextPage } from "next";

const OnBoarding: NextPage = () => {
    const router = useRouter();
    const { email }: any = router.query;

    return (
        <>
            <CardLayout large={true}>
                <h1 className="font-Sora font-bold text-2xl md:text-3xl text-center text-gray-800 mb-4">Welcome to Gild</h1>
                <div className="text-lg text-gray-700 text-center">
                    <p className="mb-2 font-medium">Check your email for a verification link</p>
                    <p>
                        Didn&#39;t get the link?{" "}
                        <button
                            onClick={() => {
                                router.push({
                                    pathname: "/auth/request-email-verification",
                                    query: {
                                        email
                                    }
                                });
                            }}
                        >
                            <span className="text-primary font-medium cursor-pointer">Resend</span>
                        </button>
                    </p>
                </div>
            </CardLayout>
        </>
    );
};

export default OnBoarding;
