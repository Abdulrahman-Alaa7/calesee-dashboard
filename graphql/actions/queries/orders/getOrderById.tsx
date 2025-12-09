import { gql, DocumentNode } from "@apollo/client";

export const GET_ORDER_BY_ID: DocumentNode = gql`
  query getOrderById($id: String!) {
    getOrderById(id: $id) {
      id
      fullName
      email
      phone_number
      secPhone_number
      governorate
      secGovernorate
      city
      secCity
      address
      secAddress
      note
      items {
        name
        img
        quantity
        price
        size
        color
      }
      status
      createdAt
      updatedAt
    }
  }
`;
