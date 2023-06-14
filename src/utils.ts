// Things that should part of the standard library but aren't

export const formatNumber = (num: number) =>
  new Intl.NumberFormat(undefined, { maximumSignificantDigits: 3 }).format(num)

export const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce((groups, item) => {
    ;(groups[key(item)] ||= []).push(item)
    return groups
  }, {} as Record<K, T[]>)

export const titleize = (camelCase: string) =>
  camelCase
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim()
