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
