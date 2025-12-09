import { gql, DocumentNode } from "@apollo/client";

export const GET_TOTAL_ORDERS_FOR_SIX_MONTH: DocumentNode = gql`
  query {
    getTotalOrdersForLastSixMonthsAnalytics {
      chartData {
        month
        total
      }
    }
  }
`;
