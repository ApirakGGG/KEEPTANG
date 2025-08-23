"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useEffect, useState } from "react";

export default function UserManage() {
  const [userList, setuserList] = useState<any[]>([]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 270 },
    { field: "firstname", headerName: "First name", width: 200 },
    { field: "lastname", headerName: "Last name", width: 200 },
    {
      field: "fullName",
      headerName: "Full name",
      sortable: false,
      width: 160,
      valueGetter: (value, row) =>
        `${row.firstname || ""} ${row.lastname || ""}`,
    },
    { field: "email", headerName: "Email", width: 250 },
    { field: "lastActiveAt", headerName: "ActivateAt", width: 200 },
     { field: "lastSignInAt", headerName: "LastSignInAt", width: 200 },
    { field: "createdAt", headerName: "CreateAccountAt", width: 200 },
  ];

  useEffect(() => {
    axios
      .get("/api/user_list")
      .then((res) => {
        // ดึงเฉพาะ data array
        setuserList(res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  //ก่อนจะmap ควรกำหนด interface ก่อนจะได้รู้ว่าเราจะเรียกใช้Data อันไหน
  const rows = userList.map((user) => ({
    id: user.id,
    firstname: user.firstName,
    lastname: user.lastName,
    email: user.emailAddresses[0]?.emailAddress || "",
    fullName: `${user.firstName} ${user.lastName}`,
    lastActiveAt: user.lastActiveAt
      ? new Date(user?.lastActiveAt).toDateString()
      : "N/A",
        lastSignInAt: user.lastSignInAt
      ? new Date(user?.lastSignInAt).toDateString()
      : "N/A",
    createdAt: user.createdAt ? new Date(user?.createdAt).toDateString() : "N/A",
  }));

  console.log("UserList", userList);

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
