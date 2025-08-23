import Link from "next/link";
import Image from "next/image";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ModeToggle } from "./ModeToggle";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";

export default async function Navbar() {
  const { userId } = await auth();
  const user = await currentUser();

  const Navlink = [
    { id: 1, label: "เป้าหมายการออม", path: "/" },
    { id: 2, label: " รายรับ | รายจ่าย", path: "/" },
    { id: 3, label: " สรุปรายรับรายจ่าย", path: "/dashboard" },
    { id: 4, label: "ตั้งค่า", path: "/manage" },
  ];

  // console.log("Data", user);
  // console.log("DataUserID", userId);
  return (
    <ClerkProvider>
      <div className="flex justify-between px-20 h-[100px] items-center rounded-lg">
        {/* Topic content */}

        <Link href={"/"} className="flex items-center">
          <Image
            src={"/LOGO_KEEPTANG.png"}
            alt="logo"
            width={150}
            height={150}
            className="object-cover"
          />{" "}
          {/* <h1 className="font-bold text-2xl">{"KEEPTANG > เก็บตัง"}</h1> */}
          <ContainerTextFlip />
        </Link>

        {/* function */}
        <div className="flex gap-28 items-center">
          <div className="flex flex-row space-x-5 md:block">
            {user &&
              Navlink.map((nav) => (
                <Link
                  className="font-semibold px-3 rounded-lg hover:underline"
                  href={nav.path}
                  key={nav.id}
                >
                  {nav.label}
                </Link>
              ))}
            {user?.publicMetadata.role === "admin" && (
              <>
                <Link
                  className="font-semibold px-3 rounded-lg hover:underline"
                  href="/adminDashboard"
                >
                  Admin
                </Link>
              </>
            )}
          </div>

          {/* user */}

          <header className="flex justify-end items-center p-4 gap-4 h-16 cursor-pointer">
            {user ? (
              <>
                <SignedIn>
                  <UserButton />
                  <p className="font-bold">{user?.fullName}</p>
                </SignedIn>
              </>
            ) : (
              // sign-up
              <>
                <button className="px-5 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl cursor-pointer">
                  <Link href={"/sign-up"}>REGISTING</Link>
                </button>
                {/*sign-in */}
                <button className="px-5 py-2 bg-green-500 hover:bg-green-600 rounded-xl cursor-pointer">
                  <Link href={"/sign-in"}>LOGIN</Link>
                </button>
              </>
            )}
          </header>
          {/* MODE TOGGLE */}
          <div className=" flex items-center justify-end">
            <ModeToggle />
          </div>
        </div>
      </div>
    </ClerkProvider>
  );
}
