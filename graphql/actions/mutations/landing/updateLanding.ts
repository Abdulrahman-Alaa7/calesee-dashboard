import { gql, DocumentNode } from "@apollo/client";

export const UPDATE_LANDING: DocumentNode = gql`
  mutation UpdateLanding(
    $id: String!
    $titleEn: String!
    $titleAr: String
    $descEn: String
    $descAr: String
    $link: String
    $linkTitleEn: String
    $linkTitleAr: String
    $image: Upload
  ) {
    updateLanding(
      updateLandingDto: {
        id: $id
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
