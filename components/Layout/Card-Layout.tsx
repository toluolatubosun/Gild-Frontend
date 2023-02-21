import Link from "next/link";
import Image from "next/image";

import logo_trans from "../../public/logo/logo_trans.png";

const CardLayout = (props: any) => {
    return (
        <>
            <div className="h-full">
                <div className="flex flex-col items-center justify-center h-full min-h-screen py-16 bg-cover bg-center bg-blend-darken bg-primary">
                    <div className={`w-full ${props.large ? "max-w-4xl" : "max-w-lg"}`}>
                        <div className="bg-white shadow-xl rounded px-8 pt-6 pb-8 mb-4 ">
                            <div className="mb-4 flex justify-center">
                                <Link href="/" passHref>
                                    <div className="w-44 h-44 cursor-pointer">
                                        <Image src={logo_trans} alt="logo" />
                                    </div>
                                </Link>
                            </div>

                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CardLayout;
