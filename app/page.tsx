import Image from "next/image";
import FooterContent from "./Mycomponents/FooterContent";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { ThreeDMarqueePage } from "./Background3D/Background3D";
import { TextRevealCardPreview } from "./Mycomponents/TextRevealCardPreview";
import { HelpDialog } from "./Mycomponents/Help_Page";
import TransactionGuideDialog from "../components/GuideDialog";

export default async function Home() {
  const user = await currentUser();
  return (
    <div className="relative h-[70vh] py-1 px-10">
      {/* 3D BG inset-0 */}
      <div className="absolute inset-0 -z-10">
        <ThreeDMarqueePage />{" "}
      </div>
      <div className=" flex flex-col  md:items-start items-center md:flex-row gap-2 justify-between">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          {/*TextRevealCardPreview */}
          <TextRevealCardPreview />

          {/* button */}
          <div className="space-x-3 items-center mt-5 flex flex-wrap justify-center md:justify-start">
            {/* ถ้ามี session hide user button */}
            {user ? (
              <></>
            ) : (
              <>
                <button className="px-5 py-2 md:text-xl lg:text-2xl rounded-2xl border font-bold text-white bg-blue-500 dark:bg-neutral-800">
                  ใช้งานฟรี
                </button>
                <button className="px-5 py-2 md:text-xl lg:text-2xl rounded-2xl border font-bold text-white bg-green-500 hover:bg-green-600">
                  {/* SignIn */}
                  <Link href={"/sign-in"}>เริ่มต้นใช้งาน</Link>
                </button>
              </>
            )}
            <HelpDialog />
            <TransactionGuideDialog />
          </div>
        </div>
      </div>
      {/* Footer Content */}
      <FooterContent />
    </div>
  );
}
