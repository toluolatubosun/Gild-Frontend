import React from "react";
import Head from "next/head";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useQueryClient } from "@tanstack/react-query";

import { SideNavLayout, CreditCard, Loading, StripeAddCardForm } from "../../../components";
import { stripeAttachCard, stripeDeleteMyCard, stripeGetMyCards } from "../../../api";
import { handleGraphQLError, useGQLMutation, useGQLQuery, withAuth } from "../../../utils";

import type { NextPage } from "next";

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY as any);

const Cards: NextPage = () => {
    const queryClient = useQueryClient();

    const [clientSecret, setClientSecret] = React.useState<string | null>(null);
    const options = {
        clientSecret,
        appearance: {
            theme: "stripe"
        }
    };

    const [cards, setCards] = React.useState<CreditCard[]>([]);

    const { isLoading } = useGQLQuery(
        ["my-cards"],
        { query: stripeGetMyCards, variables: {} },
        {
            onSuccess: ({ cards }) => {
                setCards(cards);
            },
            onError: (error: GraphQLErrorResponse) => {
                handleGraphQLError(error);
            }
        }
    );

    const { mutate: attachCard, isLoading: isAttachingCard } = useGQLMutation(stripeAttachCard, {
        onSuccess: ({ clientSecret }) => {
            setClientSecret(clientSecret);
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    const startAttachCard = () => {
        openModal();

        if (clientSecret === null && !isAttachingCard) {
            attachCard({});
        }
    };

    const { mutate: deleteCard, isLoading: isDeletingCard } = useGQLMutation(stripeDeleteMyCard, {
        onMutate: () => {
            toast.loading("Deleting Card... Please wait", { autoClose: false });
        },
        onSuccess: async () => {
            toast.dismiss();
            toast.success("Card deleted successfully");
            setCards(cards.filter((card) => card.id !== card.id));

            await queryClient.refetchQueries(["my-cards"], { exact: true });
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <>
            <Head>
                <title>Cards | Gild</title>
            </Head>

            <SideNavLayout isLoading={isLoading}>
                <div className="my-5">
                    <h1 className="font-Sora font-bold text-3xl">Cards</h1>
                </div>

                <div className="px-4 md:px-8 lg:px-16 py-12 bg-secondary rounded-lg shadow-lg text-center text-white md:mt-10">
                    <h1 className="font-Sora font-bold text-2xl md:text-3xl lg:text-4xl">Manage Cards</h1>

                    <p className="font-bold text-lg md:text-xl lg:text-2xl mt-5">Supercharge your convenience</p>

                    <button onClick={startAttachCard} className="bg-primary text-secondary font-Sora font-bold tracking-wide text-lg md:text-xl lg:text-2xl px-6 py-2 rounded-sm mt-7">
                        Add Card
                    </button>
                </div>

                <div className="my-5 md:mt-10">
                    {cards.length === 0 && (
                        <div className="flex flex-col items-center justify-center">
                            <h1 className="font-Sora font-bold text-gray-700 text-3xl">No Cards Found</h1>
                        </div>
                    )}
                    {cards.length > 0 && (
                        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                            {cards.map((card) => (
                                <CreditCard
                                    name=" "
                                    cvc="***"
                                    key={card.id}
                                    preview={true}
                                    issuer={card.brand}
                                    deletingCard={isDeletingCard}
                                    number={`**** **** **** ${card.lastFourDigits}`}
                                    deleteCard={() => deleteCard({ cardId: card.id })}
                                    expiry={`${card.expiryMonth}/${card.expiryYear}`}
                                />
                            ))}
                        </div>
                    )}
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
                    {(clientSecret === null || isAttachingCard) && <Loading isParent={false} />}
                    {clientSecret !== null && !isAttachingCard && (
                        <Elements options={options as any} stripe={stripePromise}>
                            <StripeAddCardForm success_url={"/app/cards"} />
                        </Elements>
                    )}
                </div>
            </ReactModal>
        </>
    );
};

export default withAuth(Cards);
