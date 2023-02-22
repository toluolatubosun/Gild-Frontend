import gql from "graphql-tag";

export const currencyGetAll = gql`
    query currencies {
        currencies {
            name
            code
            gildRate
        }
    }
`;
