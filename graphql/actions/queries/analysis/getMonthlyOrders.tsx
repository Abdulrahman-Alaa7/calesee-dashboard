import { gql, DocumentNode } from "@apollo/client";

export const GET_MONTHLY_ORDERS: DocumentNode = gql`
  query {
    getMonthlyOrdersCountAnalytics {
      currentMonthOrdersCount
      lastMonthOrdersCount
    }
  }
`;
