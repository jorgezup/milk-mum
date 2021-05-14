import moment from "moment";

export function formatDate(date: Date) {
  // return new Date(date).toLocaleDateString('en-US', {
  //   year: 'numeric',
  //   month: '2-digit',
  //   day: '2-digit',
  // }).replace(/\//g, '-')

  const d = new Date(date)
  let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
  let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

  return moment(date).format('YYYY-MM-DD')
}
// export const formatDate = new Date().toLocaleDateString('ja', {
//   day: '2-digit',
//   year: 'numeric',
//   month: '2-digit',
// }).replace(/\//g, '-')