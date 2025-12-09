import { gql, DocumentNode } from "@apollo/client";

export const UPDATE_CATEGORY: DocumentNode = gql`
  mutation UpdateCategory(
    $id: String!
    $nameEn: String
    $nameAr: String
    $image: Upload
  ) {
    updateCategory(
      updateCategoryDto: {
        id: $id
        nameEn: $nameEn
        nameAr: $nameAr
        image: $image
      }
    ) {
      category {
        id
        nameEn
        nameAr
        imageUrl
      }
    }
  }
`;
