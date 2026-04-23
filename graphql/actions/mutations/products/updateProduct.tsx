import { gql, DocumentNode } from "@apollo/client";

export const UPDATE_PRODUCT: DocumentNode = gql`
  mutation updateProduct($input: UpdateProductInput!) {
    updateProduct(updateProductDto: $input) {
      product {
        id
        name
      }
    }
  }
`;
