import { gql, DocumentNode } from "@apollo/client";

export const UPDATE_USER_REC: DocumentNode = gql`
  mutation updateUserRec($id: String!, $notReceive: Boolean!) {
    updateUserRec(updateReceive: { id: $id, notReceive: $notReceive }) {
      id
      name
      email
    }
  }
`;
