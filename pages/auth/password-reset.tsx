import React from "react";
import Head from "next/head";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import { authResetPassword } from "../../api";
import { CardLayout, InputField } from "../../components";
import { handleGraphQLError, useGQLMutation } from "../../utils";

import type { NextPage } from "next";

const PasswordReset: NextPage = () => {
    const router = useRouter();
    const { userId, resetToken } = router.query;

    const HandleSubmit = (e: any) => {
        e.preventDefault();

        if (userId === null || resetToken === null) {
            toast.warning("Invalid reset link");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.warning("Passwords does not match");
            return;
        }

        toast.loading("Loading... Please wait", { autoClose: false });

        mutate({ userId, resetToken, password: formData.password });
    };

    const { mutate, isLoading } = useGQLMutation(authResetPassword, {
        onSuccess: (response: any) => {
            toast.dismiss();
            toast.success("Password Updated Successfully");

            router.replace("/auth/login");

            setFormData({
                password: "",
                confirmPassword: ""
            });
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    const [formData, setFormData] = React.useState({
        password: "",
        confirmPassword: ""
    });

    return (
        <>
            <Head>
                <title>Reset Password | Gild</title>
            </Head>

            <CardLayout>
                <h1 className="font-Sora font-bold text-2xl text-center text-secondary mb-4 tracking-wide">Reset your password</h1>

                <form id="PasswordReset" className="mb-0 space-y-6" method="POST" onSubmit={HandleSubmit}>
                    <InputField
                        label="Password"
                        value={formData.password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                        type="password"
                        required={true}
                        name="password"
                    />

                    <InputField
                        label="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        type="password"
                        required={true}
                        name="confirmPassword"
                    />

                    <div>
                        <button disabled={isLoading} type="submit" className="btn-auth-form">
                            Reset Password
                        </button>
                    </div>
                </form>
            </CardLayout>
        </>
    );
};

export default PasswordReset;
