import { gql, DocumentNode } from "@apollo/client";

export const DELETE_SHIPPING_ZONE: DocumentNode = gql`
  mutation DeleteShippingZone($governorate: String!) {
    deleteShippingZone(governorate: $governorate) {
      message
    }
  }
`;
