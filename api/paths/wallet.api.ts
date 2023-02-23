import gql from "graphql-tag";

export const walletGetMine = gql`
    query walletGetMine {
        wallet: walletGetMine {
            balance
        }
    }
`;

export const walletInitializeDeposit = gql`
    mutation walletInitializeDeposit($amount: Int!, $currencyCode: String!) {
        clientSecret: walletInitializeDeposit(amount: $amount, currencyCode: $currencyCode)
    }
`;

export const walletInitializeWithdrawal = gql`
    mutation walletInitializeWithdrawal($amount: Int!) {
        success: walletInitializeWithdrawal(amount: $amount)
    }
`;

export const walletCompleteWithdrawal = gql`
    mutation walletCompleteWithdrawal($amount: Int!, $OTP: String!) {
        success: walletCompleteWithdrawal(amount: $amount, OTP: $OTP)
    }
`;
