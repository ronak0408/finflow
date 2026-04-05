import React, { useState } from 'react'
import { CATEGORIES } from '../data/mockData'

const today = new Date().toISOString().split('T')[0]

const empty = {
  desc:   '',
  cat:    'Food',
  type:   'expense',
  amount: '',
  date:   today,
}

export default function TxModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || empty)

  const upd = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSave = () => {
    if (!form.desc || !form.amount || Number(form.amount) <= 0) return
    onSave({ ...form, amount: Number(form.amount) })
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal fade-in">
        <h2>{initial ? 'Edit Transaction' : 'Add Transaction'}</h2>

        {/* Type toggle */}
        <div className="form-group">
          <label className="form-label">Type</label>
          <div className="type-toggle">
            <button
              className={`type-btn ${form.type === 'income' ? 'active income' : ''}`}
              onClick={() => upd('type', 'income')}
            >
              Income
            </button>
            <button
              className={`type-btn ${form.type === 'expense' ? 'active expense' : ''}`}
              onClick={() => upd('type', 'expense')}
            >
              Expense
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            className="form-input"
            placeholder="e.g. Salary, Rent…"
            value={form.desc}
            onChange={(e) => upd('desc', e.target.value)}
          />
        </div>

        {/* Category + Amount */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={form.cat}
              onChange={(e) => upd('cat', e.target.value)}
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Amount ($)</label>
            <input
              className="form-input"
              type="number"
              min="0"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => upd('amount', e.target.value)}
            />
          </div>
        </div>

        {/* Date */}
        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            className="form-input"
            type="date"
            value={form.date}
            onChange={(e) => upd('date', e.target.value)}
          />
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  )
}
