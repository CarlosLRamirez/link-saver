import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      include: { user: true },
    });
    return NextResponse.json(links);
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // For testing: get or create a default user
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "test@example.com",
          password: "temporary",
        },
      });
    }

    const link = await prisma.link.create({
      data: {
        url: body.url,
        title: body.title,
        notes: body.notes,
        userId: user.id,
      },
    });
    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error("Error creating link:", error);
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
  }
}