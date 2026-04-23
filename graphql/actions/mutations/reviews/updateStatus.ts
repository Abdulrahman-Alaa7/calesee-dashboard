import { gql } from "@apollo/client";

export const UPDATE_REVIEW_STATUS = gql`
  mutation UpdateReviewStatus($input: UpdateReviewStatusDto!) {
    updateReviewStatus(input: $input) {
      id
      status
    }
  }
`;
