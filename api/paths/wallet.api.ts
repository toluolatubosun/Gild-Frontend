import gql from "graphql-tag";

export const walletGetMine = gql`
    query walletGetMine {
        wallet: walletGetMine {
            balance
        }
    }
`;
