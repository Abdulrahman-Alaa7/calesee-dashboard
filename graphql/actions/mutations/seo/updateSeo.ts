import { gql, DocumentNode } from "@apollo/client";

export const UPDATE_SEO: DocumentNode = gql`
  mutation UpdateSeo(
    $id: String!
    $page: String
    $titleEn: String
    $titleAr: String
    $descEn: String
    $descAr: String
    $keywordsEn: [String!]
    $keywordsAr: [String!]
  ) {
    updateSeo(
      updateSeoDto: {
        id: $id
        page: $page
        titleEn: $titleEn
        titleAr: $titleAr
        descEn: $descEn
        descAr: $descAr
        keywordsEn: $keywordsEn
        keywordsAr: $keywordsAr
      }
    ) {
      seo {
        id
        page
        titleEn
        titleAr
        descEn
        descAr
        keywordsEn
        keywordsAr
      }
    }
  }
`;
