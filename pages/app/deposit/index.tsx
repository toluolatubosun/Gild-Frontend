import React from "react";
import Head from "next/head";
import ReactModal from "react-modal";
import { MdClose } from "react-icons/md";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { currencyGetAll, walletGetMine, walletInitializeDeposit } from "../../../api";
import { handleGraphQLError, useGQLMutation, useGQLQuery, withAuth } from "../../../utils";
import { InputField, Loading, SelectField, SideNavLayout, StripeCheckoutForm } from "../../../components";

import type { NextPage } from "next";

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY as any);

const Deposit: NextPage = () => {
    const [showBalance, setShowBalance] = React.useState<boolean>(false);
    const [wallet, setWallet] = React.useState<{ balance: number } | null>(null);

    const [currencies, setCurrencies] = React.useState<any>([]);

    const [amount, setAmount] = React.useState<number>(0);
    const [selectedCurrency, setSelectedCurrency] = React.useState<any>("");
    const [submittedDeposit, setSubmittedDeposit] = React.useState<boolean>(false);

    const [clientSecret, setClientSecret] = React.useState<string | null>(null);
    const options = {
        clientSecret,
        appearance: {
            theme: "stripe"
        }
    };

    useGQLQuery(
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

    useGQLQuery(
        ["currencies"],
        { query: currencyGetAll, variables: {} },
        {
            onSuccess: ({ currencies }: any) => {
                setCurrencies(currencies);
            },
            onError: (error: GraphQLErrorResponse) => {
                handleGraphQLError(error);
            }
        }
    );

    const { mutate: initializeDeposit } = useGQLMutation(walletInitializeDeposit, {
        onSuccess: ({ clientSecret }: any) => {
            setClientSecret(clientSecret);
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    const DepositFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmittedDeposit(true);
        initializeDeposit({ amount, currencyCode: selectedCurrency });
    };

    const [modalIsOpen, setIsOpen] = React.useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <>
            <Head>
                <title>Deposit | Gild</title>
            </Head>

            <SideNavLayout>
                <div className="my-5">
                    <h1 className="font-Sora font-bold text-3xl">Deposit</h1>
                </div>

                <div className="px-4 md:px-8 lg:px-16 py-12 bg-secondary rounded-lg shadow-lg text-center text-white md:mt-10">
                    <p className="font-Sora font-bold text-base md:text-lg lg:text-xl">
                        <span className="text-primary">1 GILD</span> = $1
                    </p>

                    <h1 className="font-Sora font-bold text-2xl md:text-3xl lg:text-4xl mt-5">
                        Wallet Balance :{" "}
                        <button onClick={() => setShowBalance(!showBalance)} className="text-primary">
                            {showBalance ? wallet?.balance.toLocaleString("en-US") || 0 : "****"} GILD
                        </button>
                    </h1>

                    <button onClick={openModal} className="bg-primary text-secondary font-Sora font-bold tracking-wide text-lg md:text-xl lg:text-2xl px-6 py-2 rounded-sm mt-7">
                        Deposit
                    </button>
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

                    {!submittedDeposit && (
                        <form onSubmit={DepositFormSubmit}>
                            <SelectField
                                required={true}
                                name="PaymentCurrency"
                                label="Payment Currency"
                                value={selectedCurrency}
                                options={currencies.map((currency: any) => ({ label: currency.name, value: currency.code }))}
                                onChange={(e) => setSelectedCurrency(e.target.value)}
                            />

                            <br />

                            <InputField
                                name="Amount"
                                type="number"
                                required={true}
                                value={amount || ""}
                                label="Amount of GILD to deposit"
                                onChange={(e) => {
                                    parseInt(e.target.value) < 0 ? setAmount(0) : setAmount(parseInt(e.target.value));
                                }}
                            />

                            <p className="font-Sora text-secondary font-bold my-5">
                                {amount > 0 ? amount.toLocaleString("en-US") : 1} GILD ={" "}
                                {selectedCurrency
                                    ? parseFloat((currencies.find((currency: any) => currency.code === selectedCurrency)?.gildRate * (amount || 1)).toFixed(2)).toLocaleString("en-US")
                                    : (amount || 1) * 1}{" "}
                                {selectedCurrency || "USD"}
                            </p>

                            <button type="submit" className="btn-auth-form" disabled={submittedDeposit || amount <= 0 || !selectedCurrency || clientSecret !== null}>
                                Deposit
                            </button>
                        </form>
                    )}

                    {submittedDeposit && clientSecret && (
                        <Elements options={options as any} stripe={stripePromise}>
                            <StripeCheckoutForm success_url={"/app/deposit"} />
                        </Elements>
                    )}

                    {submittedDeposit && !clientSecret && <Loading isParent={false} />}
                </div>
            </ReactModal>
        </>
    );
};

export default withAuth(Deposit);
