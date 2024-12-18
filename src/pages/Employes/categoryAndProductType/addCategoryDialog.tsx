import InputField from "../../../Components/Common/Input.tsx";
import React, {Dispatch, SetStateAction, useState} from "react";
import axiosInstance from "../../../axiosInstance.ts";
import {Button, Dialog, DialogActions, DialogTitle, Stack, Typography} from "@mui/material";
import { CategoryJoinProductType } from "../../../Hooks/types.ts";
import { useSnackbar } from "notistack";
import { colors } from "../../../Colors/index.ts";


interface AddCategoryDialogProps {
    open : boolean;
    handleClose: () => void;
    setCategoryDataList: Dispatch<SetStateAction<CategoryJoinProductType[]>> ;
    categoryDataList: CategoryJoinProductType[];
}

const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({open, handleClose, setCategoryDataList, categoryDataList}) => {
    const [categoryName, setCategoryName]: [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();

    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async () => {
        try{
            if(categoryName){
                const newCategory = await axiosInstance.post('/category', {categoryName});
                console.log("test",[...categoryDataList, {...newCategory.data, productTypes: []}])
                setCategoryDataList([...categoryDataList, {...newCategory.data, productTypes: []}]);
                enqueueSnackbar("La catégorie a été ajoutée avec succès", {variant: "success"});
                handleClose();
            } else {
                enqueueSnackbar("Veuillez remplir le champ, s'il vous plait", {variant: "warning"});
            }
        }catch(error){
            enqueueSnackbar(`Echec de l'ajout de la catégorie: ${error}`, {variant: "error"})
        }
    }

    return (
        <Dialog open={open}
                maxWidth={'lg'}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        borderRadius: "20px"
                    }
                }}
        >
                <DialogTitle>
                        <Typography align="center" variant="h4" sx={{color: colors.neutral}}>Ajouter une nouvelle catégorie</Typography>
                    </DialogTitle>
                    <Stack padding={2}>
                    <InputField type="text"
                            name="categoryName"
                            id="outlined-basic"
                            value={categoryName ?? ""}
                            onChange={setCategoryName}
                            label="Nom de la categorie"
                            required
                        />
                    </Stack>
                        
                
                    <DialogActions>
                        <Button variant="outlined" onClick={handleSubmit} sx={{color: colors.textDefault, background: colors.neutral, borderRadius: "20px"}}>Ajouter</Button>
                        <Button variant={"outlined"} onClick={handleClose} sx={{borderRadius: "20px"}} >Annuler</Button>
                    </DialogActions>

        </Dialog>
    )


}
export default AddCategoryDialog;