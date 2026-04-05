import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useTransactionFilter } from '../hooks/useTransactionFilter'
import { fmt, sortIcon, exportCSV, exportJSON } from '../utils/format'
import TxModal from './TxModal'

const CATEGORIES = ['All', 'Food', 'Transport', 'Housing', 'Entertainment', 'Healthcare', 'Shopping', 'Income', 'Investment']

export default function Transactions() {
  const { transactions, role, addTransaction, updateTransaction, deleteTransaction } = useApp()
  const [modal,  setModal]  = useState(false)
  const [editTx, setEditTx] = useState(null)

  const {
    search, setSearch,
    catFilter, setCatFilter,
    typeFilter, setTypeFilter,
    dateFilter, setDateFilter,
    sortBy, sortDir, handleSort,
    page, setPage, totalPages, PER_PAGE,
    filtered, paginated,
  } = useTransactionFilter(transactions)

  const openAdd  = ()     => { setEditTx(null); setModal(true) }
  const openEdit = (tx)   => { setEditTx(tx);   setModal(true) }
  const closeModal = ()   => { setModal(false);  setEditTx(null) }

  const handleSave = (tx) => {
    if (editTx) updateTransaction(editTx.id, tx)
    else        addTransaction(tx)
    closeModal()
  }

  return (
    <div className="fade-in">
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div className="section-title" style={{ margin: 0 }}>Transactions</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {role === 'admin' && (
            <button className="btn primary" onClick={openAdd}>+ Add Transaction</button>
          )}
          <div className="export-btns">
            <button className="btn" onClick={() => exportCSV(filtered)}>Export CSV</button>
            <button className="btn" onClick={() => exportJSON(filtered)}>Export JSON</button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>

        <select className="filter-select" value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setPage(1) }}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>

        <select className="filter-select" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}>
          <option>All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select className="filter-select" value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setPage(1) }}>
          <option value="All">All Time</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-wrap">
        {paginated.length === 0 ? (
          <div className="empty-state">
            <h3>No transactions found</h3>
            <p>Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('date')}>Date{sortIcon('date', sortBy, sortDir)}</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th onClick={() => handleSort('amount')} style={{ textAlign: 'right' }}>Amount{sortIcon('amount', sortBy, sortDir)}</th>
                {role === 'admin' && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.map((t) => (
                <tr key={t.id}>
                  <td style={{ color: 'var(--text3)', fontSize: '12px', fontFamily: 'var(--mono)' }}>{t.date}</td>
                  <td style={{ fontWeight: 500 }}>{t.desc}</td>
                  <td><span className="cat-badge">{t.cat}</span></td>
                  <td><span className={`badge ${t.type}`}>{t.type === 'income' ? 'Income' : 'Expense'}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={t.type === 'income' ? 'amount-pos' : 'amount-neg'}>
                      {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                    </span>
                  </td>
                  {role === 'admin' && (
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-btns" style={{ justifyContent: 'flex-end' }}>
                        <button className="icon-btn" onClick={() => openEdit(t)}>✏</button>
                        <button className="icon-btn btn danger" onClick={() => deleteTransaction(t.id)}>✕</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="pagination">
          <div className="page-info">
            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </div>
          <div className="page-btns">
            <button className="btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>←</button>
            <span style={{ fontSize: '12px', color: 'var(--text3)', padding: '0 8px', lineHeight: '34px' }}>
              {page} / {Math.max(1, totalPages)}
            </span>
            <button className="btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>→</button>
          </div>
        </div>
      </div>

      {modal && <TxModal initial={editTx} onClose={closeModal} onSave={handleSave} />}
    </div>
  )
}
