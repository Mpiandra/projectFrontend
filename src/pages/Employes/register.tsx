import * as React from "react";
import InputField from "../../Components/Common/Input.tsx";
import {Dispatch, SetStateAction, useState} from "react";
import axiosInstance from "../../axiosInstance.ts";
import {useNavigate} from "react-router-dom";

const Register: React.FC = () => {

    const[nameEmployee, setNameEmployee] : [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();
    const[mailEmployee, setMailEmployee] : [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();
    const[password, setPassword] : [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();
    const navigate = useNavigate();

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!nameEmployee || !mailEmployee || !password) {
            console.log("veuillez remplir tous les champs");
        } else {
            try{
                const response = await axiosInstance.post("/auth/register", {nameEmployee, mailEmployee, password});
                console.log(response.data);
                console.log("formulaire soumis avec succès");
                navigate('/login');
            } catch (error){
                console.error("erreur lors de la récupération des données", error);
            }

        }

    }

    return <div>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="nameEmployee">Nom :</label>
                <InputField type="text"
                       id="nameEmployee"
                       name="nomEmployee"
                       value={nameEmployee ?? ""}
                       onChange={setNameEmployee}
                       required
                />

            </div>

            <div>
                <label htmlFor="mailEmployee">Mail :</label>
                <InputField
                    type="email"
                    name="mailEmployee"
                    id="mailEmployee"
                    value={mailEmployee ?? ""}
                    onChange={setMailEmployee}
                    // pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                    // title="Veuillez entrer une adresse mail valide s'il vous plaît"
                    required
                />
            </div>

            <div>
                <label htmlFor="password">Mot de passe :</label>
                <InputField
                    type="password"
                    id="password"
                    name="password"
                    value={password ?? ""}
                    onChange={setPassword}
                    required
                />
            </div>

            <div>
                <button type="submit">S'inscrire</button>
                <button type="button" onClick={() => navigate("/")}>Annuler</button>
            </div>
        </form>
    </div>
}

export default Register