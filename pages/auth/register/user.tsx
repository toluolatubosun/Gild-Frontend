import React from "react";
import Link from "next/link";
import Head from "next/head";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { setCookies } from "cookies-next";

import { authRegister } from "../../../api";
import { CardLayout, InputField } from "../../../components";
import { handleGraphQLError, useGQLMutation, withoutAuth } from "../../../utils";

import type { NextPage } from "next";

const SignUp: NextPage = () => {
    const router = useRouter();

    const HandleSubmit = (e: any) => {
        e.preventDefault();

        if (formData.password != formData.confirmPassword) {
            toast.warning("Password does not match");
            return;
        }

        toast.loading("Loading... Please wait", { autoClose: false });

        const { name, email, role, username, password } = formData;
        mutate({ input: { name, email, role, username, password } });
    };

    const { mutate, isLoading } = useGQLMutation(authRegister, {
        onSuccess: ({ response }: any) => {
            toast.dismiss();
            toast.success("Registration Successful");

            setCookies("access_token", response.token.accessToken);
            setCookies("refresh_token", response.token.refreshToken);

            router.replace(`/auth/on-boarding?email=${response.user.email}`);
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        role: "user",
        username: "",
        password: "",
        confirmPassword: ""
    });

    return (
        <>
            <Head>
                <title>Register a Personal Account | Gild</title>
            </Head>

            <CardLayout large>
                <h1 className="font-Sora font-bold text-2xl text-center text-secondary mb-4 tracking-wide">Create An Account</h1>

                <form id="SingUpForm" className="mb-0 space-y-6" method="POST" onSubmit={HandleSubmit}>
                    <InputField
                        label="Full Name"
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                        type="text"
                        required={true}
                        name="fullName"
                    />

                    <InputField
                        label="Username"
                        value={formData.username}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, username: e.target.value })}
                        type="text"
                        required={true}
                        name="Username"
                    />

                    <InputField
                        label="Email Address"
                        value={formData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                        type="email"
                        required={true}
                        name="email"
                    />

                    <div className="md:flex md:space-x-4 space-y-6 md:space-y-0">
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
                    </div>

                    <p className="ext-sm font-medium mt-4 text-gray-600">
                        <Link href="/auth/login" passHref>
                            <span className="text-primary cursor-pointer">Login Instead</span>
                        </Link>
                    </p>

                    <div>
                        <button disabled={isLoading} type="submit" className="btn-auth-form">
                            Register
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm font-medium mt-4 text-gray-600">
                    Want to Register a Business Account?{" "}
                    <Link href="/auth/register/business" passHref>
                        <span className="text-primary cursor-pointer">Click Here</span>
                    </Link>
                </p>
            </CardLayout>
        </>
    );
};

export default withoutAuth(SignUp);
