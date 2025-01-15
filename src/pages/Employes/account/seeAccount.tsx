import React, { useEffect, useState } from "react";
import { Button, Typography, Box, List, ListItem, Divider, Paper, Stack } from "@mui/material";
import ChangePasswordDialog from "./changePassword";
import { Employee } from "../../../Hooks/types";
import { transformToEmployee } from "../../../Hooks/useGroupData";
import Grid from '@mui/material/Grid2';
import { colors } from "../../../Colors";

const translatedPermissions: { [key: string]: string } = {
    canAddCategory: "Peut ajouter catégorie",
    canDeleteCategory: "Peut supprimer catégorie",
    canEditCategory: "Peut modifier catégorie",
    canAddAppConfiguration: "Peut ajouter configuration de l'application",
    canEditAppConfiguration: "Peut modifier configuration de l'application",
    canAddProduct: "Peut ajouter produit",
    canDeleteProduct: "Peut supprimer produit",
    canEditProduct: "Peut modifier produit",
    canAddProductType: "Peut ajouter type de produit",
    canDeleteProductType: "Peut supprimer type de produit",
    canAddEmployee: "Peut ajouter employé",
    canDeleteEmployee: "Peut supprimer employé",
    canEditEmployee: "Peut modifier employé",
    canAddPointOfSale: "Peut ajouter point de vente",
    canDeletePointOfSale: "Peut supprimer point de vente",
    canEditPointOfSale: "Peut modifier point de vente",
    canAddLoss: "Peut ajouter perte",
    canDeleteLoss: "Peut supprimer perte",
    canEditLoss: "Peut modifier perte",
    canAddOrder: "Peut ajouter commande",
    canDeleteOrder: "Peut supprimer commande",
    canEditOrder: "Peut modifier commande",
    canAddSale: "Peut ajouter vente",
    canDeleteSale: "Peut supprimer vente",
    canEditSale: "Peut modifier vente",
    canAddTransfer: "Peut ajouter transfert",
    canDeleteTransfer: "Peut supprimer transfert",
    canEditTransfer: "Peut modifier transfert",
    canEditProductStock: "Peut modifier stock de produit",
    canEditCommandStatus: "Peut modifier statut de commande",
    canConfirmCommand: "Peut confirmer commande"
};

const Account: React.FC = () => {
    const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
    const [openChangePassword, setOpenChangePassword] = useState(false);

    // Fonction pour ouvrir le dialogue de changement de mot de passe
    const handleOpenChangePassword = () => {
        setOpenChangePassword(true);
    };

    // Fonction pour fermer le dialogue de changement de mot de passe
    const handleCloseChangePassword = () => {
        setOpenChangePassword(false);
    };

    // Récupération de l'employé depuis le localStorage
    useEffect(() => {
        const storedEmployee = localStorage.getItem("employee");
        if (storedEmployee) {
            try {
                const parsedEmployee = JSON.parse(storedEmployee);
                const transformedEmployee = transformToEmployee(parsedEmployee);
                if (transformedEmployee) {
                    setCurrentEmployee(transformedEmployee);
                } else {
                    console.error("Échec de la transformation de l'employé :", parsedEmployee);
                }
            } catch (error) {
                console.error("Erreur lors de l'analyse de storedEmployee :", error);
            }
        }
    }, []);

    // Formatage des permissions
    const formatPermissions = (permissions: any) => {
        if (!permissions || typeof permissions !== "object") {
            return [];
        }
        return Object.entries(permissions)
            .filter(([key, value]) => key.startsWith("can") && value === true)
            .map(([key]) => translatedPermissions[key] || key);
    };

    return (
        <Box padding={3}>

            <ChangePasswordDialog 
                open={openChangePassword} 
                handleClose={handleCloseChangePassword} 
            />

            <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography variant="h4" gutterBottom>Mon Compte</Typography>
                <Button variant="outlined" size="small" onClick={handleOpenChangePassword}>
                    Changer mot de passe
                </Button>
            </Stack>
            {currentEmployee ? (
                <>
                    <Grid container direction={"row"} spacing={1}>
                        <Grid size={6} alignItems={"center"}>
                            <Paper elevation={5} sx={{padding: "5px", backgroundColor: colors.primary, marginTop: "150px"}}>
                                <Typography variant="h5" sx={{color: colors.background}}>Nom : {currentEmployee.nameEmployee}</Typography>
                                <Typography variant="h5" sx={{color: colors.background}}>
                                    Point de vente : {currentEmployee.pointOfSale?.pointOfSaleName || "Non spécifié"}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid>
                            <Typography variant="h5">Permissions :</Typography>
                            <List>
                                {formatPermissions(currentEmployee.permissions).map((permission, index) => (
                                    <ListItem key={index}>
                                        <Typography>{permission}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                        
                    </Grid>
                    
                    
                </>
            ) : (
                <Typography variant="body1" color="textSecondary">
                    Aucune donnée d'employé trouvée.
                </Typography>
            )}

            <Divider style={{ margin: "20px 0" }} />

            
        </Box>
    );
};

export default Account;
