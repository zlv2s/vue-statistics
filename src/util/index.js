import moment from 'moment'
export const dateFormat = (dateVal, pattern = 'YYYY-MM-DD') => moment(dateVal).format(pattern)