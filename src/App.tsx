import { useEffect, useState } from "react";
import SelectCurrency from './components/SelectCurrency';
import Loading from './components/Loading';
import switchIcon from './assets/button.png'
import alertIcon from './assets/alertIcon.png';
import { useForm } from "./hooks/useForm";

type CurrentCurrencyType = {
  name: string;
  symbol: string;
}

interface FormData {
  amount: number;
  fromCurrencyInput: string;
  toCurrencyInput: string;
}

const promises: string[] = [`https://api.vatcomply.com/rates?base=USD`, 'https://api.vatcomply.com/currencies'];

const App = () => {

  const { form, handleChange, setForm } = useForm<FormData>({
    amount: 1.00,
    fromCurrencyInput: 'USD',
    toCurrencyInput: 'EUR'
  });

  const { amount, fromCurrencyInput, toCurrencyInput } = form

  const [ratesOptions, setRatesOptions] = useState<[string, []][]>([])

  const [allCurrencies, setAllCurrencies] = useState<{}>()
  const [currentFromCurrency, setCurrentFromCurrency] = useState<CurrentCurrencyType>()
  const [currentToCurrency, setCurrentToCurrency] = useState<CurrentCurrencyType>()

  const [totalExchange, setTotalExchange] = useState<number>();

  const [rates, setRates] = useState<{ [key: string]: number }>({})

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
      const fromCurrency = Number(rates[fromCurrencyInput]?.toFixed(2));
      const toCurrency = Number(rates[toCurrencyInput]?.toFixed(2));
      setTotalExchange(amount * (toCurrency / fromCurrency));
    }
  }, [rates, fromCurrencyInput, toCurrencyInput, amount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) < 0) {
      return setForm(prev => ({ ...prev, amount: prev.amount }))
    }
    handleChange(e);
  }

  const handleSwitch = () => {
    setForm({
      ...form,
      fromCurrencyInput: toCurrencyInput,
      toCurrencyInput: fromCurrencyInput
    })
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
            <input name="amount" type="text" id="amount" min={0} pattern="\d*" maxLength={6} value={amount} onChange={handleAmountChange} />
          </div>

          <div className="container-switch">
            <SelectCurrency
              name="fromCurrencyInput"
              labelText="From"
              rates={ratesOptions}
              valueSelect={fromCurrencyInput}
              onChangeCurrency={handleChange}
            />
            <img src={switchIcon} alt="switch" className="switch-btn" onClick={handleSwitch} />
          </div>

          <SelectCurrency
            name="toCurrencyInput"
            labelText="To"
            rates={ratesOptions}
            valueSelect={toCurrencyInput}
            onChangeCurrency={handleChange}
          />
        </form>

        <div className="change-info" >
          <div>
            <p className="change-info_current" >{Number(amount).toFixed(2)} {currentFromCurrency?.name} =</p>
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