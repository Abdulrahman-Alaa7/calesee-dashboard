import { gql, DocumentNode } from "@apollo/client";

export const GET_REVIEWS_BY_ID: DocumentNode = gql`
  query getReviewsAdmin($productId: String!) {
    getReviewsAdmin(productId: $productId) {
      id
      name
      comment
      rating
      status
      imageUrl
    }
  }
`;
