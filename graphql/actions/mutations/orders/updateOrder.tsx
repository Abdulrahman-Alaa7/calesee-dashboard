import { gql } from "@apollo/client";

export const UPDATE_ORDER = gql`
  mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
    updateOrderStatus(input: $input) {
      id
      status
    }
  }
`;
