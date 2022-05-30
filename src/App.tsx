import { useEffect, useState } from "react";
import SelectCurrency from "./components/SelectCurrency";


type CurrentCurrencyType = {
  name: string;
  symbol: string;
}

const promises: string[] = [`https://api.vatcomply.com/rates?base=USD`, 'https://api.vatcomply.com/currencies'];

const App = () => {
  const [rates, setRates] = useState<string[]>([]); //Los nombres para los options
  const [currencies, setCurrencies] = useState<any>()
  const [fromCurrentCurrency, setFromCurrentCurrency] = useState<CurrentCurrencyType | undefined>();
  const [toCurrentCurrency, setToCurrentCurrency] = useState<CurrentCurrencyType | undefined>();
  const [exchange, setExchange] = useState<any>();
  const [fromCurrency, setFromCurrency] = useState<string>(''); //Valores de los inputs
  const [toCurrency, setToCurrency] = useState<string>(''); //Valores de los inputs
  const [amount, setAmount] = useState<number>(1);


  useEffect(() => {
    Promise.all([fetch(promises[0]), fetch(promises[1])])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(data => {
        setRates(Object.keys(data[0].rates)); //Los nombres para los options
        setFromCurrency(Object.keys(data[0].rates)[1]); //USD option default
        setToCurrency(Object.keys(data[0].rates)[0]); //EURO option default
        setCurrencies(data[1]); //Los nombres y simbolos de las monedas
        setExchange(data[0].rates)
      })
  }, []);


  useEffect(() => {
    if (currencies) {
      const fromCurrentCurrency = Object.getOwnPropertyDescriptor(currencies, fromCurrency)
      const toCurrentCurrency = Object.getOwnPropertyDescriptor(currencies, toCurrency)
      setFromCurrentCurrency(fromCurrentCurrency?.value);
      setToCurrentCurrency(toCurrentCurrency?.value);
    }
  }, [currencies, fromCurrency, toCurrency]);


  const handleChangeAmount = async ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(target.value) < 0) {
      return setAmount(1);
    }
    setAmount(Number(target.value));
  }

  const handleChangeFromCurrency = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    setFromCurrency(target.value);
    fetch(`https://api.vatcomply.com/rates?base=${target.value}`)
      .then(response => response.json())
      .then(data => {
        setExchange(data.rates);
      })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  const handleClick = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    fetch(`https://api.vatcomply.com/rates?base=${toCurrency}`)
      .then(response => response.json())
      .then(data => {
        setExchange(data.rates);
      })
  }

  return (
    <main className="app-container" >
      <div className="coverPage">
        <p>Convert {amount} {fromCurrentCurrency?.name} to {toCurrentCurrency?.name} - {fromCurrentCurrency?.symbol} to {toCurrentCurrency?.symbol}</p>
      </div>
      <section className="change-container" >

        <form className="change-form" onSubmit={handleSubmit} >
          <div className="change-form_labels" >
            <label htmlFor="amount" >Amount</label>
            <input type="number" id="amount" value={amount} onChange={handleChangeAmount} />
          </div>

          <SelectCurrency
            labelText="From"
            rates={rates}
            valueSelect={fromCurrency}
            onChangeCurrency={handleChangeFromCurrency}
          />

          <SelectCurrency
            labelText="To"
            rates={rates}
            valueSelect={toCurrency}
            onChangeCurrency={({ target }: React.ChangeEvent<HTMLSelectElement>) => setToCurrency(target.value)}
          />
          <button
            onClick={handleClick}
          > click </button>
        </form>



        <div className="change-info" >

          <div>
            <p className="change-info_current" >{amount.toFixed(2)} {fromCurrentCurrency?.name} =</p>
            <p className="change-info_exchange" > {(amount * exchange?.[toCurrency]).toFixed(2)} {toCurrentCurrency?.name} </p>
          </div>

          <div className="change-info_containerCurrency" >
            <p>1 {toCurrentCurrency?.symbol} = {(exchange?.[fromCurrency])?.toFixed(2)} {fromCurrentCurrency?.name}</p>
            <p>1 CA$ = 01487 EUR</p>
          </div>
        </div>

      </section>
    </main>
  )
}

export default App;
