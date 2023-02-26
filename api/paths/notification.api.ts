import gql from "graphql-tag";

export const notificationGetAllMine = gql`
    query notificationGetAllMine($pagination: PaginationInput!) {
        data: notificationGetAllMine(pagination: $pagination) {
            notifications {
                id
                title
                message
                createdAt
                source {
                    name
                    image
                }
            }
            pagination {
                total
                next
                hasNext
            }
        }
    }
`;
