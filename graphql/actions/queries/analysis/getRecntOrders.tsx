import { gql, DocumentNode } from "@apollo/client";

export const GET_RECENT_ORDERS: DocumentNode = gql`
  query {
    getRecentOrders {
      recentOrders {
        id
        fullName
        email
        totalPrice
        shippingPrice
        items {
          quantity
          price
        }
      }
      ordersThisMonthCount
    }
  }
`;
