import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clerk = await clerkClient();
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    const usersList = await clerk.users.getUserList({
      limit: 50, // จำนวน user ที่ต้องการดึง
    });
    // console.log("User_List", usersList);
    return NextResponse.json(usersList);
  } catch (err) {
    console.error("error" ,err)
    NextResponse.json({ err: "Failed to fetch users" }, { status: 500 });
  }
}
