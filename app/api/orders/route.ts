import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const body = await request.json();
  const lastOrder = await prisma.order.findFirst({ orderBy: { id: "desc" } });
  const nextNum = (lastOrder?.id ?? 0) + 1;
  const subtotal = body.items.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 250 ? 0 : 15.99;
  const tax = +(subtotal * 0.08).toFixed(2);

  const order = await prisma.order.create({
    data: {
      orderNo: `ORD-${3000 + nextNum}`,
      customer: body.customer || "Guest",
      email: body.email || "guest@example.com",
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
      status: "pending",
      paymentMethod: body.paymentMethod || "Credit Card",
      createdAt: new Date().toISOString(),
      items: {
        create: body.items.map((i: { productId: number; name: string; price: number; quantity: number }) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
      },
    },
    include: { items: true },
  });

  for (const item of body.items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (product) {
      const newStock = Math.max(0, product.stock - item.quantity);
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: newStock, inStock: newStock > 0 },
      });
    }
  }

  return NextResponse.json(order, { status: 201 });
}
