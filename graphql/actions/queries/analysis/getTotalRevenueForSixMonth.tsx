import { gql, DocumentNode } from "@apollo/client";

export const GET_TOTAL_REVENUE_FOR_SIX_MONTH: DocumentNode = gql`
  query {
    getTotalRevenueForLastSixMonthsAnalytics {
      chartData {
        month
        total
      }
    }
  }
`;
