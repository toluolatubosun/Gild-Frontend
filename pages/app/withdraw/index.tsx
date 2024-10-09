import React from "react";
import Head from "next/head";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";

import { InputField, SideNavLayout } from "../../../components";
import { handleGraphQLError, useGQLMutation, useGQLQuery, withAuth } from "../../../utils";
import {
    walletGetMine,
    walletCompleteWithdrawal,
    walletResendWithdrawalOTP,
    walletInitializeWithdrawal,
    stripeSetupExpressAccount,
    stripeLoginToExpressAccount,
    userGetMyStripeAccountStatus
} from "../../../api";

import type { NextPage } from "next";

const Withdraw: NextPage = () => {
    const queryClient = useQueryClient();

    const [showBalance, setShowBalance] = React.useState<boolean>(false);
    const [wallet, setWallet] = React.useState<{ balance: number } | null>(null);
    const [stripeAccountStatus, setStripeAccountStatus] = React.useState<string | null>(null);

    const [withdrawalOTP, setWithdrawalOTP] = React.useState<string>("");
    const [withdrawalAmount, setWithdrawalAmount] = React.useState<number>(0);
    const [submittedWithdrawal, setSubmittedWithdrawal] = React.useState<boolean>(false);

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

    const { isLoading: isLoadingStripeAccount } = useGQLQuery(
        ["my-stripe-account-status"],
        { query: userGetMyStripeAccountStatus, variables: {} },
        {
            onSuccess: ({ user: { stripeAccountStatus } }: any) => {
                setStripeAccountStatus(stripeAccountStatus);
            },
            onError: (error: GraphQLErrorResponse) => {
                handleGraphQLError(error);
            }
        }
    );

    const { mutate: setupExpressAccount, isLoading: isSettingUpExpressAccount } = useGQLMutation(stripeSetupExpressAccount, {
        onMutate: () => {
            toast.loading("Redirecting to Stripe... Please wait", { autoClose: false });
        },
        onSuccess: ({ setupLink }) => {
            toast.dismiss();
            window.open(setupLink, "_blank");
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    const { mutate: loginToExpressAccount, isLoading: isLoggingToExpressAccount } = useGQLMutation(stripeLoginToExpressAccount, {
        onMutate: () => {
            toast.loading("Redirecting to Stripe... Please wait", { autoClose: false });
        },
        onSuccess: ({ loginLink }) => {
            toast.dismiss();
            window.open(loginLink, "_blank");
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    const { mutate: initializeWithdrawal, isLoading: isInitializingWithdrawal } = useGQLMutation(walletInitializeWithdrawal, {
        onMutate: () => {
            toast.loading("Sending OTP...", { autoClose: false });
        },
        onSuccess: () => {
            toast.dismiss();
            setSubmittedWithdrawal(true);
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    const { mutate: resendTransferOTP, isLoading: isResendingTransferOTP } = useGQLMutation(walletResendWithdrawalOTP, {
        onSuccess: () => {
            toast.dismiss();
            toast.success("OTP resent");
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    const { mutate: completeWithdrawal, isLoading: isCompletingWithdrawal } = useGQLMutation(walletCompleteWithdrawal, {
        onMutate: () => {
            toast.loading("Loading... Please wait", { autoClose: false });
        },
        onSuccess: async () => {
            toast.dismiss();
            toast.success("Withdrawal successful");

            closeModal();
            setWithdrawalAmount(0);
            setSubmittedWithdrawal(false);

            await queryClient.refetchQueries(["my-wallet"], { exact: true });
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    const manageStripeAccount = (status: string) => {
        if (status === "setup_incomplete" || status === "not_connected") {
            setupExpressAccount({});
        }

        if (status === "connected") {
            loginToExpressAccount({});
        }
    };

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        setWithdrawalOTP("");
        setWithdrawalAmount(0);
        setSubmittedWithdrawal(false);
    }

    return (
        <>
            <Head>
                <title>Deposit | Gild</title>
            </Head>

            <SideNavLayout isLoading={isLoadingWallet || isLoadingStripeAccount || stripeAccountStatus === null}>
                <div className="my-5">
                    <h1 className="font-Sora font-bold text-3xl">Withdraw</h1>
                </div>

                <div className="px-4 md:px-8 lg:px-16 py-12 bg-secondary rounded-lg shadow-lg text-center text-white md:mt-10">
                    <h1 className="font-Sora font-bold text-2xl md:text-3xl lg:text-4xl mt-5">
                        Withdraw your <span className="text-primary">GILD</span> tokens
                    </h1>

                    <p className="font-bold text-lg md:text-xl lg:text-2xl mt-5">
                        Take your <span className="text-primary">GILD</span> to your bank account
                    </p>

                    <button onClick={openModal} className="bg-primary text-secondary font-Sora font-bold tracking-wide text-lg md:text-xl lg:text-2xl px-6 py-2 rounded-sm mt-7">
                        Withdraw
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-5 lg:gap-y-0 mb-5">
                    <div className="px-4 md:px-8 lg:px-16 py-8 border-4 border-secondary rounded-lg shadow-lg text-center text-gray-700 md:mt-10">
                        <h1 className="font-Sora font-bold text-xl md:text-2xl lg:text-3xl">Wallet Balance</h1>
                        <div className="font-Sora font-bold text-lg md:text-xl lg:text-2xl mt-5">
                            <button onClick={() => setShowBalance(!showBalance)} className="text-primary">
                                {showBalance ? wallet?.balance.toLocaleString("en-US") || 0 : "****"} GILD
                            </button>
                        </div>
                    </div>

                    <div className="px-4 md:px-8 lg:px-16 py-8 border-4 border-secondary rounded-lg shadow-lg text-center text-gray-700 md:mt-10">
                        <h1 className="font-Sora font-bold text-xl md:text-2xl lg:text-3xl">Stripe Express Account</h1>
                        <div className="cursor-pointer font-Sora font-bold text-lg md:text-xl lg:text-2xl mt-5 text-primary">
                            {stripeAccountStatus === "connected" && "Connected"}
                            {stripeAccountStatus === "not_connected" && "Not Available"}
                            {stripeAccountStatus === "setup_incomplete" && "Setup Incomplete"}
                        </div>
                    </div>

                    <div className="px-4 md:px-8 lg:px-16 py-8 border-4 border-secondary rounded-lg shadow-lg text-center text-gray-700 md:mt-10 lg:col-span-2">
                        <h1 className="font-Sora font-bold text-xl md:text-2xl lg:text-3xl">Manage Stripe</h1>
                        <button
                            onClick={() => manageStripeAccount(stripeAccountStatus || "")}
                            disabled={isSettingUpExpressAccount || isLoggingToExpressAccount}
                            className="bg-secondary text-white font-Sora font-bold tracking-wide text-lg md:text-xl lg:text-2xl px-6 py-2 rounded-sm mt-5 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            {stripeAccountStatus === "connected" && "Login"}
                            {stripeAccountStatus === "setup_incomplete" && "Continue Setup"}
                            {stripeAccountStatus === "not_connected" && "Create Account"}
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

                    {!submittedWithdrawal && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                initializeWithdrawal({ amount: withdrawalAmount });
                            }}
                        >
                            <InputField
                                type="number"
                                required={true}
                                label="Amount of GILD"
                                name="withdrawalAmount"
                                value={withdrawalAmount || ""}
                                onChange={(e) => {
                                    parseInt(e.target.value) < 0 ? setWithdrawalAmount(0) : setWithdrawalAmount(parseInt(e.target.value));
                                }}
                            />

                            <p className="font-Sora font-bold my-4 text-gray-700">
                                <span className="text-primary">1 GILD</span> = $1
                            </p>

                            <button type="submit" className="btn-auth-form" disabled={submittedWithdrawal || isInitializingWithdrawal}>
                                Withdraw
                            </button>
                        </form>
                    )}

                    {submittedWithdrawal && (
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                completeWithdrawal({ amount: withdrawalAmount, OTP: withdrawalOTP });
                            }}
                        >
                            <InputField
                                type="number"
                                required={true}
                                label="Enter OTP"
                                name="withdrawalOTP"
                                value={withdrawalOTP || ""}
                                onChange={(e) => {
                                    parseInt(e.target.value) < 0 ? setWithdrawalOTP("0") : setWithdrawalOTP(e.target.value);
                                }}
                            />

                            <button
                                className="font-Sora font-bold tracking-wide text-primary disabled:text-gray-300 disabled:cursor-not-allowed"
                                disabled={isResendingTransferOTP}
                                onClick={(e) => {
                                    e.preventDefault();
                                    resendTransferOTP({ amount: withdrawalAmount });
                                }}
                            >
                                Resend OTP
                            </button>

                            <button type="submit" className="btn-auth-form" disabled={!submittedWithdrawal || isCompletingWithdrawal}>
                                Authorize
                            </button>
                        </form>
                    )}
                </div>
            </ReactModal>
        </>
    );
};

export default withAuth(Withdraw);
