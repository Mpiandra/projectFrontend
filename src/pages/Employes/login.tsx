import * as React from "react";
import Input from "../../Components/Common/Input.tsx";
import {Dispatch, SetStateAction, useState} from "react";
import axiosInstance from "../../axiosInstance.ts";
import {useNavigate} from "react-router-dom";

const Login: React.FC = () => {
    const[mailEmployee, setMailEmployee] : [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();
    const[password, setPassword] : [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();
    const navigate = useNavigate();

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!mailEmployee || !password){
            console.log("Veuillez remplir tous les champs");
        } else {
            try {
                const response = await axiosInstance.post("/auth/login", {mailEmployee, password});
                console.log(response.data);
                localStorage.setItem("token", response.data);
            }catch (error){
                console.error(error);
            }
        }
    }


    return <div>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="mailEmployee">Mail :</label>
                <Input type="email"
                       name="emailEmployee"
                       id = "mailEmployee"
                       value={mailEmployee ?? ""}
                       onChange={setMailEmployee}
                       required

                />
            </div>
            <div>
                <label htmlFor="password">Mot de passe :</label>
                <Input type="password"
                       name="password"
                       id = "password"
                       value={password ?? ""}
                       onChange={setPassword}
                       required
                />
            </div>
            <div>
                <button type="submit">Se connecter</button>
                <button type="button" onClick={() => navigate("/")}>Annuler</button>
            </div>

        </form>
    </div>
}

export default Login