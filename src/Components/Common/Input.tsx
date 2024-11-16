import * as React from "react";
import {TextField} from "@mui/material";

interface InputProps {
    index?: number;
    type : string;
    placeholder ?: string;
    name ?: string;
    value ?: string;
    required ?: boolean;
    onChange ?: (event: string) => void;
    title ?: string;
    label ?: string;
    id?: string;
    helperText ?: string;
    defaultValue ?: string;
}

const InputField : React.FC<InputProps> = ({defaultValue, type, name = "",id, helperText, placeholder, label, value, required, onChange, title}) => {
    return <>
        <TextField
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            required={required}
            title={title}
            id={id}
            label={label}
            helperText={helperText}
            variant="outlined"
            defaultValue={defaultValue}
            onChange={(e) => {
                if(onChange){
                    onChange(e.target.value);
                }
            }}
        />
    </>
}

export default InputField