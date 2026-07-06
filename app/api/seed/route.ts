import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { seedProducts, seedSuppliers, seedOrders, seedSales, seedActivities } from "@/app/data/seed";

export async function POST() {
  const existing = await prisma.user.findFirst();
  if (existing) {
    return NextResponse.json({ error: "Already seeded" }, { status: 400 });
  }

  const password = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      name: "Jane Cooper",
      email: "admin@merchflow.com",
      password,
      role: "admin",
    },
  });

  for (const p of seedProducts) {
    await prisma.product.create({ data: p });
  }

  for (const s of seedSuppliers) {
    await prisma.supplier.create({
      data: { ...s, categories: JSON.stringify(s.categories) },
    });
  }

  for (const o of seedOrders) {
    await prisma.order.create({
      data: {
        orderNo: o.orderNo,
        customer: o.customer,
        email: o.email,
        subtotal: o.subtotal,
        shipping: o.shipping,
        tax: o.tax,
        total: o.total,
        status: o.status,
        paymentMethod: o.paymentMethod,
        createdAt: o.createdAt,
        deliveredAt: o.deliveredAt ?? null,
        items: {
          create: o.items.map((i: { productId: number; name: string; price: number; quantity: number }) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        },
      },
    });
  }

  for (const s of seedSales) {
    await prisma.salesRecord.create({ data: s });
  }

  for (const a of seedActivities) {
    await prisma.activity.create({ data: a });
  }

  return NextResponse.json({ success: true });
}
