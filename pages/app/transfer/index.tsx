import React from "react";
import Head from "next/head";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";

import { InputField, SideNavLayout } from "../../../components";
import { handleGraphQLError, useGQLMutation, useGQLQuery, withAuth } from "../../../utils";
import { walletCompleteTransfer, walletGetMine, walletInitializeTransfer, walletResendTransferOTP } from "../../../api";

import type { NextPage } from "next";

const Transfer: NextPage = () => {
    const queryClient = useQueryClient();

    const [showBalance, setShowBalance] = React.useState<boolean>(false);
    const [wallet, setWallet] = React.useState<{ balance: number } | null>(null);

    const [transferOTP, setTransferOTP] = React.useState<string>("");
    const [submittedTransfer, setSubmittedTransfer] = React.useState<boolean>(false);
    const [transferData, setTransferData] = React.useState({ amount: 0, receiverId: "" });

    const { isLoading: isLoadingWallet } = useGQLQuery(
        ["my-wallet"],
        { query: walletGetMine, variables: {} },
        {
            onSuccess: ({ wallet }: any) => {
                setWallet(wallet);
            },
            onError: (error: GraphQLErrorResponse) => {
                handleGraphQLError(error);
            }
        }
    );

    const { mutate: initializeTransfer, isLoading: isInitializingTransfer } = useGQLMutation(walletInitializeTransfer, {
        onMutate: () => {
            toast.loading("Sending OTP...", { autoClose: false });
        },
        onSuccess: () => {
            toast.dismiss();
            setSubmittedTransfer(true);
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    const { mutate: resendTransferOTP, isLoading: isResendingTransferOTP } = useGQLMutation(walletResendTransferOTP, {
        onSuccess: () => {
            toast.dismiss();
            toast.success("OTP resent");
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    const { mutate: completeTransfer, isLoading: isCompletingTransfer } = useGQLMutation(walletCompleteTransfer, {
        onMutate: () => {
            toast.loading("Sending OTP...", { autoClose: false });
        },
        onSuccess: async () => {
            toast.dismiss();
            toast.success("Transfer successful");

            closeModal();
            setSubmittedTransfer(false);
            setTransferData({ amount: 0, receiverId: "" });

            await queryClient.refetchQueries(["my-wallet"], { exact: true });
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        setTransferOTP("");
        setSubmittedTransfer(false);
        setTransferData({ amount: 0, receiverId: "" });
    }

    return (
        <>
            <Head>
                <title>Transfer | Gild</title>
            </Head>

            <SideNavLayout isLoading={isLoadingWallet}>
                <div className="my-5">
                    <h1 className="font-Sora font-bold text-3xl">Transfer</h1>
                </div>

                <div className="px-4 md:px-8 lg:px-16 py-12 bg-secondary rounded-lg shadow-lg text-center text-white md:mt-10">
                    <h1 className="font-Sora font-bold text-2xl md:text-3xl lg:text-4xl mt-5">
                        Transfer <span className="text-primary">GILD</span> tokens
                    </h1>

                    <p className="font-bold text-lg md:text-xl lg:text-2xl mt-5">
                        Send <span className="text-primary">GILD</span> to your family and friends
                    </p>

                    <button onClick={openModal} className="bg-primary text-secondary font-Sora font-bold tracking-wide text-lg md:text-xl lg:text-2xl px-6 py-2 rounded-sm mt-7">
                        Transfer
                    </button>
                </div>

                <div className="px-4 md:px-8 lg:px-16 py-8 border-4 border-secondary rounded-lg shadow-lg text-center text-gray-700 md:mt-10">
                    <h1 className="font-Sora font-bold text-xl md:text-2xl lg:text-3xl">Wallet Balance</h1>
                    <div className="font-Sora font-bold text-lg md:text-xl lg:text-2xl mt-5">
                        <button onClick={() => setShowBalance(!showBalance)} className="text-primary">
                            {showBalance ? wallet?.balance.toLocaleString("en-US") || 0 : "****"} GILD
                        </button>
                    </div>
                </div>
            </SideNavLayout>

            <ReactModal
                ariaHideApp={false}
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Deposit Modal"
                shouldCloseOnOverlayClick={false}
                className="bg-white p-5 w-3/4 lg:w-2/5 rounded-sm shadow-2xl"
                overlayClassName="bg-black/50 fixed inset-0 z-50 flex items-center justify-center"
            >
                <div className="w-full">
                    <div className="flex place-content-end">
                        <MdClose onClick={closeModal} className="text-2xl cursor-pointer text-secondary hover:text-primary" />
                    </div>

                    {!submittedTransfer && (
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                initializeTransfer(transferData);
                            }}
                        >
                            <InputField
                                type="text"
                                required={true}
                                label="Email / Username"
                                name="transferReceiver"
                                value={transferData.receiverId}
                                onChange={(e) => {
                                    setTransferData({ ...transferData, receiverId: e.target.value });
                                }}
                            />

                            <InputField
                                type="number"
                                required={true}
                                label="Amount of GILD"
                                name="transferAmount"
                                value={transferData.amount || ""}
                                onChange={(e) => {
                                    parseInt(e.target.value) < 0 ? setTransferData({ ...transferData, amount: 0 }) : setTransferData({ ...transferData, amount: parseInt(e.target.value) });
                                }}
                            />

                            <button type="submit" className="btn-auth-form" disabled={submittedTransfer || isInitializingTransfer}>
                                Transfer
                            </button>
                        </form>
                    )}

                    {submittedTransfer && (
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                completeTransfer({ ...transferData, OTP: transferOTP });
                                setTransferOTP("");
                            }}
                        >
                            <InputField
                                type="number"
                                required={true}
                                label="Enter OTP"
                                name="transferOTP"
                                value={transferOTP || ""}
                                onChange={(e) => {
                                    parseInt(e.target.value) < 0 ? setTransferOTP("0") : setTransferOTP(e.target.value);
                                }}
                            />

                            <button
                                className="font-Sora font-bold tracking-wide text-primary disabled:text-gray-300 disabled:cursor-not-allowed"
                                disabled={isResendingTransferOTP}
                                onClick={(e) => {
                                    e.preventDefault();
                                    resendTransferOTP(transferData);
                                }}
                            >
                                Resend OTP
                            </button>

                            <button type="submit" className="btn-auth-form" disabled={!submittedTransfer || isCompletingTransfer}>
                                Authorize
                            </button>
                        </form>
                    )}
                </div>
            </ReactModal>
        </>
    );
};

export default withAuth(Transfer);
