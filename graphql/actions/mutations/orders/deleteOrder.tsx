import { gql, DocumentNode } from "@apollo/client";

export const DELETE_ORDER: DocumentNode = gql`
  mutation deleteOrder($id: String!) {
    deleteOrder(id: $id) {
      message
    }
  }
`;
