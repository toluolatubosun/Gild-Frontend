import gql from "graphql-tag";

export const transactionGetStats = gql`
    query TransactionsStats {
        stats: transactionsGetStats {
            totalDepositCount
            totalDepositAmount
            totalTransferCount
            totalTransferAmount
            totalWithdrawalCount
            totalWithdrawalAmount
        }
    }
`;
