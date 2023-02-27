import React from "react";
import Image from "next/image";

import { Loading } from "../components";
import logo_trans from "../public/logo/logo_trans.png"
import man_using_gild from "../public/images/man-using-gild.jpg"

import type { NextPage } from "next";

const Home: NextPage = () => {
    return (
        <>
            {/* Main Section */}
            <div className="flex items-center h-screen w-full bg-gray-50">
                <div className="flex justify-between items-center flex-wrap mx-28">
                    <div className="text-gray-700">
                        <div className="flex place-items-center">
                            <div className="w-40 h-40 cursor-pointer">
                                <Image src={logo_trans} alt="logo" />
                            </div>
                            <h1 className="ml-8 font-Sora font-bold text-5xl text-secondary">GILD</h1>
                        </div>
                        <h1 className="font-Sora font-bold text-4xl mt-8 text-secondary">Welcome to <span className="text-primary">GILD</span></h1>
                        <p className="font-light text-xl mt-4">GILD is a platform that allows you send money across boarders</p>
                    </div>
                    <div className="w-1/3">
                        <Image className="rounded" placeholder="blur" src={man_using_gild} alt="man_using_gild" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
