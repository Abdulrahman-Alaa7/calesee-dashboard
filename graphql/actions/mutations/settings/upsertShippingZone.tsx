import { gql, DocumentNode } from "@apollo/client";

export const UPSERT_SHIPPING_ZONE: DocumentNode = gql`
  mutation UpsertShippingZone($governorate: String!, $price: Int!) {
    upsertShippingZone(governorate: $governorate, price: $price) {
      id
      governorate
      price
    }
  }
`;
