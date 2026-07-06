import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const product = await prisma.product.create({
    data: {
      name: body.name,
      brand: body.brand,
      price: body.price,
      cost: body.cost,
      originalPrice: body.originalPrice,
      rating: body.rating ?? 0,
      reviews: body.reviews ?? 0,
      badge: body.badge,
      image: body.image ?? "📦",
      category: body.category,
      inStock: body.inStock ?? true,
      stock: body.stock ?? 0,
      sku: body.sku,
      createdAt: new Date().toISOString().slice(0, 10),
    },
  });
  return NextResponse.json(product, { status: 201 });
}
