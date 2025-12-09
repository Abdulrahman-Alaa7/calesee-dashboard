import { gql, DocumentNode } from "@apollo/client";

export const CREATE_LANDING: DocumentNode = gql`
  mutation CreateLanding(
    $titleEn: String!
    $titleAr: String!
    $descEn: String!
    $descAr: String!
    $link: String!
    $linkTitleEn: String!
    $linkTitleAr: String!
    $image: Upload!
  ) {
    createLanding(
      landingDto: {
        titleEn: $titleEn
        titleAr: $titleAr
        descEn: $descEn
        descAr: $descAr
        link: $link
        linkTitleEn: $linkTitleEn
        linkTitleAr: $linkTitleAr
        image: $image
      }
    ) {
      landing {
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
  }
`;
