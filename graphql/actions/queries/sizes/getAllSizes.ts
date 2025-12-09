import { gql, DocumentNode } from "@apollo/client";

export const GET_ALL_SIZES: DocumentNode = gql`
  query {
    getSizes {
      id
      labelEn
      labelAr
      valueSize
      createdAt
      updatedAt
    }
  }
`;
