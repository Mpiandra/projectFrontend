import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import InputField from "../../../Components/Common/Input";
import axiosInstance from "../../../axiosInstance";
import { Employee } from "../../../Hooks/types";

interface ChangePasswordProps {
    open: boolean;
    handleClose: () => void;
}

const ChangePasswordDialog: React.FC<ChangePasswordProps> = ({ open, handleClose }) => {
    const { enqueueSnackbar } = useSnackbar();

    const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
    const [newPassword, setNewPassword] = useState<string>("");
    const [oldPassword, setOldPassword] = useState<string>("");

    // Chargement de l'employé depuis le localStorage
    useEffect(() => {
        const storedEmployee = localStorage.getItem("employee");
        if (storedEmployee) {
            try {
                const parsedEmployee = JSON.parse(storedEmployee) as Employee;
                setCurrentEmployee(parsedEmployee);
            } catch (error) {
                console.error("Erreur lors du parsing de storedEmployee :", error);
                enqueueSnackbar("Erreur lors du chargement des données de l'utilisateur.", { variant: "error" });
            }
        }
    }, []);

    // Gestion de la soumission
    const handleSubmit = () => {
        if (!oldPassword || !newPassword) {
            enqueueSnackbar("Veuillez remplir tous les champs.", { variant: "warning" });
            return;
        }

        if (oldPassword === "hhhhh") {
            // Appel à l'API pour changer le mot de passe
            axiosInstance
                .put("/password", {params: {newPassword: newPassword,
                    idEmployee: currentEmployee?.idEmployee,}
                    
                })
                .then(() => {
                    enqueueSnackbar("Mot de passe changé avec succès.", { variant: "success" });
                    handleClose(); // Fermer le dialogue après succès
                })
                .catch((error) => {
                    console.error("Erreur lors du changement de mot de passe :", error);
                    enqueueSnackbar("Une erreur est survenue. Veuillez réessayer.", { variant: "error" });
                });
        } else {
            enqueueSnackbar("L'ancien mot de passe entré est incorrect.", { variant: "error" });
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Changer de mot de passe</DialogTitle>
            <DialogContent>
                <Stack direction={"column"} spacing={2}>
                    {/* Champ pour l'ancien mot de passe */}
                    <InputField
                        type="password"
                        value={oldPassword}
                        onChange={setOldPassword}
                        label="Ancien mot de passe"
                    />

                    {/* Champ pour le nouveau mot de passe */}
                    <InputField
                        type="password"
                        value={newPassword}
                        onChange={setNewPassword}
                        label="Nouveau mot de passe"
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" size="small" onClick={handleSubmit}>
                    Changer
                </Button>
                <Button variant="outlined" size="small" onClick={handleClose}>
                    Annuler
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangePasswordDialog;
