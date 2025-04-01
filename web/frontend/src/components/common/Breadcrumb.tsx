import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => (
  <nav className="mb-6" aria-label="Breadcrumb">
    <ul className="flex items-center text-[14px] font-bold">
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`}>
          {index > 0 && <span className="mx-2" aria-hidden="true">/</span>}
          
          {item.href && !item.active ? (
            <Link href={item.href} className="hover:text-blue-500 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className={item.active ? "text-blue-500" : ""} aria-current={item.active ? "page" : undefined}>
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ul>
  </nav>
);