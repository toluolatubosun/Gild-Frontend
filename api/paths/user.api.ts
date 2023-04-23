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

export const userCreate = gql`
    mutation userCreate($input: UserDataInput!) {
        user: userCreate(input: $input) {
            id
        }
    }
`;

export const userGetAll = gql`
    query users($pagination: PaginationInput!) {
        data: users(pagination: $pagination) {
            users {
                id
                name
                role
                email
                isActive
                wallet {
                    balance
                }
            }
            pagination {
                total
                next
                hasNext
            }
        }
    }
`;

export const userUpdate = gql`
    mutation userUpdate($userId: ID!, $input: UserDataInput!) {
        data: userUpdate(userId: $userId, input: $input) {
            id
        }
    }
`;
