import { gql, DocumentNode } from "@apollo/client";

export const UPDATE_COLOR: DocumentNode = gql`
  mutation UpdateColor(
    $id: String!
    $hex: String
    $nameAr: String
    $nameEn: String
  ) {
    updateColor(
      updateColorDto: { id: $id, hex: $hex, nameEn: $nameEn, nameAr: $nameAr }
    ) {
      color {
        id
        hex
        nameEn
        nameAr
      }
    }
  }
`;
