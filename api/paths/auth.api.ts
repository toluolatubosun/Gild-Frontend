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

export const authLoginWithGoogle = gql`
    mutation authLoginWithGoogle($token: String!) {
        response: authLoginWithGoogle(token: $token) {
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

export const authVerifyEmail = gql`
    mutation authVerifyEmail($userId: ID!, $verifyToken: String!) {
        success: authVerifyEmail(userId: $userId, verifyToken: $verifyToken)
    }
`;

export const authRequestEmailVerification = gql`
    mutation authRequestEmailVerification($email: String!) {
        success: authRequestEmailVerification(email: $email)
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

export const authResetPassword = gql`
    mutation authResetPassword($userId: ID!, $resetToken: String!, $password: String!) {
        authResetPassword(userId: $userId, resetToken: $resetToken, password: $password)
    }
`;

export const authRequestPasswordReset = gql`
    mutation authRequestPasswordReset($email: String!) {
        success: authRequestPasswordReset(email: $email)
    }
`;

export const authUpdatePassword = gql`
    mutation authUpdatePassword($oldPassword: String!, $newPassword: String!) {
        success: authUpdatePassword(oldPassword: $oldPassword, newPassword: $newPassword)
    }
`;
