import { gql, DocumentNode } from "@apollo/client";

export const CREATE_CATEGORY: DocumentNode = gql`
  mutation CreateCategory($nameEn: String!, $nameAr: String!, $image: Upload!) {
    createCategory(
      categoryDto: { nameEn: $nameEn, nameAr: $nameAr, image: $image }
    ) {
      category {
        id
        imageUrl
        nameEn
        nameAr
      }
    }
  }
`;
