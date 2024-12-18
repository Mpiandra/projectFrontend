import {AppBar, FormControl, InputAdornment, TextField, Toolbar} from "@mui/material";
import {Search} from "@mui/icons-material";
import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import { colors } from "../../Colors";

export default function Appbar (){

    const location = useLocation();
    const navigate = useNavigate()
    const searchParams = new URLSearchParams(location.search);
    const pageName = location.pathname.split("/")[1]
    const handleKey = (e) => {
        e.target.value ? searchParams.set('search', e.target.value) : searchParams.delete("search");
        navigate(`?${searchParams.toString()}`);
    };


    return(
        <React.Fragment>
            <AppBar
                    sx={{
                        background: colors.background,
                        justifyContent: "center",
                    }}
            >
                <Toolbar sx={{ justifyContent: "end" }}>
                    
                    <FormControl sx={{m: 1}}>
                        <TextField
                            id="outlined-basic"
                            label="Rechercher"
                            variant="outlined"
                            onChange={handleKey}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            color="secondary"
                        />
                    </FormControl>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    )
}