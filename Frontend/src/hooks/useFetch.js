import { useState, useEffect, useCallback } from "react";

// ── useFetch ──────────────────────────────────────────────────────────
// @param {Function} apiFn  - async function that returns data (e.g. () => api.getProjects())
// @param {Array}    deps   - dependency array that triggers a re-fetch when changed
//
// @returns {{ data, loading, error, refetch }}
const useFetch = (apiFn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (signal) => {
    if (!apiFn) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiFn();

      // Ignore stale responses if the effect already cleaned up
      if (signal?.aborted) return;

      setData(result);
    } catch (err) {
      if (signal?.aborted) return;

      setError(
        err?.response?.data?.message ?? err?.message ?? "Something went wrong.",
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // Auto-fetch on mount and whenever deps change
  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort(); // cleanup — prevents memory leaks
  }, [fetchData]);

  // Manual refetch exposed to consumers
  const refetch = useCallback(() => fetchData(), [fetchData]);

  return { data, loading, error, refetch };
};

export default useFetch;
