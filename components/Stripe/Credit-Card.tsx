import React from "react";
import Cards from "react-credit-cards";
import { AiOutlineDelete } from "react-icons/ai";
import "react-credit-cards/es/styles-compiled.css";

import type { Focused } from "react-credit-cards";

interface Props {
    number: string;
    name: string;
    expiry: string;
    cvc: string;
    preview?: boolean;
    issuer?: string;
    deleteCard: () => void;
    deletingCard?: boolean;
}

function Card({ number, name, expiry, cvc, preview, issuer, deleteCard, deletingCard }: Props) {
    const [cardFocus, setCardFocus] = React.useState<Focused>("name");
    return (
        <div id="PaymentForm" className="cursor-pointer flex flex-col justify-center items-center space-y-4">
            <div className="w-max" onMouseOver={() => setCardFocus("cvc")} onMouseLeave={() => setCardFocus("name")}>
                <Cards issuer={issuer} preview={preview} cvc={cvc} expiry={expiry} focused={cardFocus} name={name} number={number} />
            </div>
            <div className="flex items-center justify-center space-x-5">
                <button onClick={deleteCard} disabled={deletingCard}>
                    <AiOutlineDelete className="text-red-500 text-xl" />
                </button>
            </div>
        </div>
    );
}

export default Card;
