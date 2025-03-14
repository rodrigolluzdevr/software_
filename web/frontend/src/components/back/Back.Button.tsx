import React from "react";
import Link from "next/link";

import * as Icon from 'react-feather'

export default function BackButton(){
    return(
        <>
         <div className="fixed bottom-3 end-3">
            <Link href="/" className="back-button size-9 inline-flex items-center justify-center tracking-wide border align-middle duration-500 text-base text-center bg-white hover:bg-black border-black hover:border-white text-black hover:text-white rounded-full"><Icon.ArrowLeft className="size-4"/></Link>
        </div>
        </>
    )
}