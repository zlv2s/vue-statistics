import { dateFormat } from './index'

export const ArrNoDuplicate = (arr) => [...new Set(arr)]

export const groupData = (arr, pattern) => {
  return ArrNoDuplicate(arr.map(item => dateFormat(item.day, pattern)))
    .map(date => {
      return {
        date: date,
        downloads: arr.filter(item => dateFormat(item.day, pattern) === date)
          .map(item => item.downloads)
          .reduce((ttl, download) => ttl + download, 0)
      }
    }).map(el => el.downloads)
}