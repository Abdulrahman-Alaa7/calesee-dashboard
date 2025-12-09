import { gql, DocumentNode } from "@apollo/client";

export const CREATE_SIZE: DocumentNode = gql`
  mutation CreateSize($valueSize: String!, $labelEn: String, $labelAr: String) {
    createSize(
      sizeDto: { valueSize: $valueSize, labelEn: $labelEn, labelAr: $labelAr }
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
