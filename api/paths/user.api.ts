import gql from "graphql-tag";

export const userGetMe = gql`
    query {
        me {
            name
            username
        }
    }
`;
