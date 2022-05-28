
const Change = () => {
    return (
        <section className="change-container" >

            <form className="change-form" >
                <div className="change-form_labels" >
                    <label htmlFor="amount" >Amount</label>
                    <input type="number" id="amount" />
                </div>
                <div className="change-form_labels" >
                    <label htmlFor="from" >From</label>
                    <select id="from" >
                        <option>EUR</option>
                    </select>
                </div>
                <div className="change-form_labels" >
                    <label htmlFor="to" >To</label>
                    <select id="to" >
                        <option>EUR</option>
                    </select>
                </div>
            </form>

            <div>
                <p>1.00 Euro =</p>
                <h2>1.3550 Canadian Dollar</h2>

                <p>1 CA$ = 01487 EUR</p>
                <p>1 CA$ = 01487 EUR</p>
            </div>

        </section>
    )
}

export default Change;