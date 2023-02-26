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
                    username
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
