import { gql, DocumentNode } from "@apollo/client";

export const CREATE_PRODUCT: DocumentNode = gql`
  mutation createProduct($input: CreateProductInput!) {
    createProduct(productDto: $input) {
      product {
        id
        name
      }
    }
  }
`;
