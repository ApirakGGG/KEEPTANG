import { ReactNode } from "react";
import Logo from "../Mycomponents/Logo";

export default function layout({children } : {children: ReactNode}) {
    return(
        <div className="relative flex h-[70vh] w-full flex-col items-center justify-center">
             {children}
             <Logo />
        </div>
    )
}