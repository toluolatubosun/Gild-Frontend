import React, { useEffect } from "react";
import Head from "next/head";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { InputField, SideNavLayout } from "../../../components";
import { useUser, withAuth } from "../../../utils";
import { authUpdatePassword, userUpdateMe } from "../../../api";

import type { NextPage } from "next";
import type { AxiosError, AxiosResponse } from "axios";

const UserProfile: NextPage = () => {
    const queryClient = useQueryClient();
    const { user, isLoading } = useUser();

    const [bioFormData, setBioFormData] = React.useState({
        firstName: "",
        lastName: ""
    });

    useEffect(() => {
        if (user) {
            setBioFormData({
                firstName: user.firstName,
                lastName: user.lastName
            });
        }
    }, [user]);

    const [uploadImage, setUploadedImage] = React.useState<null | string>(null);

    const BioDataFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("firstName", bioFormData.firstName);
        formData.append("lastName", bioFormData.lastName);
        if (uploadImage) {
            formData.append("image", uploadImage);
        }

        updateBioData(formData);
    };

    const { mutate: updateBioData, isLoading: updatingBioData } = useMutation(userUpdateMe, {
        onMutate: (data: any) => {
            toast.loading("Loading... Please wait", {
                autoClose: false
            });
        },
        onSuccess: async (response: AxiosResponse) => {
            toast.dismiss();
            toast.success("Profile updated successfully");

            await queryClient.refetchQueries(["auth-user"], { exact: true });

            setUploadedImage(null);
        },
        onError: (error: AxiosError) => {
            toast.dismiss();
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    const [passwordFormData, setPasswordFormData] = React.useState({
        currentPassword: "",
        newPassword: "",
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

    const { mutate: updatePassword, isLoading: updatingPassword } = useMutation(authUpdatePassword, {
        onMutate: (data: any) => {
            toast.loading("Loading... Please wait", {
                autoClose: false
            });
        },
        onSuccess: async (response: AxiosResponse) => {
            toast.dismiss();
            toast.success("Password updated successfully");
        },
        onError: (error: AxiosError) => {
            toast.dismiss();
            toast.error(error.response ? error.response.data.message : error.message);
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
                                    referrerPolicy="no-referrer"
                                    className="cursor-pointer w-44 h-44 object-cover rounded-full align-middle border-none shadow-lg"
                                    src={
                                        user.image && !uploadImage
                                            ? user.image
                                            : typeof uploadImage !== "string" && uploadImage !== null
                                            ? URL.createObjectURL(uploadImage as any)
                                            : `https://ui-avatars.com/api/?format=svg&background=bb3dbb&color=fff&name=${user.firstName}+${user.lastName}`
                                    }
                                    alt={user.firstName + " " + user.lastName}
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
                                        onChange={(e: any) => {
                                            if (!e.target.files[0]) return;
                                            setUploadedImage(e.target.files[0]);
                                        }}
                                    />

                                    <button
                                        disabled={updatingBioData}
                                        onClick={() => setUploadedImage("delete")}
                                        type="button"
                                        className="rounded-sm text-gray-700 text-center border-2 border-primary bg-white p-1.5 text-base disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed"
                                    >
                                        Delete Image
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="md:flex md:space-x-4 space-y-6 md:space-y-0">
                            <InputField
                                label="First Name"
                                value={bioFormData.firstName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBioFormData({ ...bioFormData, firstName: e.target.value })}
                                type="text"
                                required={true}
                                name="firstName"
                            />

                            <InputField
                                label="Last Name"
                                value={bioFormData.lastName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBioFormData({ ...bioFormData, lastName: e.target.value })}
                                type="text"
                                required={true}
                                name="lastName"
                            />
                        </div>

                        <InputField label="Email" value={user.email} onChange={() => {}} type="email" required={false} disabled={true} name="email" />

                        <div className="flex flex-col items-center md:items-end">
                            <button
                                disabled={updatingBioData}
                                type="submit"
                                className="font-Sora rounded-sm px-5 py-3 text-base font-medium text-center text-white bg-primary hover:bg-secondary disabled:bg-gray-300 disabled:cursor-not-allowed"
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
                            className="font-Sora rounded-sm px-5 py-3 text-base font-medium text-center text-white bg-primary hover:bg-secondary disabled:bg-gray-300 disabled:cursor-not-allowed"
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
