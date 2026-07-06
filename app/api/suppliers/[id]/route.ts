import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supplier = await prisma.supplier.findUnique({ where: { id: Number(id) } });
  if (!supplier) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...supplier, categories: JSON.parse(supplier.categories) });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const data: Record<string, unknown> = { ...body };
  if (body.categories) data.categories = JSON.stringify(body.categories);
  if (body.onTimeDelivery || body.qualityRating || body.pricingCompetitiveness || body.responseTime || body.orderAccuracy) {
    const ot = body.onTimeDelivery ?? 0;
    const qr = body.qualityRating ?? 0;
    const pc = body.pricingCompetitiveness ?? 0;
    const rt = body.responseTime ?? 0;
    const oa = body.orderAccuracy ?? 0;
    data.evaluationScore = Math.round(ot * 0.30 + qr * 0.25 + pc * 0.20 + rt * 0.15 + oa * 0.10);
    data.evaluationGrade = (data.evaluationScore as number) >= 90 ? "A" : (data.evaluationScore as number) >= 80 ? "B" : (data.evaluationScore as number) >= 70 ? "C" : "D";
  }
  const supplier = await prisma.supplier.update({ where: { id: Number(id) }, data });
  return NextResponse.json({ ...supplier, categories: JSON.parse(supplier.categories) });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.supplier.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
