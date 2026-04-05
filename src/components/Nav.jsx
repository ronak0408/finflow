import React from 'react'
import { useApp } from '../context/AppContext'

const TABS = ['dashboard', 'transactions', 'insights']

export default function Nav() {
  const { activeTab, setActiveTab } = useApp()

  return (
    <nav className="nav">
      {TABS.map((tab) => (
        <div
          key={tab}
          className={`nav-item ${activeTab === tab ? 'active' : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </div>
      ))}
    </nav>
  )
}
