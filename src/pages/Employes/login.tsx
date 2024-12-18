import * as React from "react";
import InputField from "../../Components/Common/Input.tsx";
import {Dispatch, SetStateAction, useState} from "react";
import axiosInstance from "../../axiosInstance.ts";
import {useNavigate} from "react-router-dom";
import {Button, Stack, Box} from "@mui/material";
import { useSnackbar } from "notistack";
import Typography from "@mui/material/Typography";
import { colors } from "../../Colors/index.ts";

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
                
                
                navigate('/categories')
            }catch (error){
                enqueueSnackbar(`Erreur d'authentification ${error}`, {variant: "error"});
                console.error(error);
            }
        }
    }


    return (
         
                <Stack direction={"column"}
                             spacing={2}
                             sx={{justifyContent: "center",
                                    alignItems: "center",
                            background: colors.tertiary
                             }}>
                        <Typography variant="h3" color={colors.primary} sx={{fontWeight:800,marginBottom:4}}>Connexion</Typography>

                        <InputField type="email"
                            name="emailEmployee"
                            label="E-mail"
                            id="outlined-basic"
                            value={mailEmployee ?? ""}
                            onChange={setMailEmployee}
                            required

                        />

                        <InputField type="password"
                            name="password"
                            label="Mot de passe"
                            id="outlined-password-input"
                            value={password ?? ""}
                            onChange={setPassword}
                            required
                        />
                        <Button variant="contained" sx={{width:"50%", background: colors.primary, color: colors.textDefault }} size="small"   onClick={handleSubmit}>Se connecter</Button>
                    </Stack>



    )
}

export default Login