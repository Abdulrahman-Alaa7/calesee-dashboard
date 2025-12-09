import { gql, DocumentNode } from "@apollo/client";

export const DELETE_SIZE: DocumentNode = gql`
  mutation deleteSize($id: String!) {
    deleteSize(id: $id) {
      message
    }
  }
`;
