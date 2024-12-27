import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import { Button, Dialog, DialogActions, DialogTitle, Stack, Typography } from "@mui/material";
import InputField from "../../../Components/Common/Input.tsx";
import axiosInstance from "../../../axiosInstance.ts";
import { CategoryJoinProductType } from "../../../Hooks/types.ts";
import { useSnackbar } from "notistack";
import { colors } from "../../../Colors/index.ts";


interface EditCategoryDialogProps {
    open: boolean;
    handleClose: () => void;
    idCategory: number | undefined;
    oldCategoryName: string | undefined;
    setCategoryDataList: Dispatch<SetStateAction<CategoryJoinProductType[]>>;
    categoryDataList: CategoryJoinProductType[];
}

const EditCategoryDialog: React.FC<EditCategoryDialogProps> = ({ open, handleClose, idCategory, oldCategoryName, setCategoryDataList, categoryDataList }) => {
    const [categoryName, setCategoryName] = useState("");

    const {enqueueSnackbar} = useSnackbar();
    // Initialiser newCategoryName avec categoryName à l'ouverture du dialogue
    useEffect(() => {
        if (open) {
            setCategoryName(oldCategoryName ?? "");
        }
    }, [open, oldCategoryName]);

    const handleSubmit = async () => {
        try {
            const response = await axiosInstance.put(`/category/${idCategory}`, { categoryName: categoryName });
            console.log(response);
            const filteredCategoryDataList = categoryDataList.filter((item) => {
                if(item.idCategory !== idCategory){
                    return true;
                } else {
                    item.categoryName=categoryName;
                    return true;
                }
            })
            setCategoryDataList(filteredCategoryDataList);
            enqueueSnackbar("La catégorie a été modifiée avec succès", {variant: "success"});
            handleClose();
        } catch (error) {
            enqueueSnackbar(`Echec de la modification de la catégorie: ${error}`, {variant: "error"});
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={'lg'}
            PaperProps={{
                sx: {
                    borderRadius: "20px"
                }
            }} 
        >
            <DialogTitle><Typography align="center" variant="h4" sx={{color: colors.neutral}}>Modifier une catégorie</Typography></DialogTitle>
            <Stack
                direction="column"
                spacing={2}
                padding={2}   
            >
                <InputField
                    type="text"
                    name="categoryName"
                    label="Nom de la catégorie"
                    id="outlined-basic"
                    value={categoryName}
                    onChange={setCategoryName}  
                    required
                />
            </Stack>
                <DialogActions>
                    <Button variant="outlined" onClick={handleSubmit} sx={{color: colors.textDefault, background: colors.primary, borderRadius: "20px"}}>Modifier</Button>
                    <Button variant="outlined" onClick={handleClose} sx={{borderRadius: "20px"}}>Annuler</Button> 
                </DialogActions>
                    
           
        </Dialog>
    );
};

export default EditCategoryDialog;
