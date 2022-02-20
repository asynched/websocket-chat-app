export const formatDate = (date) => {
  const parsed = new Date(date)

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
  }).format(parsed)
}
