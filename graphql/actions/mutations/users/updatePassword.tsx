import { gql, DocumentNode } from "@apollo/client";

export const UPDATE_PASSWORD: DocumentNode = gql`
  mutation updatePassword($currentPassword: String!, $newPassword: String!) {
    updatePassword(
      updatePasswordDto: {
        currentPassword: $currentPassword
        newPassword: $newPassword
      }
    ) {
      user {
        id
        name
        email
        password
        role
      }
    }
  }
`;
