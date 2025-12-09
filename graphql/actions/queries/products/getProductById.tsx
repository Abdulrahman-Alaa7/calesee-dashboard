import { gql, DocumentNode } from "@apollo/client";

export const GET_PRODUCT_BY_ID: DocumentNode = gql`
  query getProductById($id: String!) {
    getProductById(id: $id) {
      id
      name
      mainImage
      images
      price
      estimatedPrice
      descriptionEn
      descriptionAr
      categoryId
      category {
        id
        name
      }
      sku
      keywordsEn
      keywordsAr
      sizes {
        value
        soldout
      }
      colors {
        value
        soldout
      }
      soldOut
      publicPro
      purchased
      createdAt
      updatedAt
    }
  }
`;
