import { gql, DocumentNode } from "@apollo/client";

export const DELETE_ALL_NOTIFICATIONS: DocumentNode = gql`
  mutation DeleteReadNotifications {
    deleteReadNotifications {
      message
    }
  }
`;
