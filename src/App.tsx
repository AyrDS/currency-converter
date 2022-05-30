import { useEffect, useState } from "react";
import SelectCurrency from "./components/SelectCurrency";


type CurrentCurrencyType = {
  name: string;
  symbol: string;
}

const promises: string[] = [`https://api.vatcomply.com/rates?base=USD`, 'https://api.vatcomply.com/currencies'];

const App = () => {

  const [ratesOptions, setRatesOptions] = useState<[string, {}][]>([]) //Todas las opciones para los selects

  const [allCurrencies, setAllCurrencies] = useState<any>() //Todas las monedas
  const [currentFromCurrency, setCurrentFromCurrency] = useState<CurrentCurrencyType>() //Moneda actual de origen seleccionada
  const [currentToCurrency, setCurrentToCurrency] = useState<CurrentCurrencyType>() //Moneda actual de destino seleccionada

  const [amount, setAmount] = useState<number>(1) //Cantidad a convertir

  const [totalExchange, setTotalExchange] = useState<number>(); //Cantidad convertida

  const [rates, setRates] = useState<any>() //Todas las tasas de cambio

  const [fromCurrencyInput, setFromCurrencyInput] = useState<string>('USD'); // Moneda "DE"
  const [toCurrencyInput, setToCurrencyInput] = useState<string>('EUR'); //Moneda "A"

  useEffect(() => {
    Promise.all([fetch(promises[0]), fetch(promises[1])])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(data => {
        setRatesOptions(Object.entries(data[1]));
        setAllCurrencies(data[1]);
        setRates(data[0].rates);
      })
  }, []);

  useEffect(() => {
    if (allCurrencies) {
      const currentFromCurrency = Object.getOwnPropertyDescriptor(allCurrencies, fromCurrencyInput);
      const currentToCurrency = Object.getOwnPropertyDescriptor(allCurrencies, toCurrencyInput);
      setCurrentFromCurrency(currentFromCurrency?.value);
      setCurrentToCurrency(currentToCurrency?.value);
    }
  }, [allCurrencies, fromCurrencyInput, toCurrencyInput]);


  useEffect(() => {
    if (rates) {
      const fromCurrency = Number(rates[fromCurrencyInput].toFixed(2));
      const toCurrency = Number(rates[toCurrencyInput].toFixed(2));
      setTotalExchange(amount * (toCurrency / fromCurrency));
    }
  }, [rates, fromCurrencyInput, toCurrencyInput, amount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) < 0) {
      return setAmount(prev => prev);
    }
    setAmount(Number(e.target.value))
  }

  const handleSwipe = () => {
    setFromCurrencyInput(toCurrencyInput);
    setToCurrencyInput(fromCurrencyInput);
  }


  return (
    <main className="app-container" >
      <div className="coverPage">
        <p>Convert {amount.toFixed(2)} {currentFromCurrency?.name} to {currentToCurrency?.name} - {currentFromCurrency?.symbol} to {currentToCurrency?.symbol} </p>
      </div>
      <section className="change-container" >

        <form className="change-form" onSubmit={e => e.preventDefault()} >
          <div className="change-form_labels" >
            <label htmlFor="amount" >Amount</label>
            <input type="number" id="amount" min={0} value={amount} onChange={handleAmountChange} />
          </div>

          <SelectCurrency
            labelText="From"
            rates={ratesOptions}
            valueSelect={fromCurrencyInput}
            onChangeCurrency={(e) => { setFromCurrencyInput(e.target.value) }}
          />

          <SelectCurrency
            labelText="To"
            rates={ratesOptions}
            valueSelect={toCurrencyInput}
            onChangeCurrency={(e) => { setToCurrencyInput(e.target.value) }}
          />

          <button
            onClick={handleSwipe}
          >
            click
          </button>
        </form>

        <div className="change-info" >
          <div>
            <p className="change-info_current" >{amount.toFixed(2)} {currentFromCurrency?.name} =</p>
            <p className="change-info_exchange" > {totalExchange?.toFixed(2)} {currentToCurrency?.name} </p>
          </div>

          <div className="change-info_containerCurrency" >
            <p>1 {currentToCurrency?.name} =  {(rates?.[fromCurrencyInput] / rates?.[toCurrencyInput]).toFixed(2)} {currentFromCurrency?.symbol} </p>
            <p>1 {currentFromCurrency?.name} = {(rates?.[toCurrencyInput] / rates?.[fromCurrencyInput]).toFixed(2)} {currentToCurrency?.symbol}</p>
          </div>
        </div>

      </section>
    </main>
  )
}

export default App;

//Opcioon 2
/*
<p>1 {currentToCurrency?.name} =  {(1 / (rates?.[toCurrencyInput])?.toFixed(2)).toFixed(2)} {currentFromCurrency?.symbol} </p>
            <p>1 {currentFromCurrency?.name} = {(1 / (rates?.[toCurrencyInput])?.toFixed(2)).toFixed(2)} {currentToCurrency?.symbol}</p>
*/

//Opcion 1
/* 
<p>1 {currentToCurrency?.name} = {(1 / rates?.[toCurrencyInput]).toFixed(2)} {currentFromCurrency?.symbol} </p>
            <p>1 {currentFromCurrency?.name} = {(rates?.[toCurrencyInput])?.toFixed(2)} {currentToCurrency?.symbol}</p>

            {
            allCurrencies &&
            allCurrencies.map((currency: any) => {
              return (
                <div>
                  <p>{currency[0]} - {currency[1].name} </p>
                </div>
              )
            })

          }
 */