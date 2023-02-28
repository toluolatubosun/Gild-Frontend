import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineBank } from "react-icons/ai";
import { GiTakeMyMoney } from "react-icons/gi";
import { HiOutlineBanknotes } from "react-icons/hi2";

import logo_trans from "../public/logo/logo_trans.png";
import man_using_gild from "../public/images/man-using-gild.jpg";

import type { NextPage } from "next";
import { Accordion } from "../components";

const Home: NextPage = () => {
    const steps = [
        {
            title: "Deposit",
            icon: "HiOutlineBanknotes",
            description:
                "To obtain GILD tokens, fund your GILD wallet with fiat currency. 1 GILD equals $1 ; this rate is constant. Additionally, you can deposit GILD tokens using any other supported currency; the exchange rate to $1 is determined using standard exchange rates."
        },
        {
            title: "Transfer",
            icon: "GiTakeMyMoney",
            description:
                "You can send tokens to any other GILD user using their email address or username. GILD transfer is considerably quicker than traditional bank transfers. The recipient will receive the GILD tokens in their GILD wallet, from which they can be withdrawn to a bank account."
        },
        {
            title: "Withdraw",
            icon: "AiOutlineBank",
            description:
                "Tokens can be withdrawn to a bank account, using a stripe express account. A stripe express account is a mini stripe account that allows us to collect the necessary information to facilitate withdrawal. Payouts are done in USD or converted to local currency using standard rates."
        }
    ];

    const faqs = [
        { title: "What is GILD?", body: "GILD is a platform that allows you send money across boarders" },
        { title: "What is GILD?", body: "GILD is a platform that allows you send money across boarders" },
        { title: "What is GILD?", body: "GILD is a platform that allows you send money across boarders" }
    ];

    return (
        <>
            {/* Main Section */}
            <div className="flex items-center min-h-screen w-full bg-gray-50">
                <div className="flex flex-col lg:flex-row justify-between items-center flex-wrap mx-10 md:mx-24 my-12 lg:my-0">
                    <div className="flex flex-col items-center lg:items-start text-black">
                        <div className="flex items-center justify-center lg:justify-start">
                            <div className="w-24 md:w-32 lg:w-40 cursor-pointer">
                                <Image src={logo_trans} alt="logo" />
                            </div>
                            <h1 className="ml-4 lg:ml-8 font-Sora font-bold text-secondary text-3xl md:text-4xl lg:text-5xl">GILD</h1>
                        </div>
                        <h1 className="font-Sora font-bold text-3xl md:text-4xl lg:text-5xl text-secondary mt-2 lg:mt-8 text-center lg:text-left">
                            Welcome to <span className="text-primary">GILD</span>
                        </h1>
                        <p className="font-light text-lg md:text-xl mt-2 text-center lg:text-left">GILD is a platform that allows you send money across boarders</p>
                        <Link href="/app">
                            <div className="font-Sora font-bold cursor-pointer hover:bg-primary bg-secondary tracking-wider rounded-sm text-white px-6 py-3 mt-4 text-lg lg:text-xl w-fit">
                                Get Started
                            </div>
                        </Link>
                    </div>
                    <div className="w-1/2 md:w-2/3 lg:w-1/3 mt-8 lg:mt-0">
                        <Image className="rounded-xl" placeholder="blur" src={man_using_gild} alt="man_using_gild" />
                    </div>
                </div>
            </div>

            {/* How to use Section */}
            <div className="flex items-center min-h-screen w-full bg-secondary text-white">
                <div className="mx-10 md:mx-24 my-12 lg:my-0 w-full">
                    <h1 className="font-Sora font-bold text-3xl md:text-4xl lg:text-5xl">
                        <span className="text-primary">GILD</span> works in 3 easy steps
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 w-full mt-2 lg:mt-20 lg:space-x-8">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center mt-8 lg:mt-0 ring-4 ring-primary rounded-sm px-6 py-8">
                                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary text-secondary">
                                    {step.icon === "HiOutlineBanknotes" && <HiOutlineBanknotes className="text-3xl" />}
                                    {step.icon === "GiTakeMyMoney" && <GiTakeMyMoney className="text-3xl" />}
                                    {step.icon === "AiOutlineBank" && <AiOutlineBank className="text-3xl" />}
                                </div>
                                <h1 className="font-Sora font-bold text-2xl mt-4">{step.title}</h1>
                                <p className="text-lg mt-2 text-center">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="flex items-center min-h-screen w-full bg-gray-100 text-secondary">
                <div className="mx-10 md:mx-24 my-12 lg:my-0 w-full">
                    <h1 className="font-Sora font-bold text-3xl md:text-4xl lg:text-5xl">Frequently Asked Questions</h1>

                    <div className="w-full mt-10 lg:mt-16">
                        {faqs.map((faq, index) => (
                            <Accordion key={index} title={faq.title} body={faq.body} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
