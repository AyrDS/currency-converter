
interface SelectCurrencyProps {
    labelText: string;
    rates: [string, {}][];
    valueSelect: string;
    onChangeCurrency: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectCurrency = ({ labelText, rates, valueSelect, onChangeCurrency }: SelectCurrencyProps) => {
    return (
        <div className="change-form_labels" >
            <label htmlFor={labelText} > {labelText} </label>
            <select id={labelText} value={valueSelect} onChange={onChangeCurrency}  >
                {
                    rates.map((rate) => (
                        <option key={rate[0]} ></option>
                    ))
                }
            </select>
        </div>
    )
}

export default SelectCurrency;