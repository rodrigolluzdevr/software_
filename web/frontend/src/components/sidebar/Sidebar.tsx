import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SimpleBarReact from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { PiAirplayFill } from 'react-icons/pi';
import { BiSolidUserAccount } from 'react-icons/bi';

// Types
interface LinkItem {
  path: string;
  label: string;
  roles?: string[];
}

interface SubMenusState {
  [key: string]: boolean;
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
 */
const Sidebar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('');
  const [subMenus, setSubMenus] = useState<SubMenusState>({
    [SUBMENU_IDS.DASHBOARD]: true,
    [SUBMENU_IDS.USERS]: true,
  });
  const [role, setRole] = useState<string | null>(null);
  const currentPath = usePathname();

  // Menu data definitions
  const adminPanelItems: LinkItem[] = [
    { path: '/dashboard', label: 'Dashboard Do Usuário' },
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
      path: '/school-class',
      label: 'Turmas',
      roles: [
        ROLES.SECRETARIO,
        ROLES.COORDENADOR,
        ROLES.DIRETOR,
        ROLES.PROFESSOR,
        ROLES.USER,
      ],
    },
  ];

  const userPanelItems: LinkItem[] = [
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
    return links.some(link => 
      !link.roles || 
      link.roles.length === 0 || 
      !role || 
      link.roles.includes(role)
    );
  };

  // Render helpers
  const renderSubMenu = (menuName: string, links: LinkItem[]) => (
    <div className={`sidebar-submenu ${subMenus[menuName] ? 'block' : 'hidden'}`}>
      <ul>
        {links
          .filter(link => !link.roles || link.roles.length === 0 || !role || link.roles.includes(role))
          .map(link => (
            <li key={link.path} className={`text-sm flex items-center ${isActive(link.path) ? 'active' : ''}`}>
              <Link
                href={link.path}
                className={`text-black hover:text-blue-500 ${isActive(link.path) ? 'text-blue-500' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );

  // Active state helpers
  const isAdminPanelActive = ['', '/dashboard', '/regions', '/schools', '/school-class'].includes(activeMenu);
  const isUserPanelActive = [
    '/users/coordinators',
    '/users/directors',
    '/users/teachers',
    '/users/students',
  ].includes(activeMenu);

  return (
    <nav className="sidebar-wrapper">
      <div className="sidebar-content">
        <div className="sidebar-brand">LOGO SIGedu</div>
        <SimpleBarReact style={{ height: 'calc(100% - 70px)' }}>
          <ul className="sidebar-menu">
            {/* Admin Panel Menu */}
            {hasAccessToAnyItem(adminPanelItems) && (
              <li className={`sidebar-dropdown text-black hover:text-blue-500 ${isAdminPanelActive ? 'active' : ''}`}>
                <Link href="#" onClick={() => handleMenuClick(SUBMENU_IDS.DASHBOARD)}>
                  <PiAirplayFill className="icon mr-4" />
                  Painel Administrativo
                </Link>
                {renderSubMenu(SUBMENU_IDS.DASHBOARD, adminPanelItems)}
              </li>
            )}
            
            {/* Users Panel Menu */}
            {hasAccessToAnyItem(userPanelItems) && (
              <li className={`sidebar-dropdown text-black hover:text-blue-500 ${isUserPanelActive ? 'active' : ''}`}>
                <Link href="#" onClick={() => handleMenuClick(SUBMENU_IDS.USERS)}>
                  <BiSolidUserAccount className="icon mr-4" />
                  Painel de Usuários
                </Link>
                {renderSubMenu(SUBMENU_IDS.USERS, userPanelItems)}
              </li>
            )}
          </ul>
        </SimpleBarReact>
      </div>
    </nav>
  );
};

export default Sidebar;