/**
 * Format a number as USD currency string.
 * @param {number} n
 * @returns {string}  e.g. "$1,234"
 */
export function fmt(n) {
  return '$' + Math.round(n).toLocaleString()
}

/**
 * Return a sort-direction arrow character.
 * @param {string} col       - column key
 * @param {string} sortBy    - currently sorted column
 * @param {string} sortDir   - 'asc' | 'desc'
 * @returns {string}
 */
export function sortIcon(col, sortBy, sortDir) {
  if (sortBy !== col) return ' ↕'
  return sortDir === 'asc' ? ' ↑' : ' ↓'
}

/**
 * Export an array of objects as a CSV file download.
 * @param {object[]} rows
 * @param {string}   filename
 */
export function exportCSV(rows, filename = 'transactions.csv') {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const lines = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? '')).join(',')),
  ]
  triggerDownload(lines.join('\n'), 'text/csv', filename)
}

/**
 * Export data as a JSON file download.
 * @param {any}    data
 * @param {string} filename
 */
export function exportJSON(data, filename = 'transactions.json') {
  triggerDownload(JSON.stringify(data, null, 2), 'application/json', filename)
}

function triggerDownload(content, mime, filename) {
  const blob = new Blob([content], { type: mime })
  const a    = document.createElement('a')
  a.href     = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}
