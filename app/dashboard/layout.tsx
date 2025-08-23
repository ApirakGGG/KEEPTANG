import React, {ReactNode} from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KEEPTANG || เก็บตัง DashBoard",
  description: "Create by Apirak Jansawang",
};

export default function layout({children} : {children: ReactNode}) {
    return (
        <div className="relative flex h-[70vh] w-full flex-col">
            <div className="w-full">
                {children}
            </div>
        </div>
    )
}