import React from 'react';
import './index.css';

export default function Sidebar({ header, children, footer, isOpen }) {
  return (
    <div className={isOpen ? "sidebar is-open" : "sidebar"}>
      {header && <div className="sidebar-header">{header}</div>}
      <nav className="sidebar-nav">
        {children}
      </nav>
      {footer && <div className="sidebar-footer">{footer}</div>}
    </div>
  );
}