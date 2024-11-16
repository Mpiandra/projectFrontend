import InputField from "../../../Components/Common/Input.tsx";
import React, {Dispatch, SetStateAction, useState} from "react";
import axiosInstance from "../../../axiosInstance.ts";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import { Category } from "../../../Hooks/types.ts";


interface AddCategoryDialogProps {
    open : boolean;
    handleClose: () => void;
    setCategoryDataList: Dispatch<SetStateAction<Category[]>> ;
    categoryDataList: Category[];
}

const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({open, handleClose, setCategoryDataList, categoryDataList}) => {
    const [categoryName, setCategoryName]: [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState()

    const handleSubmit = async () => {
        const newCategory = await axiosInstance.post('/category', {categoryName});
        console.log("test",[...categoryDataList, {...newCategory.data, productTypes: []}])
        setCategoryDataList([...categoryDataList, {...newCategory.data, productTypes: []}]) 
        handleClose();
    }

    return (
        <Dialog open={open}
                maxWidth={'lg'}
                fullWidth
                onClose={handleClose}
        >
            <DialogTitle>
                Ajouter une nouvelle catégorie
            </DialogTitle>
            <DialogContent>
                <InputField type="text"
                       name="categoryName"
                       id="outlined-basic"
                       value={categoryName ?? ""}
                       onChange={setCategoryName}
                       label="Nom de la categorie"
                       required
                />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleSubmit}>Envoyer</Button>
                <Button variant={"outlined"} onClick={handleClose}>Annuler</Button>
            </DialogActions>

        </Dialog>
    )


}
export default AddCategoryDialog;