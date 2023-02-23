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

        // Retrieve the "setup_intent_client_secret" query parameter appended to
        // your return_url by Stripe.js
        const clientSecret = new URLSearchParams(window.location.search).get("setup_intent_client_secret");

        if (!clientSecret) {
            return;
        }

        // Retrieve the SetupIntent
        stripe.retrieveSetupIntent(clientSecret).then(({ setupIntent }) => {
            if (setupIntent) {
                // Inspect the SetupIntent `status` to indicate the status of the payment
                // to your customer.
                //
                // Some payment methods will [immediately succeed or fail][0] upon
                // confirmation, while others will first enter a `processing` state.
                //
                // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
                switch (setupIntent.status) {
                    case "succeeded":
                        setMessage("Success! Your payment method has been saved.");
                        break;

                    case "processing":
                        setMessage("Processing payment details. We'll update you when processing is complete.");
                        break;

                    case "requires_payment_method":
                        // Redirect your user back to your payment page to attempt collecting
                        // payment again
                        setMessage("Failed to process payment details. Please try another payment method.");
                        break;
                }
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

        const { error } = await stripe.confirmSetup({
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
        if (error) {
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Show error to your customer (for example, payment
            // details incomplete)
            setMessage(error.message);
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
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
                    <span id="button-text">{isLoading ? "Processing..." : "Save Card"}</span>
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
