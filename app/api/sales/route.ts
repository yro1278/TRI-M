import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sales = await prisma.salesRecord.findMany({ orderBy: [{ year: "asc" }, { month: "asc" }] });
  return NextResponse.json(sales);
}

export async function POST(req: Request) {
  const body = await req.json();
  const record = await prisma.salesRecord.create({
    data: {
      month: body.month,
      year: body.year,
      revenue: body.revenue,
      cost: body.cost,
      orders: body.orders,
    },
  });
  return NextResponse.json(record, { status: 201 });
}
