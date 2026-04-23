import { gql, DocumentNode } from "@apollo/client";

export const GET_SETTINGS: DocumentNode = gql`
  query {
    getSettings {
      id
      defaultShippingPrice
      freeShippingPrice
      freeShipDescEn
      freeShipDescAr
      address
      airPlaneMode
    }
  }
`;
