import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const data: Record<string, unknown> = { status: body.status };
  if (body.status === "delivered") data.deliveredAt = new Date().toISOString();
  const order = await prisma.order.update({
    where: { id: Number(id) },
    data,
    include: { items: true },
  });
  return NextResponse.json(order);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.order.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
