import AOS from "aos";
import React from "react";
import Head from "next/head";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function MyApp({ Component, pageProps }: any) {
    const [queryClient] = React.useState(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }));

    React.useEffect(() => {
        AOS.init({ duration: 1500 });
        AOS.refresh();
    }, []);

    return (
        <>
            <Head>
                <title>Gild</title>
                <link rel="icon" href="/logo/favicon.ico" />
            </Head>

            <ToastContainer newestOnTop={true} pauseOnHover={false} autoClose={3000} />

            <QueryClientProvider client={queryClient}>
                <div className="font-Poppins break-words overflow-x-clip">
                    <Component {...pageProps} />
                </div>

                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </>
    );
}

export default MyApp;
