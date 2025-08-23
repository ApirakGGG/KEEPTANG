import React, {ReactNode} from "react";
import type { Metadata } from "next";
import Logo from "../Mycomponents/Logo";

export const metadata: Metadata = {
  title: "KEEPTANG || เก็บตัง",
  description: "Create by Apirak Jansawang",
};

export default function layout({children} : {children: ReactNode}) {
    return (
        <div className="relative flex h-[70vh] w-full flex-col items-center justify-center">
            <Logo />
            <div>
                {children}
            </div>
        </div>
    )
}