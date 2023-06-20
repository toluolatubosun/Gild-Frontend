import gql from "graphql-tag";

export const settingsGetAll = gql`
    query SystemSettings {
        settings {
            minimumTransfer
            maximumTransfer
            minimumDeposit
            maximumDeposit
            minimumWithdrawal
            maximumWithdrawal
            maximumDailyTransfer
        }
    }
`;

export const settingsUpdate = gql`
    mutation SystemSettingsUpdate($input: SystemSettingsInput!) {
        settingsUpdate(input: $input) {
            minimumTransfer
            maximumTransfer
            minimumDeposit
            maximumDeposit
            minimumWithdrawal
            maximumWithdrawal
            maximumDailyTransfer
        }
    }
`;
