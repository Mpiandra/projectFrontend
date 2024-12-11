import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import { PointOfSale } from "../../../Hooks/types";
import axiosInstance from "../../../axiosInstance";
import { useSnackbar } from "notistack";

interface DeletePosDialogProps{
    open: boolean;
    handleClose: () => void;
    selectedPos: PointOfSale | undefined;
    pointOfSaleList: PointOfSale[];
    setPointOfSaleList: Dispatch<SetStateAction<PointOfSale[]>>;
}

const DeletePosDialog: React.FC<DeletePosDialogProps>= ({open, handleClose, selectedPos, pointOfSaleList, setPointOfSaleList}) => {

    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async() => {
       try{
            await axiosInstance.delete(`/pointOfSale/${selectedPos?.idPointOfSale}`)

            enqueueSnackbar("Le point de vente a été supprimé avec succès", {variant: 'success'})
            
            const filteredList = pointOfSaleList.filter((pos) => {
                return pos.idPointOfSale !== selectedPos?.idPointOfSale;
            })

            setPointOfSaleList(filteredList);

            handleClose();
       }catch(error){
            enqueueSnackbar(`Echec de la suppression du point de vente : ${error}`, {variant: "error"})
       }

    }

    return (
        <Dialog open={open}
                onClose={handleClose}
                maxWidth={'lg'}
                fullWidth>
            <DialogTitle>Supprimer le point de vente {selectedPos?.pointOfSaleName}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Voulez-vous vraiment supprimer ce point de vente ?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" size="small" onClick={handleSubmit}>Valider</Button>
                <Button variant="outlined" size="small" onClick={handleClose}>Annuler</Button>
            </DialogActions>

        </Dialog>
    )
}
export default DeletePosDialog;