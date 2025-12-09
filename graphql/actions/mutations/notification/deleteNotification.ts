import { gql, DocumentNode } from "@apollo/client";

export const DELETE_NOTIFICATION: DocumentNode = gql`
  mutation DeleteNotification($id: String!) {
    deleteNotification(id: $id) {
      message
    }
  }
`;
