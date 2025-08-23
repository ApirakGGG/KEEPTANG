import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await clerkClient();

    // ตรวจสอบ event type
    if (body.type === "user.created") {
      const userId = body.data.id;

      await user.users.updateUser(userId, {
        publicMetadata: { role: "user" },
      });
      console.log(`User ${userId} role set to "user"`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { status: "error", message: err },
      { status: 500 }
    );
  }
}
