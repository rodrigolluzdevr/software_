import React, { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SimpleBarReact from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { PiAirplayFill } from 'react-icons/pi';
import { BiSolidUserAccount, BiChevronDown, BiMenuAltLeft } from 'react-icons/bi';
import { FaGraduationCap } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

// Types
interface LinkItem {
  path: string;
  label: string;
  roles?: string[];
}

interface SubMenusState {
  [key: string]: boolean;
}

interface SidebarProps {
  children: ReactNode;
}

// Constants
const SUBMENU_IDS = {
  DASHBOARD: 'dashboard-item',
  USERS: '/users-item',
};

const ROLES = {
  ADMIN: 'ADMIN',
  SECRETARIO: 'SECRETARIO',
  COORDENADOR: 'COORDENADOR',
  DIRETOR: 'DIRETOR',
  PROFESSOR: 'PROFESSOR',
  USER: 'USER',
};

/**
 * Sidebar navigation component that displays menu items based on user role
 * and includes the full layout structure
 */
const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subMenus, setSubMenus] = useState<SubMenusState>({
    [SUBMENU_IDS.DASHBOARD]: false, // Começa fechado
    [SUBMENU_IDS.USERS]: false, // Começa fechado
  });
  const [role, setRole] = useState<string | null>(null);
  const currentPath = usePathname();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Menu data definitions
  const adminPanelItems: LinkItem[] = [
    {
      path: '/regions',
      label: 'Regiões',
      roles: [ROLES.SECRETARIO, ROLES.COORDENADOR],
    },
    {
      path: '/schools',
      label: 'Escolas',
      roles: [ROLES.SECRETARIO, ROLES.COORDENADOR, ROLES.DIRETOR, ROLES.PROFESSOR],
    },
    {
      path: '/school-classes',
      label: 'Turmas',
      roles: [ROLES.SECRETARIO, ROLES.COORDENADOR, ROLES.DIRETOR, ROLES.PROFESSOR],
    },
  ];

  const userPanelItems: LinkItem[] = [
    { path: '/dashboard', label: 'Dashboard' },
    {
      path: '/users/coordinators',
      label: 'Coordenadores',
      roles: [ROLES.SECRETARIO],
    },
    {
      path: '/users/directors',
      label: 'Diretores',
      roles: [ROLES.SECRETARIO, ROLES.COORDENADOR],
    },
    {
      path: '/users/teachers',
      label: 'Professores',
      roles: [ROLES.SECRETARIO, ROLES.COORDENADOR, ROLES.DIRETOR],
    },
    {
      path: '/users/students',
      label: 'Alunos',
      roles: [ROLES.SECRETARIO, ROLES.COORDENADOR, ROLES.DIRETOR, ROLES.PROFESSOR],
    },
  ];

  // Update active menu on path change
  useEffect(() => {
    setActiveMenu(currentPath);
    window.scrollTo(0, 0);
    
    // Auto-open submenu when a child page is active
    if (currentPath?.startsWith('/users') || currentPath === '/dashboard') {
      setSubMenus(prev => ({ ...prev, [SUBMENU_IDS.USERS]: true }));
    }
    
    if (currentPath?.startsWith('/regions') || 
        currentPath?.startsWith('/schools') || 
        currentPath?.startsWith('/school-classes')) {
      setSubMenus(prev => ({ ...prev, [SUBMENU_IDS.DASHBOARD]: true }));
    }
  }, [currentPath]);

  // Load user role
  useEffect(() => {
    const storedRole = sessionStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  // Utility functions
  const handleMenuClick = (menuName: string) => {
    setSubMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const isActive = (path: string) => activeMenu === path;

  const hasAccessToAnyItem = (links: LinkItem[]): boolean => {
    return links.some(
      (link) =>
        !link.roles ||
        link.roles.length === 0 ||
        !role ||
        link.roles.includes(role),
    );
  };

  // Check if a parent menu should be highlighted
  const isParentActive = (paths: string[]): boolean => {
    return paths.some((path) => currentPath?.startsWith(path));
  };

  // Render helpers
  const renderSubMenu = (menuName: string, links: LinkItem[]) => (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        subMenus[menuName] ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
      }`}
    >
      <ul className="pl-8 space-y-2 pt-1">
        {links
          .filter(
            (link) =>
              !link.roles ||
              link.roles.length === 0 ||
              !role ||
              link.roles.includes(role),
          )
          .map((link) => (
            <li key={link.path} className="text-sm">
              <Link
                href={link.path}
                className={`block py-2 px-3 rounded-md transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );

  // Classes for wrapper
  const pageWrapperClasses = `bg-gray-50 ${sidebarOpen ? 'toggled' : ''}`;

  return (
    <div className={pageWrapperClasses}>
      {/* Overlay para mobile quando sidebar está aberto */}
      <div 
        className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden
          ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />
      
      {/* Sidebar */}
      <aside 
        className="sidebar-wrapper fixed top-0 left-0 z-50 h-screen bg-white shadow-lg border-r border-gray-200 duration-300 w-64"
      >
        <div className="sidebar-content h-full">
          {/* Logo e botão de fechar */}
          <div className="sidebar-brand flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link href="/" className="flex items-center space-x-2">
              <FaGraduationCap className="text-blue-600 text-2xl" />
              <span className="text-lg font-bold text-gray-800">SIGedu</span>
            </Link>
            
            {/* Botão de fechar para mobile */}
            <button 
              onClick={toggleSidebar}
              id="close-sidebar"
              className="p-1 rounded-full hover:bg-gray-100 lg:hidden"
              aria-label="Close sidebar"
            >
              <IoMdClose className="text-xl text-gray-600" />
            </button>
          </div>

          {/* Menu de navegação */}
          <SimpleBarReact style={{ height: 'calc(100% - 64px)' }} className="p-4">
            <ul className="sidebar-menu space-y-2">
              {/* Users Panel Menu */}
              {hasAccessToAnyItem(userPanelItems) && (
                <li className={`sidebar-dropdown relative ${subMenus[SUBMENU_IDS.USERS] ? 'active' : ''}`}>
                  <button
                    onClick={() => handleMenuClick(SUBMENU_IDS.USERS)}
                    className="flex items-center justify-between w-full px-3 py-3 text-left rounded-md transition-all duration-200 text-gray-700 hover:bg-gray-50 hover:text-blue-500"
                  >
                    <div className="flex items-center">
                      <BiSolidUserAccount className="text-xl mr-3" />
                      <span className="font-medium">Painel de Usuários</span>
                    </div>
                    <BiChevronDown
                      className={`transition-transform duration-200 ${
                        subMenus[SUBMENU_IDS.USERS] ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div className={`sidebar-submenu ${subMenus[SUBMENU_IDS.USERS] ? 'block' : ''}`}>
                    <ul className="pl-8 space-y-2 pt-1">
                      {userPanelItems
                        .filter(
                          (link) =>
                            !link.roles ||
                            link.roles.length === 0 ||
                            !role ||
                            link.roles.includes(role),
                        )
                        .map((link) => (
                          <li key={link.path} className="text-sm">
                            <Link
                              href={link.path}
                              className={`block py-2 px-3 rounded-md transition-all duration-200 ${
                                isActive(link.path)
                                  ? 'bg-blue-50 text-blue-600 font-medium'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                              }`}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                </li>
              )}

              {/* Admin Panel Menu */}
              {hasAccessToAnyItem(adminPanelItems) && (
                <li className={`sidebar-dropdown relative ${subMenus[SUBMENU_IDS.DASHBOARD] ? 'active' : ''}`}>
                  <button
                    onClick={() => handleMenuClick(SUBMENU_IDS.DASHBOARD)}
                    className="flex items-center justify-between w-full px-3 py-3 text-left rounded-md transition-all duration-200 text-gray-700 hover:bg-gray-50 hover:text-blue-500"
                  >
                    <div className="flex items-center">
                      <PiAirplayFill className="text-xl mr-3" />
                      <span className="font-medium">Painel Administrativo</span>
                    </div>
                    <BiChevronDown
                      className={`transition-transform duration-200 ${
                        subMenus[SUBMENU_IDS.DASHBOARD]
                          ? 'transform rotate-180'
                          : ''
                      }`}
                    />
                  </button>
                  <div className={`sidebar-submenu ${subMenus[SUBMENU_IDS.DASHBOARD] ? 'block' : ''}`}>
                    <ul className="pl-8 space-y-2 pt-1">
                      {adminPanelItems
                        .filter(
                          (link) =>
                            !link.roles ||
                            link.roles.length === 0 ||
                            !role ||
                            link.roles.includes(role),
                        )
                        .map((link) => (
                          <li key={link.path} className="text-sm">
                            <Link
                              href={link.path}
                              className={`block py-2 px-3 rounded-md transition-all duration-200 ${
                                isActive(link.path)
                                  ? 'bg-blue-50 text-blue-600 font-medium'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                              }`}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                </li>
              )}

              {/* User Role Badge */}
              {role && (
                <div className="mt-8 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Conectado como</p>
                  <div className="flex items-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {role}
                    </span>
                  </div>
                </div>
              )}
            </ul>
          </SimpleBarReact>
        </div>
      </aside>

      {/* Content area */}
      <div className="page-content">
        {/* Header */}
        <div className="top-header">
          <div className="header-bar flex">
            {/* Toggle sidebar button */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="Toggle sidebar"
            >
              <BiMenuAltLeft className="text-2xl" />
            </button>
            
            <div className="ml-auto">
              {/* Header content */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;