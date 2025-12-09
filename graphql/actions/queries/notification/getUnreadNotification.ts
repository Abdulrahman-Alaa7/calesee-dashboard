import { gql, DocumentNode } from "@apollo/client";

export const GET_UNREAD_NOTIFICATIONS: DocumentNode = gql`
  query {
    getUnreadCount {
      count
    }
  }
`;
