import React, { Dispatch, SetStateAction } from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import axiosInstance from "../../../axiosInstance.ts";
import { CategoryJoinProductType } from "../../../Hooks/types.ts";
import { useSnackbar } from "notistack";


interface DeleteCategoryProps {
    idCategory : number | undefined;
    open : boolean;
    handleClose : () => void;
    categoryName : string | undefined;
    setCategoryDataList : Dispatch<SetStateAction<CategoryJoinProductType[]>> ;
    categoryDataList: CategoryJoinProductType[];
}
const DeleteCategoryDialog: React.FC<DeleteCategoryProps> = ({open, idCategory, categoryName, handleClose, setCategoryDataList, categoryDataList}) => {

    const {enqueueSnackbar} = useSnackbar();

    const handleSubmit = async () => {
        try {
            axiosInstance.delete(`/category/${idCategory}`);
            const filteredCategory = categoryDataList.filter((item) => {
                return item.idCategory !== idCategory;
            })
            setCategoryDataList(filteredCategory);
            enqueueSnackbar("La catégorie a été supprimée avec succès", {variant: "success"})
            handleClose();
        } catch (error){
            enqueueSnackbar(`Echec de la suppressions de la catégorie : ${error}`, {variant: "error"});
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
                <Button variant={"outlined"} size={"small"} onClick={handleSubmit}>Valider</Button>
                <Button variant={"outlined"} size={"small"} onClick={handleClose}>Annuler</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteCategoryDialog;