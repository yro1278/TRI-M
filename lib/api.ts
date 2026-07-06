const BASE = "/api";

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  products: {
    list: () => fetchJSON<Product[]>(`/products`),
    get: (id: number) => fetchJSON<Product>(`/products/${id}`),
    create: (data: Omit<Product, "id" | "createdAt">) =>
      fetchJSON<Product>(`/products`, { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Product>) =>
      fetchJSON<Product>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) => fetchJSON<{ success: boolean }>(`/products/${id}`, { method: "DELETE" }),
  },
  orders: {
    list: () => fetchJSON<Order[]>(`/orders`),
    update: (id: number, data: { status: string }) =>
      fetchJSON<Order>(`/orders/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    create: (data: { items: { productId: number; name: string; price: number; quantity: number }[]; customer?: string; email?: string; paymentMethod?: string }) =>
      fetchJSON<Order>(`/orders`, { method: "POST", body: JSON.stringify(data) }),
  },
  suppliers: {
    list: () => fetchJSON<Supplier[]>(`/suppliers`),
    get: (id: number) => fetchJSON<Supplier>(`/suppliers/${id}`),
    create: (data: Omit<Supplier, "id">) =>
      fetchJSON<Supplier>(`/suppliers`, { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Supplier>) =>
      fetchJSON<Supplier>(`/suppliers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  },
  sales: {
    list: () => fetchJSON<SalesRecord[]>(`/sales`),
    create: (data: Omit<SalesRecord, "id">) =>
      fetchJSON<SalesRecord>(`/sales`, { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<SalesRecord>) =>
      fetchJSON<SalesRecord>(`/sales/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) => fetchJSON<{ success: boolean }>(`/sales/${id}`, { method: "DELETE" }),
  },
  kpi: {
    get: () => fetchJSON<KPIResponse>(`/kpi`),
  },
  reports: {
    get: (params?: { type?: string; period?: string; year?: number }) => {
      const q = new URLSearchParams();
      if (params?.type) q.set("type", params.type);
      if (params?.period) q.set("period", params.period);
      if (params?.year) q.set("year", String(params.year));
      const qs = q.toString();
      return fetchJSON<ReportResponse>(`/reports${qs ? `?${qs}` : ""}`);
    },
  },
  activities: {
    list: () => fetchJSON<Activity[]>(`/activities`),
    create: (data: { type: string; text: string; time?: string; amount?: string }) =>
      fetchJSON<Activity>(`/activities`, { method: "POST", body: JSON.stringify(data) }),
  },
  seed: () => fetchJSON<{ success: boolean }>(`/seed`, { method: "POST" }),
};

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  cost: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  image: string;
  category: string;
  inStock: boolean;
  stock: number;
  sku: string;
  createdAt: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];
  rating: number;
  status: "active" | "inactive" | "suspended";
  totalOrders: number;
  onTimeDelivery: number;
  qualityRating: number;
  pricingCompetitiveness: number;
  responseTime: number;
  orderAccuracy: number;
  evaluationScore: number;
  evaluationGrade: "A" | "B" | "C" | "D";
  logo: string;
  since: string;
}

export interface Order {
  id: number;
  orderNo: string;
  customer: string;
  email: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  deliveredAt?: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface SalesRecord {
  id?: number;
  month: string;
  year: number;
  revenue: number;
  orders: number;
  cost: number;
}

export interface Activity {
  id: number;
  type: string;
  text: string;
  time: string;
  amount?: string;
}

export interface KPIResponse {
  summary: {
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    profitMargin: number;
    totalOrders: number;
    deliveredOrders: number;
    pendingOrders: number;
    pendingPercentage: number;
    activeProducts: number;
    lowStockItems: number;
    avgOrderValue: number;
  };
  monthlyTrends: { month: string; year: number; revenue: number; cost: number; profit: number; orders: number; margin: string }[];
  topProducts: { name: string; unitsSold: number }[];
  supplierRanking: { id: number; name: string; score: number; grade: string; onTimeDelivery: number; qualityRating: number }[];
  supplierSummary: { total: number; active: number; avgScore: number; aGrade: number };
  categoryBreakdown: { name: string; count: number }[];
  timestamp: string;
}

export interface ReportResponse {
  type: string;
  period?: string;
  generatedAt: string;
  year?: number;
  summary: Record<string, unknown>;
  data?: Record<string, unknown>;
  monthlyBreakdown?: unknown[];
  ranking?: unknown[];
}
