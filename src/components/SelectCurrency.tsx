
interface SelectCurrencyProps {
    name: string;
    labelText: string;
    rates: [string, []][];
    valueSelect: string;
    onChangeCurrency: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectCurrency = ({ labelText, rates, valueSelect, onChangeCurrency, name }: SelectCurrencyProps) => {
    return (
        <div className="change-form_labels" >
            <label htmlFor={labelText} > {labelText} </label>
            <select id={labelText} value={valueSelect} onChange={onChangeCurrency} name={name}  >
                {
                    rates.map((rate: any) => (
                        <option key={rate[0]} value={rate[0]}> {rate[0]} - {rate[1].name} </option>
                    ))
                }
            </select>
        </div>
    )
}

export default SelectCurrency;