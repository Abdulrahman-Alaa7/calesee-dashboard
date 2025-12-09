import { gql, DocumentNode } from "@apollo/client";

export const DELETE_CATEGORY: DocumentNode = gql`
  mutation deleteCategory($id: String!) {
    deleteCategory(id: $id) {
      message
    }
  }
`;
