import React from "react";
import Head from "next/head";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";

import { settingsGetAll, settingsUpdate } from "../../../api";
import { InputField, SideNavLayout } from "../../../components";
import { handleGraphQLError, useGQLMutation, useGQLQuery, withAuth } from "../../../utils";

import type { NextPage } from "next";

const SystemSettings: NextPage = () => {
    const queryClient = useQueryClient();

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const [formData, setFormData] = React.useState({
        minimumTransfer: 0,
        maximumTransfer: 0,
        minimumDeposit: 0,
        maximumDeposit: 0,
        minimumWithdrawal: 0,
        maximumWithdrawal: 0,
        maximumDailyTransfer: 0
    });

    const { isLoading, mutate: updateSettings } = useGQLMutation(settingsUpdate, {
        onMutate: () => {
            toast.dismiss();
            toast.loading("Updating... Please wait", { autoClose: false });
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Settings updated successfully");
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    useGQLQuery(
        ["system-settings"],
        { query: settingsGetAll, variables: {} },
        {
            onSuccess: ({ settings }) => {
                setFormData(settings);
            },
            onError: (error: GraphQLErrorResponse) => {
                handleGraphQLError(error);
            }
        }
    );

    const handleSubmit = (e: any) => {
        e.preventDefault();
        updateSettings({ input: formData });
    };

    return (
        <>
            <Head>
                <title>System Settings | Gild</title>
            </Head>

            <SideNavLayout isAdmin={true}>
                <div className="my-5">
                    <h1 className="font-Sora font-bold text-3xl">System Settings</h1>
                </div>

                <div className="px-4 md:px-8 lg:px-16 py-12 bg-secondary rounded-lg shadow-lg text-center text-white md:mt-10">
                    <h1 className="font-Sora font-bold text-2xl md:text-3xl lg:text-4xl">
                        Configure various settings on <span className="text-primary">Gild</span>
                    </h1>
                    <p className="font-bold text-lg md:text-xl lg:text-2xl mt-5">Control how the application works by configuring various settings</p>
                    <button onClick={openModal} className="bg-primary text-secondary font-Sora font-bold tracking-wide text-lg md:text-xl lg:text-2xl px-6 py-2 rounded-sm mt-7">
                        Update Settings
                    </button>
                </div>

                <br />
            </SideNavLayout>

            <ReactModal
                ariaHideApp={false}
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Create User Modal"
                shouldCloseOnOverlayClick={false}
                className="bg-white p-5 w-3/4 rounded-sm shadow-2xl"
                overlayClassName="bg-black/50 fixed inset-0 z-50 flex items-center justify-center"
            >
                <div className="w-full">
                    <div className="flex place-content-end">
                        <MdClose onClick={closeModal} className="text-2xl cursor-pointer text-secondary hover:text-primary" />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="md:flex md:space-x-4 space-y-6 md:space-y-0">
                            <InputField
                                type="number"
                                required={true}
                                name="minimumTransfer"
                                label="Minimum Transfer"
                                value={formData.minimumTransfer}
                                onChange={(e) => setFormData({ ...formData, minimumTransfer: parseInt(e.target.value) })}
                            />

                            <InputField
                                type="number"
                                required={true}
                                name="maximumTransfer"
                                label="Maximum Transfer"
                                value={formData.maximumTransfer}
                                onChange={(e) => setFormData({ ...formData, maximumTransfer: parseInt(e.target.value) })}
                            />
                        </div>

                        <br />

                        <div className="md:flex md:space-x-4 space-y-6 md:space-y-0">
                            <InputField
                                type="number"
                                required={true}
                                name="minimumDeposit"
                                label="Minimum Deposit"
                                value={formData.minimumDeposit}
                                onChange={(e) => setFormData({ ...formData, minimumDeposit: parseInt(e.target.value) })}
                            />

                            <InputField
                                type="number"
                                required={true}
                                name="maximumDeposit"
                                label="Maximum Deposit"
                                value={formData.maximumDeposit}
                                onChange={(e) => setFormData({ ...formData, maximumDeposit: parseInt(e.target.value) })}
                            />
                        </div>

                        <br />

                        <div className="md:flex md:space-x-4 space-y-6 md:space-y-0">
                            <InputField
                                type="number"
                                required={true}
                                name="minimumWithdrawal"
                                label="Minimum Withdrawal"
                                value={formData.minimumWithdrawal}
                                onChange={(e) => setFormData({ ...formData, minimumWithdrawal: parseInt(e.target.value) })}
                            />

                            <InputField
                                type="number"
                                required={true}
                                name="maximumWithdrawal"
                                label="Maximum Withdrawal"
                                value={formData.maximumWithdrawal}
                                onChange={(e) => setFormData({ ...formData, maximumWithdrawal: parseInt(e.target.value) })}
                            />
                        </div>

                        <br />

                        <InputField
                            type="number"
                            required={true}
                            name="maximumDailyTransfer"
                            label="Maximum Daily Transfer"
                            value={formData.maximumDailyTransfer}
                            onChange={(e) => setFormData({ ...formData, maximumDailyTransfer: parseInt(e.target.value) })}
                        />

                        <br />

                        <button type="submit" className="btn-auth-form" disabled={isLoading}>
                            Update Settings
                        </button>
                    </form>
                </div>
            </ReactModal>
        </>
    );
};

export default withAuth(SystemSettings);
