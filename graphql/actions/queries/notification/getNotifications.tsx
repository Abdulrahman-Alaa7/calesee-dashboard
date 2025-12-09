import { gql, DocumentNode } from "@apollo/client";

export const GET_NOTIFICATIONS: DocumentNode = gql`
  query {
    getNotifications {
      id
      message
      theId
      status
      createdAt
      updatedAt
    }
  }
`;
