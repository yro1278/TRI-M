import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const activities = await prisma.activity.findMany({ orderBy: { id: "desc" }, take: 50 });
  return NextResponse.json(activities);
}

export async function POST(request: Request) {
  const body = await request.json();
  const activity = await prisma.activity.create({
    data: {
      type: body.type,
      text: body.text,
      time: body.time || "Just now",
      amount: body.amount,
    },
  });
  return NextResponse.json(activity, { status: 201 });
}
