import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import SimpleBarReact from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { PiAirplayFill } from 'react-icons/pi';
import { BiSolidUserAccount } from 'react-icons/bi';

interface LinkItem {
  path: string;
  label: string;
  roles?: string[];
}

const Sidebar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('');
  // Initialize subMenus with all menus open by default
  const [subMenus, setSubMenus] = useState<{ [key: string]: boolean }>({
    'dashboard-item': true,
    '/users-item': true
  });
  const [role, setRole] = useState<string | null>(null);
  const currentPath = usePathname();

  // Define which paths belong to which submenu
  const pathToSubmenuMap: { [key: string]: string } = {
    '/dashboard': 'dashboard-item',
    '/region': 'dashboard-item',
    '/school': 'dashboard-item',
    '/class': 'dashboard-item',
    '/users/secretaries': '/users-item',
    '/users/coordinators': '/users-item',
    '/users/directors': '/users-item',
    '/users/teachers': '/users-item',
    '/users/students': '/users-item',
  };

  useEffect(() => {
    setActiveMenu(currentPath);
    window.scrollTo(0, 0);
  }, [currentPath]);

  useEffect(() => {
    const storedRole = sessionStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleMenuClick = (menuName: string) => {
    setSubMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const isActive = (path: string) => activeMenu === path;
  
  // Check if user has access to any item in the submenu
  const hasAccessToAnyItem = (links: LinkItem[]): boolean => {
    return links.some(link => 
      !link.roles || 
      link.roles.length === 0 || 
      !role || 
      link.roles.includes(role)
    );
  };

  const renderSubMenu = (menuName: string, links: LinkItem[]) => (
    <div
      className={`sidebar-submenu ${subMenus[menuName] ? 'block' : 'hidden'}`}
    >
      <ul>
        {links
          .filter(
            (link) =>
              !link.roles ||
              link.roles.length === 0 ||
              !role ||
              link.roles.includes(role),
          )
          .map((link) => (
            <li
              key={link.path}
              className={`text-sm flex items-center ${
                isActive(link.path) ? 'active' : ''
              }`}
            >
              <Link
                href={link.path}
                className={`text-black hover:text-blue-500 ${
                  isActive(link.path) ? 'text-blue-500' : ''
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );

  // Define menu items for reuse
  const adminPanelItems: LinkItem[] = [
    { path: '/dashboard', label: 'Dashboard do usuário' },
    {
      path: '/region',
      label: 'Regiões',
      roles: ['SECRETARIO', 'COORDENADOR'],
    },
    {
      path: '/school',
      label: 'Escolas',
      roles: ['SECRETARIO', 'COORDENADOR', 'DIRETOR', 'PROFESSOR'],
    },
    {
      path: '/class',
      label: 'Turmas',
      roles: [
        'SECRETARIO',
        'COORDENADOR',
        'DIRETOR',
        'PROFESSOR',
        'USER',
      ],
    },
  ];

  const userPanelItems: LinkItem[] = [
    {
      path: '/users/secretaries',
      label: 'Secretário de Educação',
      roles: ['ADMIN'],
    },
    {
      path: '/users/coordinators',
      label: 'Coordenadores',
      roles: ['SECRETARIO'],
    },
    {
      path: '/users/directors',
      label: 'Diretores',
      roles: ['SECRETARIO', 'COORDENADOR'],
    },
    {
      path: '/users/teachers',
      label: 'Professores',
      roles: ['SECRETARIO', 'COORDENADOR', 'DIRETOR'],
    },
    {
      path: '/users/students',
      label: 'Alunos',
      roles: ['SECRETARIO', 'COORDENADOR', 'DIRETOR', 'PROFESSOR'],
    },
  ];

  return (
    <nav className="sidebar-wrapper">
      <div className="sidebar-content">
        <div className="sidebar-brand">LOGO SIGedu</div>
        <SimpleBarReact style={{ height: 'calc(100% - 70px)' }}>
          <ul className="sidebar-menu">
            {hasAccessToAnyItem(adminPanelItems) && (
              <li
                className={`sidebar-dropdown text-black hover:text-blue-500 ${
                  ['', '/dashboard', '/region', '/school', '/class'].includes(
                    activeMenu,
                  )
                    ? 'active'
                    : ''
                }`}
              >
                <Link href="#" onClick={() => handleMenuClick('dashboard-item')}>
                  <PiAirplayFill className="icon mr-4" />
                  Painel Administrativo
                </Link>
                {renderSubMenu('dashboard-item', adminPanelItems)}
              </li>
            )}
            
            {hasAccessToAnyItem(userPanelItems) && (
              <li
                className={`sidebar-dropdown text-black hover:text-blue-500 ${
                  [
                    '/users/secretaries',
                    '/users/coordinators',
                    '/users/directors',
                    '/users/teachers',
                    '/users/students',
                  ].includes(activeMenu)
                    ? 'active'
                    : ''
                }`}
              >
                <Link href="#" onClick={() => handleMenuClick('/users-item')}>
                  <BiSolidUserAccount className="icon mr-4" />
                  Painel de Usuários
                </Link>
                {renderSubMenu('/users-item', userPanelItems)}
              </li>
            )}
          </ul>
        </SimpleBarReact>
      </div>
    </nav>
  );
};

export default Sidebar;