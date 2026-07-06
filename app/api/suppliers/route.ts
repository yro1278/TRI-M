import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const suppliers = await prisma.supplier.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(suppliers.map((s) => ({ ...s, categories: JSON.parse(s.categories) })));
}

export async function POST(request: Request) {
  const body = await request.json();
  const evalScore = Math.round(
    (body.onTimeDelivery ?? 0) * 0.30 +
    (body.qualityRating ?? 0) * 0.25 +
    (body.pricingCompetitiveness ?? 0) * 0.20 +
    (body.responseTime ?? 0) * 0.15 +
    (body.orderAccuracy ?? 0) * 0.10
  );
  const evalGrade = evalScore >= 90 ? "A" : evalScore >= 80 ? "B" : evalScore >= 70 ? "C" : "D";

  const supplier = await prisma.supplier.create({
    data: {
      name: body.name,
      contact: body.contact,
      email: body.email,
      phone: body.phone,
      address: body.address,
      categories: JSON.stringify(body.categories ?? []),
      rating: body.rating ?? 0,
      status: body.status ?? "active",
      totalOrders: body.totalOrders ?? 0,
      onTimeDelivery: body.onTimeDelivery ?? 0,
      qualityRating: body.qualityRating ?? 0,
      pricingCompetitiveness: body.pricingCompetitiveness ?? 0,
      responseTime: body.responseTime ?? 0,
      orderAccuracy: body.orderAccuracy ?? 0,
      evaluationScore: evalScore,
      evaluationGrade: evalGrade,
      logo: body.logo ?? "🏢",
      since: body.since ?? new Date().toISOString().slice(0, 10),
    },
  });
  return NextResponse.json({ ...supplier, categories: JSON.parse(supplier.categories) }, { status: 201 });
}
