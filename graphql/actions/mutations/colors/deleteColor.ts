import { gql, DocumentNode } from "@apollo/client";

export const DELETE_COLOR: DocumentNode = gql`
  mutation deleteColor($id: String!) {
    deleteColor(id: $id) {
      message
    }
  }
`;
