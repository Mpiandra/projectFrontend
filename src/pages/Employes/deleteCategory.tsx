import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import axiosInstance from "../../axiosInstance.ts";

interface DeleteCategoryProps {
    idCategory : number | undefined;
    open : boolean;
    handleClose : () => void;
    categoryName : string | undefined;
}
const DeleteCategoryDialog: React.FC<DeleteCategoryProps> = ({open, idCategory, categoryName, handleClose}) => {

    const handleSubmit = async () => {
        try {
            const response = axiosInstance.delete(`/category/${idCategory}`);
            console.log(response)
            handleClose();
        } catch (error){
            console.log('error ' + error );
        }
    }

    return (
        <Dialog open={open}
                onClose={handleClose}
                maxWidth={"lg"}
                fullWidth
        >
            <DialogTitle>
                {`Supprimer la catégorie ${categoryName} ?`}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Les types de produits, les attributs des types de produits et les produits ainsi que les attributs correspondants seront également supprimés.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant={"outlined"} onClick={handleSubmit}>Valider</Button>
                <Button variant={"outlined"} onClick={handleClose}>Annuler</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteCategoryDialog;