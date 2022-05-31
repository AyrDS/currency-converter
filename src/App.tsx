import { useEffect, useState } from "react";
import SelectCurrency from './components/SelectCurrency';
import Loading from './components/Loading';
import switchIcon from './assets/button.png'
import alertIcon from './assets/alertIcon.png';

type CurrentCurrencyType = {
  name: string;
  symbol: string;
}

const promises: string[] = [`https://api.vatcomply.com/rates?base=USD`, 'https://api.vatcomply.com/currencies'];

const App = () => {

  const [ratesOptions, setRatesOptions] = useState<[string, []][]>([])

  const [allCurrencies, setAllCurrencies] = useState<{}>()
  const [currentFromCurrency, setCurrentFromCurrency] = useState<CurrentCurrencyType>()
  const [currentToCurrency, setCurrentToCurrency] = useState<CurrentCurrencyType>()

  const [amount, setAmount] = useState<number>(1)

  const [totalExchange, setTotalExchange] = useState<number>();

  const [rates, setRates] = useState<any>()

  const [fromCurrencyInput, setFromCurrencyInput] = useState<string>('USD');
  const [toCurrencyInput, setToCurrencyInput] = useState<string>('EUR');

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

  const handleSwitch = () => {
    setFromCurrencyInput(toCurrencyInput);
    setToCurrencyInput(fromCurrencyInput);
  }

  if (!rates) {
    return <Loading />
  }

  return (
    <main className="app-container" >
      <div className="coverPage">
        <p>Convert {amount} {currentFromCurrency?.name} to {currentToCurrency?.name} - {currentFromCurrency?.symbol} to {currentToCurrency?.symbol} </p>
      </div>
      <section className="change-container" >

        <form className="change-form" onSubmit={e => e.preventDefault()} >
          <div className="change-form_labels" >
            <label htmlFor="amount" >Amount</label>
            <input type="number" id="amount" min={0} value={amount} onChange={handleAmountChange} />
          </div>

          <div className="container-switch">
            <SelectCurrency
              labelText="From"
              rates={ratesOptions}
              valueSelect={fromCurrencyInput}
              onChangeCurrency={(e) => { setFromCurrencyInput(e.target.value) }}
            />
            <img src={switchIcon} alt="switch" className="switch-btn" onClick={handleSwitch} />
          </div>

          <SelectCurrency
            labelText="To"
            rates={ratesOptions}
            valueSelect={toCurrencyInput}
            onChangeCurrency={(e) => { setToCurrencyInput(e.target.value) }}
          />
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

          <div className="change-alert" >
            <img src={alertIcon} alt='Alert Icon' className="alert-icon" />
            <p>We use the market rate. This is for informational purposes only.</p>
          </div>
        </div>

      </section>
    </main>
  )
}

export default App;