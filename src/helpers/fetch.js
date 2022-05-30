
export const fetchExchange = () => {
    return fetch(`https://api.vatcomply.com/rates?base=${baseCurrency}`)
}