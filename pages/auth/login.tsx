import React from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { setCookies } from "cookies-next";

import { authLogin } from "../../api";
import { handleGraphQLError, useGQLMutation, withoutAuth } from "../../utils";
import { CardLayout, InputField } from "../../components";

import type { NextPage } from "next";

const Login: NextPage = () => {
    const router = useRouter();

    const HandleSubmit = (e: any) => {
        e.preventDefault();

        toast.loading("Loading... Please wait", {
            autoClose: false
        });

        mutate({ input: formData });
    };

    const { mutate, isLoading } = useGQLMutation(authLogin, {
        onSuccess: ({ response }: any) => {
            setCookies("access_token", response.token.accessToken);
            setCookies("refresh_token", response.token.refreshToken);

            router.replace("/app");
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    const [formData, setFormData] = React.useState({
        email: "",
        password: ""
    });

    return (
        <>
            <CardLayout>
                <h1 className="font-Sora font-bold text-2xl text-center text-primary mb-4 tracking-wide">Login To Your Account</h1>

                <form id="loginForm" className="mb-0 space-y-6" method="POST" onSubmit={HandleSubmit}>
                    <InputField
                        label="Email Address"
                        value={formData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                        type="email"
                        required={true}
                        name="email"
                    />

                    <InputField
                        label="Password"
                        value={formData.password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                        type="password"
                        required={true}
                        name="password"
                    />

                    <button
                        type="button"
                        onClick={() => {
                            router.push({
                                pathname: "/auth/request-password-reset",
                                query: {
                                    email: formData.email || null
                                }
                            });
                        }}
                    >
                        <p className="text-right text-sm font-bold cursor-pointer text-primary">Forgot Password?</p>
                    </button>

                    <div>
                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full flex justify-center py-4 px-4 rounded shadow-sm text-md font-bold text-white bg-primary hover:bg-secondary mt-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Login
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm font-medium mt-4 text-gray-600">
                    Don&#39;t have an account?{" "}
                    <Link href="/auth/register/user" passHref>
                        <span className="text-primary cursor-pointer">Create your account here</span>
                    </Link>
                </p>
            </CardLayout>
        </>
    );
};

export default withoutAuth(Login);
