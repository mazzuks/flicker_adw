import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-adworks-muted mb-4">
      <Link to="/" className="hover:text-adworks-blue transition-colors">
        <Home className="w-3 h-3" />
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3 h-3 opacity-30" />
          {item.href ? (
            <Link to={item.href} className="hover:text-adworks-blue transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-adworks-dark">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
