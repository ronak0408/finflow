import React, { useEffect, useRef } from 'react'
import {
  Chart,
  LineElement, PointElement, LineController,
  DoughnutController, ArcElement,
  CategoryScale, LinearScale, Filler, Tooltip, Legend,
} from 'chart.js'
import { useApp } from '../context/AppContext'
import { fmt } from '../utils/format'

Chart.register(
  LineElement, PointElement, LineController,
  DoughnutController, ArcElement,
  CategoryScale, LinearScale, Filler, Tooltip, Legend
)

export default function Dashboard() {
  const { balance, totalIncome, totalExpense, monthStats, catSpend, theme } = useApp()

  const lineRef    = useRef()
  const doughRef   = useRef()
  const lineChart  = useRef()
  const doughChart = useRef()

  useEffect(() => {
    if (!lineRef.current) return
    if (lineChart.current) lineChart.current.destroy()

    const isDark  = theme === 'dark'
    const gridCol = isDark ? '#ffffff0a' : '#00000008'
    const tickCol = isDark ? '#606060'   : '#aaa'
    const balances = monthStats.map((_, i) =>
      monthStats.slice(0, i + 1).reduce((s, m) => s + m.income - m.expense, 0)
    )

    lineChart.current = new Chart(lineRef.current, {
      type: 'line',
      data: {
        labels: monthStats.map((m) => m.month),
        datasets: [
          { label: 'Balance', data: balances, borderColor: '#22d07a', backgroundColor: '#22d07a18', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#22d07a' },
          { label: 'Income',  data: monthStats.map((m) => m.income),  borderColor: '#4da6ff', backgroundColor: 'transparent', tension: 0.4, pointRadius: 3, borderDash: [5, 5] },
          { label: 'Expenses',data: monthStats.map((m) => m.expense), borderColor: '#ff5757', backgroundColor: 'transparent', tension: 0.4, pointRadius: 3, borderDash: [5, 5] },
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
    return () => lineChart.current?.destroy()
  }, [monthStats, theme])

  useEffect(() => {
    if (!doughRef.current) return
    if (doughChart.current) doughChart.current.destroy()
    const top5 = catSpend.slice(0, 5)
    doughChart.current = new Chart(doughRef.current, {
      type: 'doughnut',
      data: {
        labels: top5.map((c) => c[0]),
        datasets: [{ data: top5.map((c) => c[1]), backgroundColor: ['#f5a623','#4da6ff','#a78bfa','#ff79c6','#22d07a'], borderWidth: 0, hoverOffset: 6 }],
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { display: false } } },
    })
    return () => doughChart.current?.destroy()
  }, [catSpend, theme])

  const sparkData = monthStats.map((m) => m.income - m.expense)
  const sparkMax  = Math.max(...sparkData.map(Math.abs), 1)
  const DOT_COLORS = ['#f5a623', '#4da6ff', '#a78bfa', '#ff79c6']

  return (
    <div className="fade-in">
      <div className="section-title">Overview</div>
      <div className="cards-grid">
        <div className="card accent">
          <div className="card-label">Net Balance</div>
          <div className={`card-value ${balance >= 0 ? 'green' : 'red'}`}>{fmt(Math.abs(balance))}</div>
          <div className="sparkline">
            {sparkData.map((v, i) => (
              <div key={i} className="spark-bar" style={{ height: `${Math.max(4, (Math.abs(v) / sparkMax) * 32)}px`, background: v >= 0 ? '#22d07a60' : '#ff575760' }} />
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-label">Total Income</div>
          <div className="card-value green">{fmt(totalIncome)}</div>
          <div className="card-sub up">▲ 6 months tracked</div>
        </div>
        <div className="card">
          <div className="card-label">Total Expenses</div>
          <div className="card-value red">{fmt(totalExpense)}</div>
          <div className="card-sub down">▼ Spending tracked</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
            <div className="chart-title" style={{ marginBottom:0 }}>Balance Trend</div>
            <div className="chart-legend">
              {[{c:'#22d07a',l:'Balance'},{c:'#4da6ff',l:'Income'},{c:'#ff5757',l:'Expenses'}].map(({c,l}) => (
                <span key={l} className="legend-item"><span className="legend-dot" style={{background:c}}/>{l}</span>
              ))}
            </div>
          </div>
          <div className="chart-wrap"><canvas ref={lineRef} /></div>
        </div>

        <div className="chart-card">
          <div className="chart-title">Spending by Category</div>
          <div className="chart-wrap" style={{ height:'160px' }}><canvas ref={doughRef} /></div>
          <div style={{ display:'flex', flexDirection:'column', gap:'6px', marginTop:'12px' }}>
            {catSpend.slice(0,4).map(([cat,amt],i) => (
              <div key={cat} style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'12px' }}>
                <span style={{ width:'8px', height:'8px', borderRadius:'2px', background:DOT_COLORS[i]||'#606060', display:'inline-block', flexShrink:0 }}/>
                <span style={{ flex:1, color:'var(--text2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{cat}</span>
                <span style={{ color:'var(--text)', fontFamily:'var(--mono)', fontWeight:500 }}>${amt.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
