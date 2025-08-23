"use client";

import { ThreeDMarquee } from "@/components/ui/3d-marquee";

export function ThreeDMarqueePage() {
  const images = [
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
    "/LOGO_KEEPTANG.png",
  ];
  return (
    <div className="h-full w-full -z-30 rounded-3xl p-2 items-center justify-center flex ">
      <ThreeDMarquee images={images} />
    </div>
  );
}
