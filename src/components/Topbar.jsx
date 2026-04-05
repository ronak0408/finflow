import React from 'react'
import { useApp } from '../context/AppContext'

export default function Topbar() {
  const { role, theme, toggleRole, toggleTheme } = useApp()

  return (
    <header className="topbar">
      <div className="logo">
        <div className="logo-dot" />
        FinFlow
      </div>

      <div className="topbar-right">
        <button className={`role-badge ${role}`} onClick={toggleRole}>
          {role === 'admin' ? '⚡ Admin' : '👁 Viewer'}
        </button>

        <button className="theme-btn" onClick={toggleTheme}>
          {theme === 'dark' ? '☀ Light' : '◑ Dark'}
        </button>
      </div>
    </header>
  )
}
