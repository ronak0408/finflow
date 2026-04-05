import React, { useEffect, useRef } from 'react'
import {
  Chart,
  BarElement, BarController,
  CategoryScale, LinearScale, Tooltip, Legend,
} from 'chart.js'
import { useApp } from '../context/AppContext'
import { fmt } from '../utils/format'

Chart.register(BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend)

export default function Insights() {
  const { transactions, monthStats, catSpend, balance, totalIncome, totalExpense, theme } = useApp()

  const barRef   = useRef()
  const barChart = useRef()

  const topCat      = catSpend[0] || ['N/A', 0]
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0
  const lastMonth   = monthStats[monthStats.length - 1] || { income: 0, expense: 0 }
  const prevMonth   = monthStats[monthStats.length - 2] || { income: 0, expense: 0 }
  const expChange   = prevMonth.expense > 0
    ? Math.round(((lastMonth.expense - prevMonth.expense) / prevMonth.expense) * 100)
    : 0
  const biggestExpense = transactions.filter((t) => t.type === 'expense').sort((a, b) => b.amount - a.amount)[0]

  useEffect(() => {
    if (!barRef.current) return
    if (barChart.current) barChart.current.destroy()

    const isDark  = theme === 'dark'
    const gridCol = isDark ? '#ffffff0a' : '#00000008'
    const tickCol = isDark ? '#606060'   : '#aaa'

    barChart.current = new Chart(barRef.current, {
      type: 'bar',
      data: {
        labels: monthStats.map((m) => m.month),
        datasets: [
          { label: 'Income',   data: monthStats.map((m) => m.income),  backgroundColor: '#22d07a60', borderColor: '#22d07a', borderWidth: 1.5, borderRadius: 4 },
          { label: 'Expenses', data: monthStats.map((m) => m.expense), backgroundColor: '#ff575760', borderColor: '#ff5757', borderWidth: 1.5, borderRadius: 4 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: gridCol }, ticks: { color: tickCol, font: { size: 11 } } },
          y: { grid: { color: gridCol }, ticks: { color: tickCol, font: { size: 11 }, callback: (v) => '$' + v.toLocaleString() } },
        },
      },
    })
    return () => barChart.current?.destroy()
  }, [monthStats, theme])

  const insightCards = [
    { icon:'🏆', label:'Top Spending Category', value: topCat[0], valueColor:'var(--amber)', desc:`${fmt(topCat[1])} total spent in this category across all time` },
    { icon:'💰', label:'Savings Rate', value:`${savingsRate}%`, valueColor: savingsRate >= 0 ? 'var(--green)' : 'var(--red)', desc: savingsRate >= 20 ? 'Great job! Saving more than 20% of income.' : 'Aim for 20%+ savings rate for financial health.' },
    { icon:'📊', label:'Expense Trend', value:`${expChange > 0 ? '+' : ''}${expChange}%`, valueColor: expChange > 0 ? 'var(--red)' : 'var(--green)', desc:`Month-over-month change. Last month: ${fmt(lastMonth.expense)}` },
    { icon:'📅', label:'Avg Monthly Expense', value: fmt(Math.round(totalExpense / Math.max(1, monthStats.length))), valueColor:'var(--text)', desc:`Based on ${monthStats.length} months of tracked expenses` },
    { icon:'💸', label:'Total Transactions', value: transactions.length, valueColor:'var(--text)', desc:`${transactions.filter((t)=>t.type==='income').length} income · ${transactions.filter((t)=>t.type==='expense').length} expenses` },
    { icon:'🎯', label:'Biggest Single Expense', value: biggestExpense ? biggestExpense.desc : 'N/A', valueColor:'var(--red)', valueFontSize:'15px', desc: biggestExpense ? `${fmt(biggestExpense.amount)} — largest single transaction` : 'No expenses recorded' },
  ]

  const barMax = Math.max(...monthStats.map((m) => Math.max(m.income, m.expense)), 1)

  return (
    <div className="fade-in">
      <div className="section-title">Key Insights</div>
      <div className="insights-grid">
        {insightCards.map((card) => (
          <div key={card.label} className="insight-card">
            <div className="insight-icon">{card.icon}</div>
            <div className="insight-label">{card.label}</div>
            <div className="insight-value" style={{ color: card.valueColor, fontSize: card.valueFontSize || '18px' }}>{card.value}</div>
            <div className="insight-desc">{card.desc}</div>
          </div>
        ))}
      </div>

      <div className="chart-card">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
          <div className="chart-title" style={{ marginBottom:0 }}>Monthly Income vs Expenses</div>
          <div className="chart-legend">
            {[{c:'#22d07a',l:'Income'},{c:'#ff5757',l:'Expenses'}].map(({c,l}) => (
              <span key={l} className="legend-item"><span className="legend-dot" style={{background:c}}/>{l}</span>
            ))}
          </div>
        </div>
        <div className="chart-wrap" style={{ height:'260px' }}><canvas ref={barRef} /></div>

        <div style={{ marginTop:'20px' }}>
          <div className="section-title" style={{ marginBottom:'12px' }}>Monthly Breakdown</div>
          <div className="comparison-bars">
            {monthStats.map((m) => (
              <div key={m.month} className="comp-row">
                <div className="comp-label">
                  <span>{m.month}</span>
                  <span style={{ display:'flex', gap:'12px' }}>
                    <span style={{ color:'var(--green)' }}>${m.income.toLocaleString()}</span>
                    <span style={{ color:'var(--red)' }}>${m.expense.toLocaleString()}</span>
                  </span>
                </div>
                <div className="bar-track">
                  <div className="bar-income"  style={{ width:`${(m.income  / barMax) * 50}%` }}/>
                  <div className="bar-expense" style={{ width:`${(m.expense / barMax) * 50}%` }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
