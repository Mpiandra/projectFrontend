import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import React, { useState } from "react";
import InputField from "../../../Components/Common/Input";
import axiosInstance from "../../../axiosInstance";
import { useSnackbar } from "notistack";
//import axiosInstance from "../../../axiosInstance";

interface AddActionDialogProps {
    open: boolean;
    handleClose: () => void;
    actionList: string[];
}

const AddActionDialog: React.FC<AddActionDialogProps> = ({open, handleClose, actionList}) => {

    const [nameAction, setNameAction] = useState<string>("");

    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async() => {
        try{
            if(nameAction !== ""){
                console.log(nameAction)
                await axiosInstance.post('actionEmployee', nameAction, {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                });
                enqueueSnackbar("L'action a été ajoutée avec succès", {variant: "success"});
                actionList.push(nameAction);
                handleClose();
            }else {
                enqueueSnackbar("Veuillez remplir le champ, s'il vous plait", {variant: "warning"});
            }
        }catch(error){
            enqueueSnackbar( `Echec de l'ajout de l'action : ${error}`, {variant: "error"})
        }
    }

    return (
        <Dialog open={open}
                onClose={handleClose}>
            <DialogTitle>Ajouter une action</DialogTitle>
            <DialogContent>
                <Box sx={{margin: 2}}>
                    <InputField type="text"
                                label="Nom"
                                value={nameAction}
                                onChange={setNameAction} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" size="small" onClick={handleSubmit}>Ajouter</Button>
                <Button variant="outlined" size="small" onClick={handleClose}>Annuler</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddActionDialog;