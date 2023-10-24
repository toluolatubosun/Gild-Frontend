import jwtDecode from "jwt-decode";
import { GraphQLClient, request } from "graphql-request";
import { hasCookie, getCookie, deleteCookie, setCookie } from "cookies-next";

import { authRefreshAccessToken } from "./paths/auth.api";

import type { RequestInit } from "graphql-request/dist/types.dom";

const deleteAuthTokens = () => {
    deleteCookie("access_token");
    deleteCookie("refresh_token");
};

// Refresh access token if expired
const refreshAccessToken = async () => {
    if (hasCookie("access_token") && hasCookie("refresh_token")) {
        const accessToken: any = await jwtDecode(getCookie("access_token") as string);
        const refreshToken: any = await jwtDecode(getCookie("refresh_token") as string);

        // Check if access token is expired
        if (accessToken.exp < Date.now() / 1000) {
            // Check if refresh has not expired
            if (refreshToken.exp > Date.now() / 1000) {
                // Refresh access token
                try {
                    const response = await request(baseURL, authRefreshAccessToken, { refreshToken: getCookie("refresh_token") });

                    if (response.accessToken) {
                        const { accessToken: newAccessToken } = response;
                        setCookie("access_token", newAccessToken);
                        return;
                    } else {
                        deleteAuthTokens();
                        return;
                    }
                } catch (error) {
                    deleteAuthTokens();
                    return;
                }
            } else {
                deleteAuthTokens();
                return;
            }
        }
    }

    return;
};

const requestMiddleware = async (request: RequestInit) => {
    const customHeaders = {} as any;

    await refreshAccessToken();

    if (getCookie("access_token")) {
        customHeaders["Authorization"] = `Bearer ${getCookie("access_token")}`;
    }

    return {
        ...request,
        headers: {
            ...request.headers,
            ...customHeaders
        }
    };
};

const baseURL = process.env.BACKEND_GRAPHQL_URL as string;

const options = {
    requestMiddleware
};

const $http = new GraphQLClient(baseURL, options);

export default $http;
