import React from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Topbar      from './components/Topbar'
import Nav         from './components/Nav'
import Dashboard   from './components/Dashboard'
import Transactions from './components/Transactions'
import Insights    from './components/Insights'

function AppShell() {
  const { activeTab } = useApp()

  return (
    <div className="app">
      <Topbar />
      <Nav />
      <main className="main">
        {activeTab === 'dashboard'    && <Dashboard />}
        {activeTab === 'transactions' && <Transactions />}
        {activeTab === 'insights'     && <Insights />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
