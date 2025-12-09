import { gql, DocumentNode } from "@apollo/client";

export const GET_PRODUCTS: DocumentNode = gql`
  query {
    getProducts {
      id
      name
      mainImage
      images
      price
      estimatedPrice
      categoryId
      category {
        id
        name
      }
      sku
      publicPro
      purchased
      createdAt
      updatedAt
    }
  }
`;
