import { gql, DocumentNode } from "@apollo/client";

export const UPDATE_SETTINGS: DocumentNode = gql`
  mutation updateSettings(
    $id: String!
    $defaultShippingPrice: Int!
    $freeShippingPrice: Int!
    $freeShipDescEn: String!
    $freeShipDescAr: String!
    $address: String
    $airPlaneMode: Boolean!
  ) {
    updateSettings(
      settingsUpdateDto: {
        id: $id
        defaultShippingPrice: $defaultShippingPrice
        freeShippingPrice: $freeShippingPrice
        freeShipDescEn: $freeShipDescEn
        freeShipDescAr: $freeShipDescAr
        address: $address
        airPlaneMode: $airPlaneMode
      }
    ) {
      settings {
        id
        defaultShippingPrice
      }
    }
  }
`;
