import { api, type Product, type Supplier, type Order, type SalesRecord, type Activity } from "@/lib/api";

export async function getProducts(): Promise<Product[]> {
  return api.products.list();
}

export async function getProduct(id: number): Promise<Product | undefined> {
  try { return await api.products.get(id); } catch { return undefined; }
}

export async function addProduct(p: Omit<Product, "id" | "createdAt">): Promise<Product> {
  const product = await api.products.create(p);
  try {
    await api.activities.create({ type: "product", text: `New product added: ${p.name}`, time: "Just now" });
  } catch {}
  return product;
}

export async function updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
  try { return await api.products.update(id, updates); } catch { return undefined; }
}

export async function deleteProduct(id: number): Promise<boolean> {
  try { await api.products.delete(id); return true; } catch { return false; }
}

export async function getSuppliers(): Promise<Supplier[]> {
  return api.suppliers.list();
}

export async function getSupplier(id: number): Promise<Supplier | undefined> {
  try { return await api.suppliers.get(id); } catch { return undefined; }
}

export async function getOrders(): Promise<Order[]> {
  return api.orders.list();
}

export async function getSales(): Promise<SalesRecord[]> {
  return api.sales.list();
}

export async function getActivities(): Promise<Activity[]> {
  return api.activities.list();
}

export async function placeOrder(
  items: { productId: number; name: string; price: number; quantity: number }[],
  customer: string, email: string, paymentMethod: string
): Promise<Order> {
  const order = await api.orders.create({ items, customer, email, paymentMethod });
  try {
    await api.activities.create({
      type: "order", text: `New order ${order.orderNo} from ${customer}`, time: "Just now", amount: `$${order.total.toFixed(2)}`,
    });
  } catch {}
  return order;
}

export async function updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
  try { return await api.orders.update(id, { status }); } catch { return undefined; }
}

export async function seedDatabase(): Promise<boolean> {
  try { await api.seed(); return true; } catch { return false; }
}
