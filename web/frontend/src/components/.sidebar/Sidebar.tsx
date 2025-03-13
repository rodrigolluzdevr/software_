import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import SimpleBarReact from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import { AiOutlineLineChart } from "react-icons/ai";

export default function Sidebar() {
  return (
    <nav className="sidebar-wrapper">
      <div className=" sidebar-content">
        <div className="sidebar-brand">
          <h3 className="bold text-slate-400 ">LOGO</h3>
        </div>
        <SimpleBarReact style={{ height: "calc(100% - 70px)" }}>
          <ul className="sidebar-menu border-t border-white/10">
            
            <li>
              <Link href="/dashboard">
                <AiOutlineLineChart className="me-3 icon" />
                Dashboard
              </Link>
            </li>

            <li>
              <Link href="/users">
                <AiOutlineLineChart className="me-3 icon" />
                Usuários
              </Link>
            </li>

          </ul>
        </SimpleBarReact>
      </div>
    </nav>
  );
}
