import { useState, useMemo } from 'react'

const PER_PAGE = 10

export function useTransactionFilter(transactions) {
  const [search,     setSearch]     = useState('')
  const [catFilter,  setCatFilter]  = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('All')
  const [sortBy,     setSortBy]     = useState('date')
  const [sortDir,    setSortDir]    = useState('desc')
  const [page,       setPage]       = useState(1)

  const handleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortBy(col); setSortDir('desc') }
    setPage(1)
  }

  const filtered = useMemo(() => {
    let r = [...transactions]

    if (search) {
      const q = search.toLowerCase()
      r = r.filter(
        (t) =>
          t.desc.toLowerCase().includes(q) ||
          t.cat.toLowerCase().includes(q)
      )
    }

    if (catFilter  !== 'All') r = r.filter((t) => t.cat  === catFilter)
    if (typeFilter !== 'All') r = r.filter((t) => t.type === typeFilter)

    if (dateFilter !== 'All') {
      const now   = Date.now()
      const days  = { '7d': 7, '30d': 30, '90d': 90 }[dateFilter]
      const limit = days * 86_400_000
      r = r.filter((t) => now - new Date(t.date).getTime() < limit)
    }

    r.sort((a, b) => {
      const v =
        sortBy === 'amount'
          ? a.amount - b.amount
          : a.date.localeCompare(b.date)
      return sortDir === 'asc' ? v : -v
    })

    return r
  }, [transactions, search, catFilter, typeFilter, dateFilter, sortBy, sortDir])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return {
    // filter state
    search,     setSearch,
    catFilter,  setCatFilter,
    typeFilter, setTypeFilter,
    dateFilter, setDateFilter,
    // sort state
    sortBy, sortDir, handleSort,
    // pagination
    page, setPage, totalPages, PER_PAGE,
    // results
    filtered, paginated,
  }
}
