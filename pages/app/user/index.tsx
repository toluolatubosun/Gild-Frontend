import React from "react";
import Head from "next/head";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { InputField, SideNavLayout } from "../../../components";
import { handleGraphQLError, toBase64, useGQLMutation, useGQLQuery, withAuth } from "../../../utils";
import { authUpdatePassword, userUpdateMe, userGetMyProfile } from "../../../api";

import type { NextPage } from "next";

const UserProfile: NextPage = () => {
    const queryClient = useQueryClient();
    const [user, setUser] = React.useState<any>(null);

    const { isLoading } = useGQLQuery(
        ["my-profile"],
        { query: userGetMyProfile, variables: {} },
        {
            onSuccess: ({ user }: any) => {
                setUser(user);
            },
            onError: (error: GraphQLErrorResponse) => {
                handleGraphQLError(error);
            }
        }
    );

    /// ===== UPDATE BIO DATA ===== ///

    const [bioFormData, setBioFormData] = React.useState({
        name: "",
        image: null as null | string
    });

    React.useEffect(() => {
        if (user) {
            setBioFormData({
                name: user.name,
                image: user.image || null
            });
        }
    }, [user]);

    const BioDataFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        updateBioData({ input: bioFormData });
    };

    const { mutate: updateBioData, isLoading: updatingBioData } = useGQLMutation(userUpdateMe, {
        onMutate: () => {
            toast.loading("Loading... Please wait", { autoClose: false });
        },
        onSuccess: async () => {
            toast.dismiss();
            toast.success("Profile updated successfully");

            await queryClient.refetchQueries(["my-profile"], { exact: true });
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    /// ===== UPDATE PASSWORD ===== ///

    const [passwordFormData, setPasswordFormData] = React.useState({
        newPassword: "",
        currentPassword: "",
        confirmPassword: ""
    });

    const PasswordFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
            toast.error("Password does not match");
            return;
        }

        updatePassword({ oldPassword: passwordFormData.currentPassword, newPassword: passwordFormData.newPassword });
    };

    const { mutate: updatePassword, isLoading: updatingPassword } = useGQLMutation(authUpdatePassword, {
        onMutate: () => {
            toast.loading("Loading... Please wait", { autoClose: false });
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Password updated successfully");
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    return (
        <>
            <SideNavLayout isLoading={isLoading}>
                {user && (
                    <form className="mb-10 space-y-6 mt-10" onSubmit={BioDataFormSubmit}>
                        <div className="flex flex-col space-x-0 md:space-x-8 md:flex-row w-full items-center">
                            <div className="w-auto flex flex-col items-center md:items-start">
                                <img
                                    alt={user.name}
                                    referrerPolicy="no-referrer"
                                    className="cursor-pointer w-44 h-44 object-cover rounded-full align-middle border-none shadow-lg"
                                    src={bioFormData.image ?? `https://ui-avatars.com/api/?format=svg&background=0066CC&color=fff&name=${user.name}`}
                                />
                            </div>

                            <div className="mt-6 md:mt-0">
                                <h1 className="font-Sora text-gray-800 text-center md:text-left text-2xl font-semibold">
                                    {user.firstName} {user.lastName}
                                </h1>

                                <div className="items-start flex flex-row w-full md:items-start mt-4 space-x-2">
                                    <label
                                        className={`rounded-sm text-center text-base text-white p-2 font-medium` + (updatingBioData ? " bg-gray-300 cursor-not-allowed" : " bg-primary cursor-pointer")}
                                        htmlFor="image"
                                    >
                                        Upload Image
                                    </label>

                                    <input
                                        disabled={updatingBioData}
                                        id="image"
                                        accept="image/png, image/jpeg"
                                        className="hidden"
                                        type="file"
                                        onChange={async (e: any) => {
                                            if (!e.target.files[0]) return;
                                            const base64 = (await toBase64(e.target.files[0])) as string;
                                            setBioFormData({ ...bioFormData, image: base64 });
                                        }}
                                    />

                                    <button
                                        disabled={updatingBioData}
                                        onClick={() => setBioFormData({ ...bioFormData, image: null })}
                                        type="button"
                                        className="rounded-sm text-gray-700 text-center border-2 border-primary bg-white p-1.5 text-base disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed"
                                    >
                                        Delete Image
                                    </button>
                                </div>
                            </div>
                        </div>

                        <InputField
                            type="text"
                            name="Name"
                            required={true}
                            value={bioFormData.name}
                            label={user.role === "business" ? "Business Name" : "Full Name"}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBioFormData({ ...bioFormData, name: e.target.value })}
                        />

                        <div className="md:flex md:space-x-4 space-y-6 md:space-y-0">
                            <InputField label="Email" value={user.email} onChange={() => {}} type="email" required={false} disabled={true} name="email" />
                            <InputField label="Username" value={user.username} onChange={() => {}} type="text" required={false} disabled={true} name="username" />
                        </div>

                        <div className="flex flex-col items-center md:items-end">
                            <button
                                disabled={updatingBioData}
                                type="submit"
                                className="font-Sora rounded-sm px-5 py-3 text-base font-medium text-center text-white bg-secondary hover:bg-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Save Change
                            </button>
                        </div>
                    </form>
                )}

                <form className="mb-10 space-y-6 mt-10" onSubmit={PasswordFormSubmit}>
                    <h3 className="font-Sora text-gray-700 mb-6 text-2xl font-semibold text-left">Update Password</h3>

                    <InputField
                        label="Current Password"
                        value={passwordFormData.currentPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordFormData({ ...passwordFormData, currentPassword: e.target.value })}
                        type="password"
                        required={true}
                        name="currentPassword"
                    />

                    <div className="md:flex md:space-x-4 space-y-6 md:space-y-0">
                        <InputField
                            label="New Password"
                            value={passwordFormData.newPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
                            type="password"
                            required={true}
                            name="newPassword"
                        />

                        <InputField
                            label="Confirm Password"
                            value={passwordFormData.confirmPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordFormData({ ...passwordFormData, confirmPassword: e.target.value })}
                            type="password"
                            required={true}
                            name="confirmPassword"
                        />
                    </div>

                    <div className="flex flex-col items-center md:items-end">
                        <button
                            disabled={updatingPassword}
                            type="submit"
                            className="font-Sora rounded-sm px-5 py-3 text-base font-medium text-center text-white bg-secondary hover:bg-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Update Password
                        </button>
                    </div>
                </form>
            </SideNavLayout>
        </>
    );
};

export default withAuth(UserProfile);
