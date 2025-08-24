import Image from "next/image";
import FooterContent from "./Mycomponents/FooterContent";
import { currentUser } from "@clerk/nextjs/server";
import { LogoPage } from "./Mycomponents/Logo";
import Link from "next/link";
import { ThreeDMarqueePage } from "./Background3D/Background3D";
import { TextRevealCardPreview } from "./Mycomponents/TextRevealCardPreview";

export default async function Home() {
  const user = await currentUser();
  return (
    <div className="relative h-[70vh] py-5 px-10">
      {/* 3D BG inset-0 */}
      <div className="absolute inset-0 -z-10 mt-10 ">
        <ThreeDMarqueePage />{" "}
      </div>
      <div className=" flex flex-col md:flex-row gap-2 justify-between  ">
        <div>
          {/*TextRevealCardPreview */}
          <TextRevealCardPreview />
          {/* button */}
          <div className="space-x-3">
            <button className="mt-7 px-5 py-3 md:text-2xl rounded-2xl border font-bold text-white bg-blue-500 dark:bg-neutral-800">
              ใช้งานฟรี
            </button>

            {/* ถ้ามี session hide user button */}
            {user ? (
              <></>
            ) : (
              <button className="mt-7 px-5 py-3 md:text-2xl rounded-2xl border font-bold text-white bg-green-500 hover:bg-green-600">
                {/* SignIn */}
                <Link href={"/sign-in"}>เริ่มต้นใช้งาน</Link>
              </button>
            )}
          </div>
        </div>
        {/* <Image
          src={"/banner.png"}
          alt="profile"
          width={500}
          height={500}
          className="object-cover rounded-2xl size-56 lg:size-max opacity-90 "
        /> */}
      </div>
      {/* Footer Content */}
      <FooterContent />
    </div>
  );
}
