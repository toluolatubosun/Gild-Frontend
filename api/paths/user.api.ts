import gql from "graphql-tag";

export const userGetMe = gql`
    query {
        me {
            name
            username
        }
    }
`;

export const userGetMyProfile = gql`
    query {
        user: me {
            name
            role
            email
            image
            username
            business {
                city
                state
                country
                industry
                companySize
            }
        }
    }
`;

export const userUpdateMe = gql`
    mutation userUpdateMe($input: UserUpdateInput!) {
        user: userUpdateMe(input: $input) {
            id
        }
    }
`;
