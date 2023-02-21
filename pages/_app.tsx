import React from "react";
import Head from "next/head";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
    const [queryClient] = React.useState(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }));

    return (
        <>
            <Head>
                <title>Gild</title>
                <link rel="icon" href="/logo/favicon.ico" />
            </Head>

            <ToastContainer newestOnTop={true} pauseOnHover={false} autoClose={3000} />

            <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />

                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </>
    );
}

export default MyApp;
