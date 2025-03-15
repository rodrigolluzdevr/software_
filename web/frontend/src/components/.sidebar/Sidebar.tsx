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
  const [subMenus, setSubMenus] = useState<{ [key: string]: boolean }>({});
  const [role, setRole] = useState<string | null>(null);
  const currentPath = usePathname();

  useEffect(() => {
    setActiveMenu(currentPath);
    setSubMenus((prev) => ({ ...prev, [currentPath]: true }));
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

  const renderSubMenu = (menuName: string, links: LinkItem[]) => (
    <div
      className={`sidebar-submenu ${subMenus[menuName] ? 'block' : 'hidden'}`}
    >
      <ul>
        {links
          .filter((link) => !link.roles || (role && link.roles.includes(role)))
          .map((link) => (
            <li
              key={link.path}
              className={`text-sm text-black flex items-center hover:text-blue-500 ${
                isActive(link.path) ? 'active' : ''
              }`}
            >
              <Link href={link.path}>{link.label}</Link>
            </li>
          ))}
      </ul>
    </div>
  );

  return (
    <nav className="sidebar-wrapper">
      <div className="sidebar-content">
        <div className="sidebar-brand">LOGO SIGedu</div>
        <SimpleBarReact style={{ height: 'calc(100% - 70px)' }}>
          <ul className="sidebar-menu">
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
              {renderSubMenu('dashboard-item', [
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
              ])}
            </li>
            <li
              className={`sidebar-dropdown text-black hover:text-blue-500 ${
                [
                  '/dashboard',
                  '/users/coordinator',
                  '/users/director',
                  '/users/teacher',
                  '/users/student',
                ].includes(activeMenu)
                  ? 'active'
                  : ''
              }`}
            >
              <Link href="#" onClick={() => handleMenuClick('/users-item')}>
                <BiSolidUserAccount className="icon mr-4" />
                Usuários
              </Link>
              {renderSubMenu('/users-item', [
                {
                  path: '/users/secretary',
                  label: 'Secretário de Educação',
                  roles: ['ADMIN'],
                },
                {
                  path: '/users/coordinator',
                  label: 'Coordenadores',
                  roles: ['SECRETARIO'],
                },
                {
                  path: '/users/director',
                  label: 'Diretores',
                  roles: ['SECRETARIO', 'COORDENADOR'],
                },
                {
                  path: '/users/teacher',
                  label: 'Professores',
                  roles: ['SECRETARIO', 'COORDENADOR', 'DIRETOR'],
                },
                {
                  path: '/users/student',
                  label: 'Estudantes',
                  roles: ['SECRETARIO', 'COORDENADOR', 'DIRETOR', 'PROFESSOR'],
                },
              ])}
            </li>
          </ul>
        </SimpleBarReact>
      </div>
    </nav>
  );
};

export default Sidebar;
