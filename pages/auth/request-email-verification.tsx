import React from "react";
import Head from "next/head";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import { authRequestEmailVerification } from "../../api";
import { CardLayout, InputField } from "../../components";
import { handleGraphQLError, useGQLMutation } from "../../utils";

import type { NextPage } from "next";

const RequestEmailVerification: NextPage = () => {
    const router = useRouter();
    const { email }: any = router.query;

    const [formData, setFormData] = React.useState({ email: email || "" });

    const HandleSubmit = (e: any) => {
        e.preventDefault();
        toast.loading("Loading... Please wait", { autoClose: false });

        mutate(formData);
    };

    const { mutate, isLoading } = useGQLMutation(authRequestEmailVerification, {
        onSuccess: (response: any) => {
            toast.dismiss();
            toast.success("Verification link sent successfully");

            setFormData({ email: "" });
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    return (
        <>
            <Head>
                <title>Request Email Verification | Gild</title>
            </Head>

            <CardLayout>
                <h1 className="font-Sora font-bold text-2xl text-center text-primary mb-4 tracking-wide">Request Email Verification</h1>

                <form id="RequestEmailVerification" className="mb-0 space-y-6" method="POST" onSubmit={HandleSubmit}>
                    <InputField
                        label="Email Address"
                        value={formData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                        type="email"
                        required={true}
                        name="email"
                    />

                    <div>
                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full flex justify-center py-4 px-4 rounded shadow-sm text-md font-semibold text-white bg-primary hover:bg-primary mt-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </CardLayout>
        </>
    );
};

export default RequestEmailVerification;
