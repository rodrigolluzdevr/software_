import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { IoMdLogOut } from "react-icons/io";
import { AiOutlineSetting } from "react-icons/ai";
import router from "next/router";
import { BiSolidUser } from "react-icons/bi";
import { BsLightningChargeFill } from "react-icons/bs";
import { fetchUser } from "@/services/authService";

interface HeaderProps {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  toggle: boolean;
}

interface User {
  id: number;
  name: string;
  cpf?: string;
  email?: string;
  // Adicione outras propriedades necessárias
}

const Header: React.FC<HeaderProps> = ({ setToggle, toggle }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function getUser() {
      const userData = await fetchUser();
      if (userData) {
        setUser(userData);
      }
    }
    getUser();
  }, []);

  const toggleSidebar = () => setToggle(!toggle);

  const logout = () => {
    sessionStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <div className="top-header">
      <div className="header-bar flex justify-between">
        <div className="flex items-center space-x-1">
          <button
            id="close-sidebar"
            className="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-[20px] text-center bg-white border border-white text-slate-900 rounded-full"
            onClick={toggleSidebar}
          >
            <BsLightningChargeFill className="size-6 hover:text-indigo-600" />
          </button>
        </div>

        <ul className="list-none mb-0 space-x-1 relative">
          <li className="dropdown inline-block relative">
            <button
              onClick={() => setDropdownVisible(!dropdownVisible)}
              className="dropdown-toggle items-center"
              type="button"
            >
              <span className="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-[20px] text-center bg-white border border-white text-slate-900 rounded-full">
                <BiSolidUser className="size-6 hover:text-indigo-600" />
              </span>
              <span className="font-semibold text-[14x] ms-2 sm:inline-block hidden items-center py-2 px-4 hover:text-indigo-600">
                {user ? user.name : "Usuário"}
              </span>
            </button>
            {dropdownVisible && (
              <div
                className="dropdown-menu absolute end-0 m-0 mt-4 z-10 w-52 rounded-md overflow-hidden bg-white shadow-sm"
                ref={dropdownRef}
              >
                <ul className="py-2 text-start">
                  <li>
                    <Link
                      href="/profile"
                      className="flex items-center font-medium py-1 px-4 hover:text-indigo-600"
                    >
                      <BiSolidUser className="me-2" />
                      Perfil
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile-setting"
                      className="flex items-center font-medium py-1 px-4 hover:text-indigo-600"
                    >
                      <AiOutlineSetting className="me-2" />
                      Alterar Senha
                    </Link>
                  </li>
                  <li className="border-t border-gray-100 my-2"></li>
                  <li>
                    <Link
                      href="/login"
                      onClick={logout}
                      className="flex items-center font-medium py-1 px-4 hover:text-indigo-600"
                    >
                      <IoMdLogOut className="me-2" />
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
