import { clerkClient, currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const clerk = await clerkClient();
    const user = await currentUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "No user found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const usersList = await clerk.users.getUserList({
      limit: 50,
    });

    return new Response(JSON.stringify(usersList), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    // console.log("User_List", usersList);
  } catch (err) {
    console.error("error", err);
    return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
