// convert 2023-11-01T00:00:00.000Z to get just the day
const date = new Date("2023-11-01T00:00:00.000Z")
const day = date.getDate()
console.log(day)
// add 1 to get the month
const month = date.getMonth() + 1
const year = date.getFullYear()
console.log(year)
