import gql from "graphql-tag";

export const stripeGetMyCards = gql`
    query stripeGetMyCards {
        cards: stripeGetMyCards {
            id
            brand
            expiryYear
            expiryMonth
            lastFourDigits
        }
    }
`;

export const stripeDeleteMyCard = gql`
    mutation stripeDeleteMyCard($cardId: String!) {
        success: stripeDeleteMyCard(cardId: $cardId)
    }
`;

export const stripeAttachCard = gql`
    mutation stripeAttachCard {
        clientSecret: stripeAttachCard
    }
`;
