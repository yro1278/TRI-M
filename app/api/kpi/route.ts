import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [sales, orders, products, suppliers] = await Promise.all([
    prisma.salesRecord.findMany(),
    prisma.order.findMany(),
    prisma.product.findMany(),
    prisma.supplier.findMany(),
  ]);

  const totalRevenue = sales.reduce((s, r) => s + r.revenue, 0);
  const totalCost = sales.reduce((s, r) => s + r.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing").length;
  const activeProducts = products.filter((p) => p.inStock).length;
  const lowStockItems = products.filter((p) => p.inStock && p.stock < 20).length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const activeSuppliers = suppliers.filter((s) => s.status === "active").length;
  const avgSupplierScore = suppliers.length > 0
    ? Math.round(suppliers.reduce((s, su) => s + su.evaluationScore, 0) / suppliers.length)
    : 0;
  const aGradeSuppliers = suppliers.filter((s) => s.evaluationGrade === "A").length;

  const monthlyTrends = sales.map((r) => ({
    month: r.month,
    year: r.year,
    revenue: r.revenue,
    cost: r.cost,
    profit: r.revenue - r.cost,
    orders: r.orders,
    margin: r.revenue > 0 ? ((r.revenue - r.cost) / r.revenue * 100).toFixed(1) : "0",
  }));

  const topProducts = await prisma.orderItem.groupBy({
    by: ["name"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  const supplierRanking = suppliers
    .filter((s) => s.status === "active")
    .sort((a, b) => b.evaluationScore - a.evaluationScore)
    .slice(0, 10)
    .map((s) => ({
      id: s.id,
      name: s.name,
      score: s.evaluationScore,
      grade: s.evaluationGrade,
      onTimeDelivery: s.onTimeDelivery,
      qualityRating: s.qualityRating,
    }));

  const categoryBreakdown = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    summary: {
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin: Number(profitMargin.toFixed(1)),
      totalOrders,
      deliveredOrders,
      pendingOrders,
      pendingPercentage: totalOrders > 0 ? Number(((pendingOrders / totalOrders) * 100).toFixed(1)) : 0,
      activeProducts,
      lowStockItems,
      avgOrderValue: Number(avgOrderValue.toFixed(2)),
    },
    monthlyTrends,
    topProducts: topProducts.map((p) => ({
      name: p.name,
      unitsSold: p._sum.quantity || 0,
    })),
    supplierRanking,
    supplierSummary: {
      total: suppliers.length,
      active: activeSuppliers,
      avgScore: avgSupplierScore,
      aGrade: aGradeSuppliers,
    },
    categoryBreakdown: Object.entries(categoryBreakdown).map(([name, count]) => ({ name, count })),
    timestamp: new Date().toISOString(),
  });
}
