const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatDate = (date) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const day = date.getDate()
  const monthIndex = date.getMonth()
  const year = date.getFullYear()

  return `${day} ${monthNames[monthIndex]} ${year}`
}

const formatAMPM = (date) => {
  let hours = date.getHours()
  let minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'pm' : 'am'
  hours %= 12
  hours = hours || 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? `0${minutes}` : minutes
  const strTime = `${hours}:${minutes} ${ampm}`
  return strTime
}

const useQuery = (location) => {
  return new URLSearchParams(location.search)
}

const generateQuotesHTMLContent = (existingContent = null, quoteMessages) => {
  let htmlContent = ''

  if (existingContent !== null) {
    htmlContent = `${existingContent}`
  }
  htmlContent += '<p><br/></p><p>--- original message ---</p>'
  for (let i = 0; i < quoteMessages.length; i += 1) {
    const messageObj = quoteMessages[i]
    let contentPrefix = ''
    for (let j = 0; j <= i; j += 1) {
      contentPrefix += `&gt;`
    }
    htmlContent += `<p>${contentPrefix} ${messageObj.date_added.formatted_date} ${messageObj.author.first_name} ${messageObj.author.last_name} &lt;${messageObj.author.email}&gt; wrote:</p>`
    htmlContent += `<p>${contentPrefix} ${messageObj.html_body}</p>`

    if (htmlContent.length >= 65500) {
      break
    }
  }

  return htmlContent
}

const formatFloat = (num) => {
  return num.toFixed(Math.max(2, (num.toString().split('.')[1] || []).length))
}

export {
  numberWithCommas,
  formatDate,
  formatAMPM,
  useQuery,
  generateQuotesHTMLContent,
  formatFloat,
}
