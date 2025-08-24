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

  return (
    <ClerkProvider>
      <nav className="flex justify-between px-5 h-[100px] items-center rounded-lg">
        {/* Topic content */}

        <Link href={"/"} className="flex items-center">
          <Image
            src={"/LOGO_KEEPTANG.png"}
            alt="logo"
            width={150}
            height={150}
            className="object-cover"
          />{" "}
          <ContainerTextFlip />
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-6 items-center">
          {user &&
            Navlink.map((nav) => (
              <Link
                key={nav.id}
                href={nav.path}
                className="font-semibold px-3 py-1 rounded-lg hover:underline"
              >
                {nav.label}
              </Link>
            ))}

          {user?.publicMetadata?.role === "admin" && (
            <Link
              href="/adminDashboard"
              className="font-semibold px-3 py-1 rounded-lg hover:underline "
            >
              Admin
            </Link>
          )}

          {/* user */}
          <header className="flex items-center p-4 gap-4 cursor-pointer">
            {user ? (
              <>
                <SignedIn>
                  <UserButton />
                  <p className="font-bold hidden sm:block">{user?.fullName}</p>
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
          <ModeToggle />
        </div>
      </nav>
    </ClerkProvider>
  );
}
