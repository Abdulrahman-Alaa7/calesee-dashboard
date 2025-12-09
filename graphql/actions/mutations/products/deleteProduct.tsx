import { gql, DocumentNode } from "@apollo/client";

export const DELETE_PRODUCT: DocumentNode = gql`
  mutation deleteProduct($id: String!) {
    deleteProduct(id: $id) {
      message
    }
  }
`;
