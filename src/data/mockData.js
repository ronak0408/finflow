export const CATEGORIES = [
  'Food',
  'Transport',
  'Housing',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Income',
  'Investment',
]

export const CATEGORY_COLORS = {
  Food:          '#f5a623',
  Transport:     '#4da6ff',
  Housing:       '#a78bfa',
  Entertainment: '#ff79c6',
  Healthcare:    '#22d07a',
  Shopping:      '#ff5757',
  Income:        '#22d07a',
  Investment:    '#50fa7b',
}

const INCOME_TEMPLATES = [
  { desc: 'Salary',           cat: 'Income',     amt: [4500, 5500] },
  { desc: 'Freelance',        cat: 'Income',     amt: [500,  2000] },
  { desc: 'Investment Return',cat: 'Investment', amt: [200,  800]  },
]

const EXPENSE_TEMPLATES = [
  { desc: 'Rent',        cat: 'Housing',       amt: [1200, 1500] },
  { desc: 'Groceries',   cat: 'Food',          amt: [80,   200]  },
  { desc: 'Uber',        cat: 'Transport',     amt: [20,   80]   },
  { desc: 'Netflix',     cat: 'Entertainment', amt: [15,   20]   },
  { desc: 'Restaurant',  cat: 'Food',          amt: [30,   120]  },
  { desc: 'Doctor',      cat: 'Healthcare',    amt: [50,   200]  },
  { desc: 'Amazon',      cat: 'Shopping',      amt: [30,   300]  },
  { desc: 'Electricity', cat: 'Housing',       amt: [80,   150]  },
  { desc: 'Coffee',      cat: 'Food',          amt: [5,    20]   },
  { desc: 'Gym',         cat: 'Entertainment', amt: [30,   60]   },
  { desc: 'Flight',      cat: 'Transport',     amt: [150,  600]  },
  { desc: 'Medicine',    cat: 'Healthcare',    amt: [20,   80]   },
]

function rand(min, max) {
  return Math.round(min + Math.random() * (max - min))
}

function getMonthLabel(date) {
  return date.toLocaleString('default', { month: 'short', year: 'numeric' })
}

export function generateTransactions(months = 6) {
  const list = []
  let id = 1

  for (let m = months - 1; m >= 0; m--) {
    const base = new Date()
    base.setMonth(base.getMonth() - m)
    const monthLabel = getMonthLabel(base)

    // Income entries
    INCOME_TEMPLATES.forEach((tpl) => {
      if (Math.random() > 0.3) {
        const day = rand(1, 28)
        const d = new Date(base.getFullYear(), base.getMonth(), day)
        list.push({
          id: id++,
          desc: tpl.desc,
          cat: tpl.cat,
          type: 'income',
          amount: rand(tpl.amt[0], tpl.amt[1]),
          date: d.toISOString().split('T')[0],
          month: monthLabel,
        })
      }
    })

    // Expense entries
    const count = rand(8, 15)
    for (let e = 0; e < count; e++) {
      const tpl = EXPENSE_TEMPLATES[Math.floor(Math.random() * EXPENSE_TEMPLATES.length)]
      const day = rand(1, 28)
      const d = new Date(base.getFullYear(), base.getMonth(), day)
      list.push({
        id: id++,
        desc: tpl.desc,
        cat: tpl.cat,
        type: 'expense',
        amount: rand(tpl.amt[0], tpl.amt[1]),
        date: d.toISOString().split('T')[0],
        month: monthLabel,
      })
    }
  }

  return list.sort((a, b) => b.date.localeCompare(a.date))
}
