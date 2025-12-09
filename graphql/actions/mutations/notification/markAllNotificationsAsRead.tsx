import { gql, DocumentNode } from "@apollo/client";

export const MARK_ALL_NOTIFICATION: DocumentNode = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead {
      message
    }
  }
`;
