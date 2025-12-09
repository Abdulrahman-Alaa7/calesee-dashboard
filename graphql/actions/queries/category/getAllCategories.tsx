import { gql, DocumentNode } from "@apollo/client";

export const GET_ALL_CATEGORIES: DocumentNode = gql`
  query {
    getCategories {
      id
      nameEn
      nameAr
      imageUrl
      createdAt
      updatedAt
    }
  }
`;
