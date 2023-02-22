import React from "react";
import Link from "next/link";
import { createPopper } from "@popperjs/core";

import { useUser } from "../../../utils";

interface Props {
    image: string;
}

const UserDropDown = ({ image }: Props) => {
    // dropdown props
    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    const btnDropdownRef: any = React.createRef();
    const popoverDropdownRef: any = React.createRef();

    const openDropdownPopover = () => {
        createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
            placement: "bottom-end"
        });
        setDropdownPopoverShow(true);
    };

    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };

    return (
        <>
            <button
                className="text-blueGray-500 block"
                ref={btnDropdownRef}
                onClick={(e) => {
                    e.preventDefault();
                    dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
                }}
            >
                <div className="items-center flex">
                    <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                        <img referrerPolicy="no-referrer" alt="user" className="w-full h-12 object-cover rounded-full align-middle border-none shadow-lg" src={image} />
                    </span>
                </div>
            </button>

            <div ref={popoverDropdownRef} className={(dropdownPopoverShow ? "block " : "hidden ") + "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"}>
                <Link href="/app/loan" passHref>
                    <button className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">Loan</button>
                </Link>

                <div className="h-0 my-2 border border-solid border-blueGray-100" />

                <Link href="/app/user" passHref>
                    <button className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">Profile</button>
                </Link>

                <div className="h-0 my-2 border border-solid border-blueGray-100" />

                <Link href="/auth/logout" passHref>
                    <button className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">Logout</button>
                </Link>
            </div>
        </>
    );
};

export default UserDropDown;
