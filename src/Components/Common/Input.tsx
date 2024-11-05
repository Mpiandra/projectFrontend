import * as React from "react";

interface InputProps {
    type : string;
    placeholder ?: string;
    id ?: string;
    name : string;
    value : string;
    required ?: boolean;
    onChange : (event: string) => void;
    pattern ?: string;
    title ?: string;
}

const Input : React.FC<InputProps> = ({type,name, id, placeholder, value, required, onChange, pattern, title}) => {
    return <>
        <input
            name={name}
            type={type}
            id={id}
            placeholder={placeholder}
            value={value}
            required={required}
            pattern={pattern}
            title={title}
            onChange={(e) => {
                onChange(e.target.value);
            }}
        />
    </>
}

export default Input