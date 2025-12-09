import { gql, DocumentNode } from "@apollo/client";

export const CREATE_SEO: DocumentNode = gql`
  mutation CreateSeo(
    $page: String!
    $titleEn: String!
    $titleAr: String!
    $descEn: String!
    $descAr: String!
    $keywordsEn: [String!]
    $keywordsAr: [String!]
  ) {
    createSeo(
      seoDto: {
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
