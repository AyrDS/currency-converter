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
  const [currentFromCurrency, setCurrentFromCurrency] = useState() //Moneda actual de origen seleccionada
  const [amount, setAmount] = useState<number>(1) //Cantidad a convertir

  const [fromCurrency, setFromCurrency] = useState<string>('USD'); // Moneda "DE"
  const [toCurrency, setToCurrency] = useState<string>('EUR'); //Moneda "A"

  useEffect(() => {
    Promise.all([fetch(promises[0]), fetch(promises[1])])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(data => {
        setRatesOptions(Object.keys(data[0].rates));
        setAllCurrencies(data[1]);
      })
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value))
  }

  return (
    <main className="app-container" >
      <div className="coverPage">
        <p>Convert {amount.toFixed(2)} {allCurrencies?.[fromCurrency]}  </p>
      </div>
      <section className="change-container" >

        <form className="change-form" >
          <div className="change-form_labels" >
            <label htmlFor="amount" >Amount</label>
            <input type="number" id="amount" min={0} value={amount} onChange={handleAmountChange} />
          </div>

          <SelectCurrency
            labelText="From"
            rates={ratesOptions}
            valueSelect={fromCurrency}
            onChangeCurrency={() => { }}
          />

          <SelectCurrency
            labelText="To"
            rates={ratesOptions}
            valueSelect={toCurrency}
            onChangeCurrency={() => { }}
          />

        </form>



        <div className="change-info" >

          <div>
            <p className="change-info_current" >1 EURO =</p>
            <p className="change-info_exchange" > 1.07 USD </p>
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
