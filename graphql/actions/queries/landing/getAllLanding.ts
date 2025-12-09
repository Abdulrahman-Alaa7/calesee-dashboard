import { gql, DocumentNode } from "@apollo/client";

export const GET_ALL_LANDINGS: DocumentNode = gql`
  query {
    getLandings {
      id
      titleEn
      titleAr
      descEn
      descAr
      link
      linkTitleEn
      linkTitleAr
      image
    }
  }
`;
