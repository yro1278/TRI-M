import { api, type Product, type Supplier, type Order, type SalesRecord, type Activity, type KPIResponse } from "@/lib/api";
import { useFetch } from "./use-fetch";

export function useProducts() {
  return useFetch(api.products.list, [] as Product[]);
}

export function useSuppliers() {
  return useFetch(api.suppliers.list, [] as Supplier[]);
}

export function useOrders() {
  return useFetch(api.orders.list, [] as Order[]);
}

export function useSales() {
  return useFetch(api.sales.list, [] as SalesRecord[]);
}

export function useActivities() {
  return useFetch(api.activities.list, [] as Activity[]);
}

export function useDashboardKPI() {
  return useFetch(api.kpi.get, {
    summary: {
      totalRevenue: 0, totalCost: 0, totalProfit: 0, profitMargin: 0,
      totalOrders: 0, deliveredOrders: 0, pendingOrders: 0, pendingPercentage: 0,
      activeProducts: 0, lowStockItems: 0, avgOrderValue: 0,
    },
    monthlyTrends: [],
    topProducts: [],
    supplierRanking: [],
    supplierSummary: { total: 0, active: 0, avgScore: 0, aGrade: 0 },
    categoryBreakdown: [],
    timestamp: "",
  } as KPIResponse);
}
