import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { PointOfSale } from "../../../Hooks/types";
import InputField from "../../../Components/Common/Input";
import { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { useSnackbar } from "notistack";
import { colors } from "../../../Colors";

interface EditPosDialogProps {
    open: boolean;
    handleClose: () => void;
    selectedPos: PointOfSale | undefined;
    pointOfSaleList: PointOfSale[];
}
const EditPosDialog : React.FC<EditPosDialogProps> = ({open, handleClose, selectedPos, pointOfSaleList}) => {
    const [newPosName, setNewPosName] = useState<string>("");
    const [newAddress, setNewAddress] = useState<string>("");

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if(open){
            setNewPosName(selectedPos?.pointOfSaleName ?? "");
            setNewAddress(selectedPos?.address ?? "");
        }
    }, [open, selectedPos])

    const newDataPos = {
        pointOfSaleName: newPosName,
        address: newAddress
    }

    const handleSubmit = async() => {
        try{
            if(newPosName !== "" && newAddress !== ""){
                await axiosInstance.put(`/pointOfSale/${selectedPos?.idPointOfSale}`, newDataPos);

                pointOfSaleList.map((pos) => {
                    if(pos.idPointOfSale === selectedPos?.idPointOfSale){
                        pos.pointOfSaleName = newPosName;
                        pos.address = newAddress
                    }
                })

                enqueueSnackbar("Le point de vente a été modifié avec succès", {variant: 'success'});
                handleClose();
            } else {
                enqueueSnackbar("Veuillez remplir tous les champs s'il vous plait", {variant: 'warning'})
            }
        } catch (error) {
                enqueueSnackbar(`Echec de la modification : ${error}`, {variant: 'error'})
        }

    }   
    

    return (
        <Dialog open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        borderRadius: "20px"
                    }
                }} >
                    <DialogTitle><Typography align="center" variant="h4" sx={{color: colors.neutral}}>Modifier le point de vente {selectedPos?.pointOfSaleName}</Typography></DialogTitle>
                    <DialogContent>
                        <Stack direction={"column"}
                                spacing={2}
                                sx={{margin: 1}}>
                                    <InputField type="text"
                                                label="Nom du point de vente"
                                                value={newPosName}
                                                onChange={setNewPosName} />
                                    <InputField type="text"
                                                label="Adresse"
                                                value={newAddress}
                                                onChange={setNewAddress} />
                                </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" size="small" onClick={handleSubmit} sx={{color: colors.textDefault, background: colors.primary, borderRadius: "20px"}}>Envoyer</Button>
                        <Button variant="outlined" size="small" onClick={handleClose} sx={{borderRadius: "20px"}}>Annuler</Button>
                    </DialogActions>
        </Dialog>
    )
}

export default EditPosDialog;