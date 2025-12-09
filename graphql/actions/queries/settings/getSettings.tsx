import { gql, DocumentNode } from "@apollo/client";

export const GET_SETTINGS: DocumentNode = gql`
  query {
    getSettings {
      id
      shippingPrice
      freeShippingPrice
      freeShipDescEn
      freeShipDescAr
      address
      airPlaneMode
    }
  }
`;
