import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import { TransferGetted } from "../../../Hooks/types";
import axiosInstance from "../../../axiosInstance";
import { useSnackbar } from "notistack";

interface DeleteTransferProps{
    open: boolean;
    handleClose: () => void;
    selectedTransfer: TransferGetted | undefined;
    allTransferData: TransferGetted[];
    setAllTransferData: Dispatch<SetStateAction<TransferGetted[]>>;
}
const DeleteTransferDialog: React.FC<DeleteTransferProps> = ({open, handleClose, selectedTransfer, allTransferData, setAllTransferData}) => {
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async() => {
        try{
            await axiosInstance.delete(`/transfer/${selectedTransfer?.idTransfer}`);
            enqueueSnackbar("Le transfert a été supprimé avec succès", {variant: "success"});
            
            const filteredAllTransferDat: TransferGetted[] = allTransferData.filter((transferData) => {
                if(transferData.idTransfer !== selectedTransfer?.idTransfer){
                    return true;
                }
            })

            setAllTransferData(filteredAllTransferDat);

            handleClose();

        }catch(error){
            enqueueSnackbar(`Erreur lors de la suppression du transfer : ${error}`, {variant: "error"})
        }
    }
    return (
        <Dialog open={open}
                onClose={handleClose}>
                    <DialogTitle>Supprimer un transfert</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Voulez-vous vraiment supprimer ce transert ?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" size="small" onClick={handleSubmit}>Valider</Button>
                        <Button variant="outlined" size="small" onClick={handleClose}>Annuler</Button>
                    </DialogActions>

        </Dialog>
    )
}

export default DeleteTransferDialog;