import { gql, DocumentNode } from "@apollo/client";

export const MARK_NOTIFICATION: DocumentNode = gql`
  mutation MarkNotificationAsRead($id: String!) {
    markNotificationAsRead(id: $id) {
      message
    }
  }
`;
