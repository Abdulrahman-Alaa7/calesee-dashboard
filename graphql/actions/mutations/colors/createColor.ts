import { gql, DocumentNode } from "@apollo/client";

export const CREATE_COLOR: DocumentNode = gql`
  mutation CreateColor($hex: String!, $nameAr: String, $nameEn: String) {
    createColor(colorDto: { hex: $hex, nameEn: $nameEn, nameAr: $nameAr }) {
      color {
        id
        hex
        nameEn
        nameAr
      }
    }
  }
`;
