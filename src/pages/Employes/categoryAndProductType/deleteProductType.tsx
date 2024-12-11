import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import axiosInstance from "../../../axiosInstance";
import { useSnackbar } from "notistack";
import { CategoryJoinProductType } from "../../../Hooks/types";

interface DeleteProductTypeProps{
    open: boolean;
    handleClose: () => void;
    idProductType: number | undefined;
    categoryDataList: CategoryJoinProductType[];
    setCategoryDataList: Dispatch<SetStateAction<CategoryJoinProductType[]>>;
}
const DeleteProductType: React.FC<DeleteProductTypeProps> = ({open, handleClose, idProductType, categoryDataList, setCategoryDataList}) => {
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async() => {
        try{
            await axiosInstance.delete(`/productType/${idProductType}`);
            
            await axiosInstance.delete(`/attributes/${idProductType}`, {params: {parent: "productType"}})

            const filteredCategoryDataList = categoryDataList.map(category => {
                return {
                    ...category, productTypes: category.productTypes.filter(productType => productType.idProductType !== idProductType)
                }
            })

            setCategoryDataList(filteredCategoryDataList);

            enqueueSnackbar("Le type de produit a été supprimé avec succès", {variant: "success"});
            handleClose();
        }catch(error){
            enqueueSnackbar(`Echec de la suppression du type de produit : ${error}`, {variant: "error"})
        }
    }
    return <Dialog open={open}
                    onClose={handleClose} >
                        <DialogTitle>Supprimer le type de produit</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Voulez-vous vraiment supprimer ce type de produit ? Cela supprimera tous les produits de ce type.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="outlined" size="small" onClick={handleSubmit}>Valider</Button>
                            <Button variant="outlined" size="small" onClick={handleClose}>Annuler</Button>
                        </DialogActions>
            </Dialog>
}

export default DeleteProductType