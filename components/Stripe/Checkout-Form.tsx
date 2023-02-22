import React from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface Props {
    success_url: String;
}

const StripeCheckoutForm = ({ success_url }: Props) => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [elementLoaded, setElementLoaded] = React.useState(false);

    React.useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }: any) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    // setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${process.env.BASE_URL}${success_url}`
            }
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            console.log("Payment error:", error);
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" className="w-full" onSubmit={handleSubmit}>
            <PaymentElement
                id="payment-element"
                onReady={() => {
                    setElementLoaded(true);
                }}
            />

            {elementLoaded ? (
                <button disabled={isLoading || !stripe || !elements} id="submit" className="btn-auth-form">
                    <span id="button-text">{isLoading ? "Processing..." : "Deposit"}</span>
                </button>
            ) : null}

            {/* Show any error or success messages */}
            <div className="w-full mt-3">
                {message && (
                    <div id="payment-message" className="text-center font-Poppins">
                        {message}
                    </div>
                )}
            </div>
        </form>
    );
};

export default StripeCheckoutForm;
