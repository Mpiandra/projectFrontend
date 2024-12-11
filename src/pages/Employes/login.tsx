import * as React from "react";
import InputField from "../../Components/Common/Input.tsx";
import {Dispatch, SetStateAction, useState} from "react";
import axiosInstance from "../../axiosInstance.ts";
import {useNavigate} from "react-router-dom";
import {Button, Container, Stack} from "@mui/material";
import { useSnackbar } from "notistack";
import Typography from "@mui/material/Typography";

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
                display:"flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius : 1,
                height : "100%",
                width:"100%",
                mt:"10rem"

            }}
        >
            <Container maxWidth="md"  sx={{bgcolor:"whitesmoke",height:"30rem",borderRadius:5,display:"flex",flexDirection:"column", justifyContent: "center",
                alignItems: "center",}}>
                <Typography variant="h3" color="secondary" sx={{fontWeight:800,marginBottom:4}}>Connexion</Typography>

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
                <Button variant="contained" color="secondary" sx={{width:"50%"}} size="small"   onClick={handleSubmit}>Se connecter</Button>
            </Container>

        </Stack>

    )
}

export default Login