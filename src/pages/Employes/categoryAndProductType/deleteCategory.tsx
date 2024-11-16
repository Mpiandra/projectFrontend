import React, { Dispatch, SetStateAction } from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import axiosInstance from "../../../axiosInstance.ts";
import { Category } from "../../../Hooks/types.ts";


interface DeleteCategoryProps {
    idCategory : number | undefined;
    open : boolean;
    handleClose : () => void;
    categoryName : string | undefined;
    setCategoryDataList : Dispatch<SetStateAction<Category[]>> ;
    categoryDataList: Category[];
}
const DeleteCategoryDialog: React.FC<DeleteCategoryProps> = ({open, idCategory, categoryName, handleClose, setCategoryDataList, categoryDataList}) => {

    const handleSubmit = async () => {
        try {
            axiosInstance.delete(`/category/${idCategory}`);
            const filteredCategory = categoryDataList.filter((item) => {
                return item.idCategory !== idCategory;
            })
            setCategoryDataList(filteredCategory);
            
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
                <Button variant={"outlined"} size={"small"} onClick={handleSubmit}>Valider</Button>
                <Button variant={"outlined"} size={"small"} onClick={handleClose}>Annuler</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteCategoryDialog;