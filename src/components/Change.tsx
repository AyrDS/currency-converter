import { useEffect, useState } from "react";
import SelectCurrency from "./SelectCurrency";

const url = 'https://api.vatcomply.com/rates';

const Change = () => {
    const [rates, setRates] = useState<string[]>([]);
    const [fromCurrency, setFromCurrency] = useState<string>('');
    const [toCurrency, setToCurrency] = useState<string>('');
    const [amount, setAmount] = useState<number>(1);

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setRates(Object.keys(data.rates));
                setFromCurrency(Object.keys(data.rates)[1]);
                setToCurrency(Object.keys(data.rates)[0]);
            });

    }, []);

    const handleAmountChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(target.value));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }


    return (
        <section className="change-container" >

            <form className="change-form" onSubmit={handleSubmit} >
                <div className="change-form_labels" >
                    <label htmlFor="amount" >Amount</label>
                    <input type="number" id="amount" value={amount} onChange={handleAmountChange} min='1' />
                </div>

                {/* <SelectCurrency
                    labelText="From"
                    rates={rates}
                    valueSelect={fromCurrency}
                    onChangeCurrency={({ target }: React.ChangeEvent<HTMLSelectElement>) => setFromCurrency(target.value)}
                /> */}

                {/* <SelectCurrency
                    labelText="To"
                    rates={rates}
                    valueSelect={toCurrency}
                    onChangeCurrency={({ target }: React.ChangeEvent<HTMLSelectElement>) => setToCurrency(target.value)}
                /> */}

            </form>

            <div className="change-info" >

                <div>
                    <p className="change-info_current" >1.00 Euro =</p>
                    <p className="change-info_exchange" >1.3550 Canadian Dollar</p>
                </div>

                <div className="change-info_containerCurrency" >
                    <p>1 CA$ = 01487 EUR</p>
                    <p>1 CA$ = 01487 EUR</p>
                </div>
            </div>

        </section>
    )
}

export default Change;