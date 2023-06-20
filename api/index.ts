import gql from "graphql-tag";

export const HelloWord = gql`
    query {
        hello
    }
`;

export * from "./paths/user.api";
export * from "./paths/auth.api";
export * from "./paths/wallet.api";
export * from "./paths/stripe.api";
export * from "./paths/business.api";
export * from "./paths/currency.api";
export * from "./paths/settings.api";
export * from "./paths/notification.api";
