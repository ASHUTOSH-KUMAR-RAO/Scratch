import { PAGINATION } from "@/config/constants";
import { useCallback, useEffect, useState } from "react";

interface UseEntitySearchProps<T extends { search: string; page: number }> {
  params: T;
  setParams: (params: T | ((prev: T) => T)) => void;
  debounceMs?: number;
}

export const useEntitySearch = <T extends { search: string; page: number }>({
  params,
  setParams,
  debounceMs = 500,
}: UseEntitySearchProps<T>) => {
  const [localSearch, setLocalSearch] = useState(params.search);

  // Debounced search effect
  useEffect(() => {
    // Immediate clear when search is emptied
    if (localSearch === "" && params.search !== "") {
      setParams((prev) => ({
        ...prev,
        search: "",
        page: PAGINATION.DEFAULT_PAGE,
      }));
      return;
    }

    // Debounce for other search changes
    const timer = setTimeout(() => {
      if (localSearch !== params.search) {
        setParams((prev) => ({
          ...prev,
          search: localSearch, // ✅ FIX: localSearch instead of ""
          page: PAGINATION.DEFAULT_PAGE,
        }));
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localSearch, debounceMs, params.search, setParams]); // ✅ FIX: Only necessary deps

  // Sync local search with params when params change externally
  useEffect(() => {
    setLocalSearch(params.search);
  }, [params.search]);

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);
  }, []);

  const clearSearch = useCallback(() => {
    setLocalSearch("");
  }, []);

  return {
    search: localSearch, // ✅ Better naming
    handleSearchChange, // ✅ Better naming
    clearSearch,
    isSearching: localSearch !== params.search,
  };
};
