import { useState, useEffect, useCallback } from "react";
import { api, type Product, type Supplier, type Order, type SalesRecord, type Activity } from "@/lib/api";

function useFetch<T>(fetcher: () => Promise<T>): T {
  const [data, setData] = useState<T>([] as unknown as T);
  const fetchData = useCallback(fetcher, []);

  useEffect(() => {
    fetchData().then(setData);
  }, [fetchData]);

  return data;
}

export function useProducts() {
  return useFetch(api.products.list);
}

export function useSuppliers() {
  return useFetch(api.suppliers.list);
}

export function useOrders() {
  return useFetch(api.orders.list);
}

export function useSales() {
  return useFetch(api.sales.list);
}

export function useActivities() {
  return useFetch(api.activities.list);
}
