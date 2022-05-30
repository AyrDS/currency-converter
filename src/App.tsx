import { useEffect, useState } from "react";
import SelectCurrency from "./components/SelectCurrency";


type CurrentCurrencyType = {
  name: string;
  symbol: string;
}

const promises: string[] = [`https://api.vatcomply.com/rates?base=USD`, 'https://api.vatcomply.com/currencies'];

const App = () => {

  const [ratesOptions, setRatesOptions] = useState<string[]>([]) //Todas las opciones para los selects

  const [allCurrencies, setAllCurrencies] = useState() //Todas las monedas
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
        setRatesOptions(Object.keys(data[0].rates));
        setAllCurrencies(data[1]);
        setRates(data[0].rates);
        console.log(data[0]);
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
      console.log(toCurrency);
      console.log(fromCurrency);
      setTotalExchange(amount * (toCurrency / fromCurrency));
    }
  }, [rates, fromCurrencyInput, toCurrencyInput, amount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            onChangeCurrency={() => { }}
          />

          <SelectCurrency
            labelText="To"
            rates={ratesOptions}
            valueSelect={toCurrencyInput}
            onChangeCurrency={() => { }}
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
            <p>1 Euro = 1 CA</p>
            <p>1 CA$ = 01487 EUR</p>
          </div>
        </div>

      </section>
    </main>
  )
}

export default App;
