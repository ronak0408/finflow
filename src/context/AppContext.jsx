import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { generateTransactions } from '../data/mockData'

const AppContext = createContext(null)

function loadTransactions() {
  try {
    const saved = localStorage.getItem('finflow_transactions')
    if (saved) return JSON.parse(saved)
  } catch (_) {}
  return generateTransactions(6)
}

function loadTheme() {
  try {
    return localStorage.getItem('finflow_theme') || 'dark'
  } catch (_) {
    return 'dark'
  }
}

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(loadTransactions)
  const [theme, setTheme]               = useState(loadTheme)
  const [role, setRole]                 = useState('admin')
  const [activeTab, setActiveTab]       = useState('dashboard')

  // Persist transactions
  useEffect(() => {
    try { localStorage.setItem('finflow_transactions', JSON.stringify(transactions)) } catch (_) {}
  }, [transactions])

  // Persist & apply theme
  useEffect(() => {
    document.documentElement.className = theme === 'light' ? 'light' : ''
    try { localStorage.setItem('finflow_theme', theme) } catch (_) {}
  }, [theme])

  // ── Derived stats ──────────────────────────────────────
  const totalIncome = useMemo(
    () => transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [transactions]
  )

  const totalExpense = useMemo(
    () => transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [transactions]
  )

  const balance = totalIncome - totalExpense

  const months = useMemo(
    () => [...new Set(transactions.map((t) => t.month))].reverse(),
    [transactions]
  )

  const monthStats = useMemo(
    () =>
      months.map((m) => {
        const mtxs = transactions.filter((t) => t.month === m)
        return {
          month: m,
          income:  mtxs.filter((t) => t.type === 'income').reduce((s, t)  => s + t.amount, 0),
          expense: mtxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
        }
      }),
    [transactions, months]
  )

  const catSpend = useMemo(() => {
    const map = {}
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => { map[t.cat] = (map[t.cat] || 0) + t.amount })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [transactions])

  // ── Transaction CRUD ───────────────────────────────────
  const addTransaction = (tx) => {
    const month = new Date(tx.date).toLocaleString('default', { month: 'short', year: 'numeric' })
    setTransactions((prev) => [{ ...tx, id: Date.now(), month }, ...prev])
  }

  const updateTransaction = (id, tx) => {
    const month = new Date(tx.date).toLocaleString('default', { month: 'short', year: 'numeric' })
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...tx, id, month } : t)))
  }

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  const toggleRole  = () => setRole((r) => (r === 'admin' ? 'viewer' : 'admin'))

  return (
    <AppContext.Provider
      value={{
        transactions,
        theme,
        role,
        activeTab,
        totalIncome,
        totalExpense,
        balance,
        months,
        monthStats,
        catSpend,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        toggleTheme,
        toggleRole,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
