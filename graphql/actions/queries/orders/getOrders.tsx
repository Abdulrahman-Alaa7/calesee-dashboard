import { gql, DocumentNode } from "@apollo/client";

export const GET_ORDERS: DocumentNode = gql`
  query {
    getOrders {
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
