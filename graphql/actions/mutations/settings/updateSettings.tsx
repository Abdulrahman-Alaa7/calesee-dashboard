import { gql, DocumentNode } from "@apollo/client";

export const UPDATE_SETTINGS: DocumentNode = gql`
  mutation updateSettings(
    $id: String!
    $shippingPrice: Float!
    $freeShippingPrice: Float!
    $freeShipDescEn: String!
    $freeShipDescAr: String!
    $address: String
    $airPlaneMode: Boolean!
  ) {
    updateSettings(
      settingsUpdateDto: {
        id: $id
        shippingPrice: $shippingPrice
        freeShippingPrice: $freeShippingPrice
        freeShipDescEn: $freeShipDescEn
        freeShipDescAr: $freeShipDescAr
        address: $address
        airPlaneMode: $airPlaneMode
      }
    ) {
      settings {
        id
        shippingPrice
      }
    }
  }
`;
