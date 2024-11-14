import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {ReactNode} from "react";

interface SelectListProps {
    values : {text : string, value : string}[];
    onChange : (event: SelectChangeEvent<string>, child: ReactNode) => void;
    label : string;
    value ?: string;
}

export default function SelectList({values, onChange, label, value} : SelectListProps) {

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value}
                    label={label}
                    onChange={onChange}
                 variant={"outlined"}>
                    {values.map((item) => (
                        <MenuItem value={item.value} key={item.value}>{item.text}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}


