import { gql, DocumentNode } from "@apollo/client";

export const LOGOUT: DocumentNode = gql`
  mutation logOutUser {
    logOutUser {
      message
    }
  }
`;
