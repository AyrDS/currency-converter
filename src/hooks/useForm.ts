import { useState } from "react"


export function useForm<T>(initialState: T) {

    const [form, setForm] = useState(initialState)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }

    return { form, handleChange, setForm };
}