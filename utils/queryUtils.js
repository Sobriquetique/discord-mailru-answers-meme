export const getQueryString = obj => {
  if (!obj) return ''
  const string = encodeURI(new URLSearchParams(obj).toString())
  return `?${string}`
}