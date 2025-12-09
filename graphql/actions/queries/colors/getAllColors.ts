import { gql, DocumentNode } from "@apollo/client";

export const GET_ALL_COLORS: DocumentNode = gql`
  query {
    getColors {
      id
      nameEn
      nameAr
      hex
      createdAt
      updatedAt
    }
  }
`;
