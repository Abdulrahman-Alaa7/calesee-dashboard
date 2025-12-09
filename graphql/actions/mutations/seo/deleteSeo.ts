import { gql, DocumentNode } from "@apollo/client";

export const DELETE_SEO: DocumentNode = gql`
  mutation deleteSeo($id: String!) {
    deleteSeo(id: $id) {
      message
    }
  }
`;
