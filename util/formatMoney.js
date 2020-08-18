const formatMoney = ({ amount, currencyCode }) => {
  const isGBP = currencyCode === 'GBP'
  let currencyString = isGBP ? '£' : ''
  
  currencyString += `${parseFloat(amount).toFixed(2)}`
  if(!isGBP) currencyString += currencyCode

  return currencyString.replace('.00', '')
}
  
export default formatMoney
