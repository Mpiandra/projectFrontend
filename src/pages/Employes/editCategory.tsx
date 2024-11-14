import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogTitle, Stack } from "@mui/material";
import Input from "../../Components/Common/Input.tsx";
import { CancelSharp, SendSharp } from "@mui/icons-material";
import axiosInstance from "../../axiosInstance.ts";

interface EditCategoryDialogProps {
    open: boolean;
    handleClose: () => void;
    idCategory: number | undefined;
    oldCategoryName: string | undefined;
}

const EditCategoryDialog: React.FC<EditCategoryDialogProps> = ({ open, handleClose, idCategory, oldCategoryName }) => {
    const [categoryName, setCategoryName] = useState("");

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
            handleClose();
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la catégorie:", error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"    // Augmenter la taille maximale
            fullWidth        // Utiliser toute la largeur disponible
        >
            <DialogTitle>Modifier une catégorie</DialogTitle>
            <Stack
                direction="column"
                spacing={2}
                padding={3}   // Ajouter du padding pour espacer les éléments
            >
                <Input
                    type="text"
                    name="categoryName"
                    label="Nom de la catégorie"
                    value={categoryName}
                    onChange={setCategoryName}  // Mettre à jour l'état newCategoryName
                    required
                />
                <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                >
                    <Button variant="outlined" startIcon={<SendSharp />} onClick={handleSubmit}>Envoyer</Button>
                    <Button variant="outlined" startIcon={<CancelSharp />} onClick={handleClose}>Annuler</Button>
                </Stack>
            </Stack>
        </Dialog>
    );
};

export default EditCategoryDialog;
