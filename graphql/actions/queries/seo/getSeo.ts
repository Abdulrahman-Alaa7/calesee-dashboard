import { gql, DocumentNode } from "@apollo/client";

export const GET_SEO: DocumentNode = gql`
  query {
    getSeos {
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
`;
