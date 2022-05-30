import { useEffect, useState } from "react";
import SelectCurrency from "./components/SelectCurrency";


type CurrentCurrencyType = {
  name: string;
  symbol: string;
}

const promises: string[] = [`https://api.vatcomply.com/rates?base=USD`, 'https://api.vatcomply.com/currencies'];

const App = () => {

  const [ratesOptions, setRatesOptions] = useState<string[]>([])

  useEffect(() => {
    
  }, []);


  return (
    <main className="app-container" >
      <div className="coverPage">
        <p>Convert </p>
      </div>
      <section className="change-container" >

        <form className="change-form" >
          <div className="change-form_labels" >
            <label htmlFor="amount" >Amount</label>
            <input type="number" id="amount" min={0} />
          </div>

          {/* <SelectCurrency
            labelText="From"
          /> */}

          {/* <SelectCurrency
            labelText="To"
          /> */}

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
