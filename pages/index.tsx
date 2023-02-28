import React from "react";
import Link from "next/link";
import Image from "next/image";

import logo_trans from "../public/logo/logo_trans.png";
import man_using_gild from "../public/images/man-using-gild.jpg";

import type { NextPage } from "next";

const Home: NextPage = () => {
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
        </>
    );
};

export default Home;
