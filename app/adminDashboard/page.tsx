import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import UserManage from "./Admin_UserManage";

export default async function Adminpage() {
  const user = await currentUser();

  //check admin
  const isadmin = user?.publicMetadata.role === "admin";

  if (!user) {
    redirect("/");
  }

  if (!user?.publicMetadata.role === isadmin && !user) {
    redirect("/");
  }
  return (
    <>
      <UserManage />
    </>
  );
}
