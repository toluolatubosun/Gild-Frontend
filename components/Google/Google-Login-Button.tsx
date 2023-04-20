import React from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";

import { authLoginWithGoogle } from "../../api";
import { handleGraphQLError, useGQLMutation } from "../../utils";

declare global {
    interface Window {
        GoogleAuthSuccess?: any;
    }
}

const GoogleLogin = ({ clientId }: { clientId: string }) => {
    const router = useRouter();
    // Hook
    const { mutate } = useGQLMutation(authLoginWithGoogle, {
        onMutate: () => {
            toast.info("Logging in with Google...", {
                autoClose: false
            });
        },
        onSuccess: ({ response }: any) => {
            toast.dismiss();

            setCookie("access_token", response.token.accessToken);
            setCookie("refresh_token", response.token.refreshToken);

            if (response.user.role === "admin") {
                router.replace("/admin");
            } else {
                router.replace("/app");
            }
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    // Pass the credentials to the API
    const GoogleAuthSuccess = (response: any) => {
        mutate({ token: response?.credential });
    };

    // Set the global function
    if (typeof window !== "undefined") {
        window.GoogleAuthSuccess = GoogleAuthSuccess;
    }

    // Load Script
    const scriptRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const script = document.createElement("script");

        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;

        if (scriptRef.current) {
            scriptRef.current.appendChild(script);
        }

        return () => {
            scriptRef.current?.removeChild(script);
        };
    }, [scriptRef]);

    return (
        <>
            <div ref={scriptRef}></div>

            {/* Configuration */}
            <div id="g_id_onload" data-client_id={clientId} data-text="Continue with google" data-auto_prompt="false" data-callback="GoogleAuthSuccess"></div>

            {/* Render Button */}
            <div className="flex flex-col items-center">
                <div className="g_id_signin" data-type="standard" data-size="large" data-theme="outline" data-text="continue_with" data-shape="rectangular" data-logo_alignment="center"></div>
            </div>
        </>
    );
};

export default GoogleLogin;
