import { gql, DocumentNode } from "@apollo/client";

export const GET_SHIPPING_ZONES: DocumentNode = gql`
  query {
    getShippingZones {
      id
      governorate
      price
    }
  }
`;
