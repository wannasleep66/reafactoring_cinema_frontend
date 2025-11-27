import { useCallback, useEffect, useState } from "react";

type QueryOptions<TData> = {
  queryFn: () => TData | Promise<TData>;
};

type QueryResponse<TData, TError> = {
  data?: TData;
  error?: TError;
  loading: boolean;
  refetch: () => void;
};

export function useQuery<TData = unknown, TError = unknown>(
  options: QueryOptions<TData>,
): QueryResponse<TData, TError> {
  const [data, setData] = useState<TData | undefined>();
  const [error, setError] = useState<TError | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await options.queryFn();
      setData(result);
    } catch (err: unknown) {
      setError(err as TError);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch();
  }, [fetch]);

  const refetch = () => {
    fetch();
  };

  return { data, error, loading, refetch };
}
