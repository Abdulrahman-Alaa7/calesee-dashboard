import { gql, DocumentNode } from "@apollo/client";

export const UPDATE_SIZE: DocumentNode = gql`
  mutation UpdateSize(
    $id: String!
    $valueSize: String
    $labelEn: String
    $labelAr: String
  ) {
    updateSize(
      updateSizeDto: {
        id: $id
        valueSize: $valueSize
        labelEn: $labelEn
        labelAr: $labelAr
      }
    ) {
      size {
        id
        valueSize
        labelEn
        labelAr
      }
    }
  }
`;
