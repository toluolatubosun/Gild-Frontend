import gql from "graphql-tag";

export const userGetMe = gql`
    query {
        me {
            name
            role
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

export const userGetMyStripeAccountStatus = gql`
    query {
        user: me {
            stripeAccountStatus
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
