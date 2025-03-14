import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SimpleBarReact from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { PiBrowsersBold } from "react-icons/pi";
import { BiSolidUserAccount } from "react-icons/bi";

const Sidebar: React.FC = () => {
  const [menu, setMenu] = useState<string>("");
  const [subMenus, setSubMenus] = useState<{ [key: string]: boolean }>({});
  const pathname = usePathname();

  useEffect(() => {
    setMenu(pathname);
    setSubMenus((prev) => ({ ...prev, [pathname]: true }));
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleMenuClick = (menuName: string) => {
    setSubMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const isActive = (path: string) => menu === path;

  const renderSubMenu = (menuName: string, links: { path: string; label: string }[]) => (
    <div className={`sidebar-submenu ${subMenus[menuName] ? "block" : "hidden"}`}>
      <ul>
        {links.map((link) => (
          <li key={link.path} className={`text-sm text-black hover:text-indigo-600 ${isActive(link.path) ? "active" : ""}`}>
            <Link href={link.path}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <nav className="sidebar-wrapper">
      <div className="sidebar-content">
        <div className="sidebar-brand">
          <Link href="/">
            <Image
              src="/images/logo-light.png"
              placeholder="blur"
              blurDataURL="/images/logo-light.png"
              width={138}
              height={24}
              alt="Logo"
            />
          </Link>
        </div>
        <SimpleBarReact style={{ height: "calc(100% - 70px)" }}>
          <ul className="sidebar-menu">
            <li className={`sidebar-dropdown text-black hover:text-indigo-600 ${["", "/", "/index-crypto", "/index-ecommerce"].includes(menu) ? "active" : ""}`}>
              <Link href="#" onClick={() => handleMenuClick("dashboard-item")}>
                <PiBrowsersBold className="icon mr-4" />
                Painel Administrativo
              </Link>
              {renderSubMenu("dashboard-item", [
                { path: "/dashboard", label: "Dashboard do usuário" },
                { path: "/index-crypto", label: "Relatórios" },
                { path: "/index-ecommerce", label: "Relatórios" },
              ])}
            </li>

            <li className={`sidebar-dropdown text-black hover:text-indigo-600 ${["/dashboard", "/users/coordinator", "/users/director", "/users/teacher", "/users/student"].includes(menu) ? "active" : ""}`}>
              <Link href="#" onClick={() => handleMenuClick("/index-item")}>
                <BiSolidUserAccount className="icon mr-4" />
                Usuários
              </Link>
              {renderSubMenu("/index-item", [
                { path: "/dashboard/secretary", label: "Secretário de Educação" },
                { path: "/users/coordinator", label: "Coordenadores" },
                { path: "/users/director", label: "Diretores" },
                { path: "/users/teacher", label: "Professores" },
                { path: "/users/student", label: "Estudantes" },
              ])}
            </li>
          </ul>
        </SimpleBarReact>
      </div>
    </nav>
  );
};

export default Sidebar;