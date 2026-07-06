import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "sales";
  const period = searchParams.get("period") || "monthly";
  const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));

  if (type === "supplier") {
    const suppliers = await prisma.supplier.findMany();

    const active = suppliers.filter((s) => s.status === "active").length;
    const avgScore = suppliers.length > 0
      ? Math.round(suppliers.reduce((s, su) => s + su.evaluationScore, 0) / suppliers.length)
      : 0;
    const aGrade = suppliers.filter((s) => s.evaluationGrade === "A").length;

    const ranking = suppliers
      .sort((a, b) => b.evaluationScore - a.evaluationScore)
      .map((s) => ({
        id: s.id,
        name: s.name,
        status: s.status,
        totalOrders: s.totalOrders,
        evaluationScore: s.evaluationScore,
        evaluationGrade: s.evaluationGrade,
        onTimeDelivery: s.onTimeDelivery,
        qualityRating: s.qualityRating,
      }));

    return NextResponse.json({
      type: "supplier",
      generatedAt: new Date().toISOString(),
      period: `${year}`,
      summary: { total: suppliers.length, active, avgScore, aGrade },
      ranking,
    });
  }

  if (type === "inventory") {
    const products = await prisma.product.findMany();

    const inStock = products.filter((p) => p.inStock).length;
    const outOfStock = products.filter((p) => !p.inStock).length;
    const lowStock = products.filter((p) => p.inStock && p.stock < 20).length;
    const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
    const totalCost = products.reduce((s, p) => s + p.cost * p.stock, 0);

    return NextResponse.json({
      type: "inventory",
      generatedAt: new Date().toISOString(),
      summary: { total: products.length, inStock, outOfStock, lowStock, totalValue, totalCost },
    });
  }

  const sales = await prisma.salesRecord.findMany({
    where: { year },
    orderBy: [{ year: "asc" }, { month: "asc" }],
  });

  const orders = await prisma.order.findMany();

  const totalRevenue = sales.reduce((s, r) => s + r.revenue, 0);
  const totalCost = sales.reduce((s, r) => s + r.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const margin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : "0";
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  let grouped;
  if (period === "daily") {
    grouped = orders.reduce<Record<string, { orders: number; revenue: number }>>((acc, o) => {
      const day = o.createdAt.split("T")[0] || o.createdAt.slice(0, 10);
      if (!acc[day]) acc[day] = { orders: 0, revenue: 0 };
      acc[day].orders += 1;
      acc[day].revenue += o.total;
      return acc;
    }, {});
  } else {
    grouped = sales.reduce<Record<string, { revenue: number; cost: number; profit: number; orders: number; margin: string }>>((acc, r) => {
      const key = `${r.month} ${r.year}`;
      acc[key] = {
        revenue: r.revenue,
        cost: r.cost,
        profit: r.revenue - r.cost,
        orders: r.orders,
        margin: r.revenue > 0 ? ((r.revenue - r.cost) / r.revenue * 100).toFixed(1) : "0",
      };
      return acc;
    }, {});
  }

  return NextResponse.json({
    type: "sales",
    period,
    generatedAt: new Date().toISOString(),
    year,
    summary: {
      totalRevenue,
      totalCost,
      totalProfit,
      margin: `${margin}%`,
      totalOrders,
      deliveredOrders,
      pendingOrders: orders.filter((o) => o.status === "pending" || o.status === "processing").length,
      avgOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0",
    },
    data: grouped,
    monthlyBreakdown: period !== "daily"
      ? sales.map((r) => ({
          month: r.month,
          year: r.year,
          revenue: r.revenue,
          cost: r.cost,
          profit: r.revenue - r.cost,
          orders: r.orders,
          margin: r.revenue > 0 ? ((r.revenue - r.cost) / r.revenue * 100).toFixed(1) : "0",
        }))
      : undefined,
  });
}
