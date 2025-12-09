import { gql, DocumentNode } from "@apollo/client";

export const DELETE_LANDING: DocumentNode = gql`
  mutation deleteLanding($id: String!) {
    deleteLanding(id: $id) {
      message
    }
  }
`;
