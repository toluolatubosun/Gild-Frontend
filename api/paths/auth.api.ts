import gql from "graphql-tag";

export const authRegister = gql`
    mutation authRegister($input: RegisterInput!) {
        response: authRegister(input: $input) {
            user {
                email
            }
            token {
                accessToken
                refreshToken
            }
        }
    }
`;

export const authRegisterBusiness = gql`
    mutation authRegister($input: RegisterInput!, $businessData: BusinessDataInput) {
        response: authRegister(input: $input, businessData: $businessData) {
            user {
                email
            }
            token {
                accessToken
                refreshToken
            }
        }
    }
`;

export const authLogin = gql`
    mutation authLogin($input: LoginInput!) {
        response: authLogin(input: $input) {
            user {
                email
            }
            token {
                accessToken
                refreshToken
            }
        }
    }
`;

export const authRefreshAccessToken = gql`
    mutation authRefreshAccessToken($refreshToken: String!) {
        accessToken: authRefreshAccessToken(refreshToken: $refreshToken)
    }
`;

export const authLogout = gql`
    mutation authLogout($refreshToken: String!) {
        success: authLogout(refreshToken: $refreshToken)
    }
`;
