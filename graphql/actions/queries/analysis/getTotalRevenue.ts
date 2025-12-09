import { gql } from "@apollo/client";

export const GET_TOTAL_REVENUE = gql`
  query GetTotalRevenue {
    getTotalRevenueAnalytics {
      currentMonthRevenue
      lastMonthRevenue
    }
  }
`;
