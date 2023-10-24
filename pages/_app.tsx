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

        // ping server to start it up
        fetch(process.env.BACKEND_BASE_URL as string)
        .catch((err) => console.log(err));
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
                {Boolean(process.env.TEST_MODE) === true && (
                    <div className="fixed bottom-0 right-0 z-50 p-2 text-sm text-white bg-primary rounded-tl-md border-l-2 border-t-2 border-secondary">
                        <span className="font-bold text-secondary">TEST MODE</span>
                    </div>
                )}
                    <Component {...pageProps} />
                </div>

                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </>
    );
}

export default MyApp;
