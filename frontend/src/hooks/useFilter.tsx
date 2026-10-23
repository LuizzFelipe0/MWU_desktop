import { useMemo } from 'react';

interface FilterOptions<T> {
  date?: {
    year?: string;
    month?: string;
    key: keyof T;
  };
  item?: Partial<Record<keyof T, any>>;
}

export function useFilter<T>(
  data: T[],
  searchTerm: string,
  searchKey: keyof T | ((item: T) => unknown),
  options?: FilterOptions<T>,
) {
  return useMemo(() => {
    if (!data) return [];

    return data.filter((item: any) => {
      const searchValue =
        typeof searchKey === 'function' ? searchKey(item) : item[searchKey];
      const matchesSearch = String(searchValue || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      let matchesDate = true;

      if (options?.date && item[options.date.key]) {

        const d = new Date(item[options.date.key]);
        const y = d.getFullYear().toString();
        const m = (d.getMonth() + 1).toString().padStart(2, '0');

        if (options.date.year && y !== options.date.year) matchesDate = false;
        if (options.date.month && m !== options.date.month) matchesDate = false;
      }

      let matchesExact = true;
      if (options?.item) {

        Object.entries(options.item).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (item[key] !== value) matchesExact = false;
          }
        });
      }

      return matchesSearch && matchesDate && matchesExact;
    });
  }, [data, searchTerm, searchKey, options]);
}
