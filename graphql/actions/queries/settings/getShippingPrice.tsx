import { gql, DocumentNode } from "@apollo/client";

export const GET_SHIPPING_PRICE: DocumentNode = gql`
  query GetShippingPrice($governorate: String!) {
    getShippingPrice(governorate: $governorate) {
      price
      isDefault
    }
  }
`;
