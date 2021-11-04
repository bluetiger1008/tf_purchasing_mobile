import Fraction from 'fraction.js'

const formatCurrency = (num, decimals) =>
  parseInt(Fraction(num)).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

export { formatCurrency }
