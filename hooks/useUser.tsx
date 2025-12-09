"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../graphql/actions/queries/users/getUser";
import { refreshToken } from "../graphql/gql.setup";

const useUser = () => {
  const { loading, data, error, refetch } = useQuery(GET_USER, {
    fetchPolicy: "network-only",
  });

  const [isRetrying, setIsRetrying] = useState(false);
  const [checked, setChecked] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (error && !isRetrying && !failed) {
      const isUnauthenticated = error.graphQLErrors?.some(
        (err: any) =>
          err.extensions?.cause?.code === "UNAUTHENTICATED" ||
          err.extensions?.description === "UNAUTHENTICATED" ||
          err.message?.includes("Please login")
      );

      if (isUnauthenticated) {
        setIsRetrying(true);
        refreshToken()
          .then(() => refetch())
          .catch(() => setFailed(true))
          .finally(() => {
            setIsRetrying(false);
            setChecked(true);
          });
        return;
      }
    }

    if (!loading && !isRetrying) {
      setChecked(true);
    }
  }, [error, loading, refetch, isRetrying, failed]);

  return {
    loading: loading || isRetrying,
    user: data?.getLoggedInUser?.user,
    checked,
    error,
  };
};

export default useUser;
