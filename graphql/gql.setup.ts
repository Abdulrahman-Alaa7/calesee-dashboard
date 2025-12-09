import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { Observable } from "zen-observable-ts";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

interface GraphQLErrorExtensions {
  code?: string;
  description?: string;
  cause?: {
    code?: string;
  };
}

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
if (!SERVER_URI) {
  throw new Error(
    "NEXT_PUBLIC_SERVER_URI is not defined in environment variables"
  );
}

const uploadLink = createUploadLink({
  uri: SERVER_URI,
  credentials: "include",
  headers: {
    "Apollo-Require-Preflight": "true",
  },
});

const refreshTokenMutation = `
  mutation RefreshToken {
    refreshToken {
      user {
        id
        email
        name
        role
      }
    }
  }
`;

export const refreshToken = async (): Promise<void> => {
  try {
    const response = await fetch(SERVER_URI, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: refreshTokenMutation,
      }),
    });

    const result = await response.json();
    if (result.errors || !result.data?.refreshToken) {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    throw error;
  }
};

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

const resolvePendingRequests = () => {
  pendingRequests.forEach((callback) => callback());
  pendingRequests = [];
};

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      const errorCode =
        (err.extensions as GraphQLErrorExtensions | undefined)?.cause?.code ||
        (err.extensions as GraphQLErrorExtensions | undefined)?.description ||
        err.message.includes("Please login")
          ? "UNAUTHENTICATED"
          : undefined;
      if (errorCode === "UNAUTHENTICATED") {
        if (!isRefreshing) {
          isRefreshing = true;
          return new Observable((observer) => {
            refreshToken()
              .then(() => {
                resolvePendingRequests();
                isRefreshing = false;
                forward(operation).subscribe({
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                });
              })
              .catch((error) => {
                resolvePendingRequests();
                isRefreshing = false;
                if (typeof window !== "undefined") {
                  window.location.href = "/";
                }
                observer.error(error);
              });
          });
        } else {
          return new Observable((observer) => {
            new Promise<void>((resolve) => {
              pendingRequests.push(() => resolve());
            }).then(() => {
              forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              });
            });
          });
        }
      }
    }
  }
  return forward(operation);
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: ApolloLink.from([errorLink, uploadLink]),
  cache: new InMemoryCache(),
});

export default client;
