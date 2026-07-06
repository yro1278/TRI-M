import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const record = await prisma.salesRecord.update({
    where: { id: Number(id) },
    data: {
      month: body.month,
      year: body.year,
      revenue: body.revenue,
      cost: body.cost,
      orders: body.orders,
    },
  });
  return NextResponse.json(record);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.salesRecord.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
