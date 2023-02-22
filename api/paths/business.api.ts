import gql from "graphql-tag";

export const businessUpdateMine = gql`
    mutation businessUpdateMine($businessData: BusinessDataInput!) {
        business: businessUpdateMine(businessData: $businessData) {
            id
        }
    }
`;
