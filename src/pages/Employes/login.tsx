import * as React from "react";
import InputField from "../../Components/Common/Input.tsx";
import {Dispatch, SetStateAction, useState} from "react";
import axiosInstance from "../../axiosInstance.ts";
import {useNavigate} from "react-router-dom";
import {Button, Stack} from "@mui/material";
import { useSnackbar } from "notistack";

const Login: React.FC = () => {
    const[mailEmployee, setMailEmployee] : [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();
    const[password, setPassword] : [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async () => {
        if(!mailEmployee || !password){
            console.log("Veuillez remplir tous les champs");
        } else {
            try {
                const response = await axiosInstance.post("/auth/login", {mailEmployee, password});

                const {token, employee} = response.data;

                localStorage.setItem("token", token);
                localStorage.setItem("employee", JSON.stringify(employee));

                enqueueSnackbar("Connexion réussie", {variant: "success"});
                
                
                navigate('/employeeHome')
            }catch (error){
                enqueueSnackbar(`Erreur d'authentification ${error}`, {variant: "error"});
                console.error(error);
            }
        }
    }


    return (
        <Stack
            direction="column"
            spacing={2}
            sx={{
                justifyContent: "center",
                alignItems: "center",
                border : "1px solid gray",
                borderRadius : 1,
                width : 300,
                height : 200,

            }}
        >
                <div>
                    <InputField type="email"
                           name="emailEmployee"
                           label="Mail"
                           id="outlined-basic"
                           value={mailEmployee ?? ""}
                           onChange={setMailEmployee}
                           required

                    />
                </div>
                <div>
                    <InputField type="password"
                           name="password"
                           label="Password"
                           id="outlined-password-input"
                           value={password ?? ""}
                           onChange={setPassword}
                           required
                    />
                </div>
            <Stack
                direction="row"
                spacing={2}
            >
                <Button variant="outlined" size="small" onClick={handleSubmit}>Se connecter</Button>
                <Button variant="outlined" size="small" onClick={() => navigate("/")}>Annuler</Button>
            </Stack>


        </Stack>

    )
}

export default Login