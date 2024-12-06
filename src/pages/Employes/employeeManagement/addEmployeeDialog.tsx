import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { Employee, PointOfSale } from "../../../Hooks/types";
import InputField from "../../../Components/Common/Input";
import { useSnackbar } from "notistack";
import { AxiosResponse } from "axios";

interface AddEmployeeProps {
    open: boolean;
    handleClose: () => void;
    employeeList: Employee[];
}

interface TranslatedPermissions {
    [key: string]: string;
}

const translatedPermissions: TranslatedPermissions = {
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
const AddEmployeeDialog: React.FC<AddEmployeeProps> = ({ open, handleClose, employeeList }) => {
    const [pointOfSaleList, setPointOfSaleList] = useState<PointOfSale[]>([]);

    const [checkState, setCheckState] = useState<Record<string, boolean>>(
        Object.keys(translatedPermissions).reduce((acc, permission) => {
            acc[permission] = false;
            return acc;
        }, {} as Record<string, boolean>)
    );

    const [selectedPointOfSaleId, setSelectedPointOfSaleId] = useState<number | "">("");
    const [selectedPos, setSelectedPos] = useState<PointOfSale>();

    const [nameEmployee, setNameEmployee] = useState<string>("");
    const [mailEmployee, setMailEmployee] = useState<string>("");

    const { enqueueSnackbar } = useSnackbar();

    const resetForm = () => {
        setSelectedPointOfSaleId("");
        setNameEmployee("");
        setMailEmployee("");
        setCheckState(
            Object.keys(translatedPermissions).reduce((acc, permission) => {
                acc[permission] = false;
                return acc;
            }, {} as Record<string, boolean>)
        );
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [getPosResponse] = await Promise.all([
                    axiosInstance.get('/pointOfSales')
                ]);

                setPointOfSaleList(getPosResponse.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleCheckboxChange = (action: string) => {
        setCheckState((prevState) => ({
            ...prevState,
            [action]: !prevState[action],
        }));
    };

    const selectHandleChange = (event: SelectChangeEvent<number>) => {
        const value = event.target.value as number;
        setSelectedPointOfSaleId(value);
        setSelectedPos(pointOfSaleList.find((pos) => pos.idPointOfSale === value || null));
    };

    const handleSubmit = async () => {
       try{

            let addEmployeeResponse: AxiosResponse<Employee> | null = null;
            console.log(checkState);
            
            if(nameEmployee !== "" && mailEmployee !== "" && selectedPos!== null && selectedPos !== undefined ){
                    const newEmployee:Employee = {
                        nameEmployee: nameEmployee,
                        mailEmployee: mailEmployee,
                        password:"hhhhh",
                        pointOfSale: selectedPos,
                        ...checkState
                    }

                    console.log("newEMployee : ", newEmployee);
                    
                    addEmployeeResponse = await axiosInstance.post('/employee', newEmployee);
                    if(addEmployeeResponse !== null){
                        employeeList.push(addEmployeeResponse.data);
                    }
                    
                    console.log(addEmployeeResponse);
                    enqueueSnackbar("Employé ajouté avec succès", {variant: "success"});
                    resetForm();
                    handleClose();

            } else if(nameEmployee !== "" && mailEmployee !== "" && selectedPos === undefined ){
                    console.log("pos is null");
                    
                    const newEmployee:Employee = {
                        nameEmployee: nameEmployee,
                        mailEmployee: mailEmployee,
                        password: "hhhhh",
                        ...checkState
                    }
                    addEmployeeResponse = await axiosInstance.post('/employee', newEmployee);
                    if(addEmployeeResponse !== null){
                        employeeList.push(addEmployeeResponse.data);
                    }
                    console.log(addEmployeeResponse);
                    enqueueSnackbar("Employé ajouté avec succès", {variant: "success"});
                    resetForm();
                    handleClose();
            } else {
                enqueueSnackbar("Veuillez remplir tous les champs s'il vous plait", { variant: "warning"});
            }
            
       }catch(error){
            enqueueSnackbar(`Echec de l'ajout de l'employé : ${error}`, {variant: 'error'} );
            // resetForm();
            // handleClose();
       }
    }

    const handleCancel = () => {
        resetForm();
        handleClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <DialogTitle>Ajouter un employé</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <Stack direction="column" spacing={2}>
                        <InputLabel id="selectLabel">Point de vente</InputLabel>
                        <Select
                            labelId="selectLabel"
                            label="Point de vente"
                            id="selectPos"
                            value={selectedPointOfSaleId}
                            onChange={selectHandleChange}
                        >
                            <MenuItem value={""}>Aucun</MenuItem>
                            {pointOfSaleList?.map((pos) => (
                                <MenuItem value={pos.idPointOfSale} key={pos.idPointOfSale}>
                                    {pos.pointOfSaleName}
                                </MenuItem>
                            ))}
                        </Select>
                        <InputField type="text" label="Nom" value={nameEmployee} onChange={setNameEmployee} />
                        <InputField type="text" label="Mail" value={mailEmployee} onChange={setMailEmployee} />
                        <FormLabel component="legend">Assigner les responsabilités</FormLabel>
                        <FormGroup>
                            {Object.keys(checkState).map((action) => (
                                <FormControlLabel
                                    key={action}
                                    control={
                                        <Checkbox
                                            checked={checkState[action]}
                                            onChange={() => handleCheckboxChange(action)}
                                            name={action}
                                        />
                                    }
                                    label={translatedPermissions[action]}
                                />
                            ))}
                        </FormGroup>
                    </Stack>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" size="small" onClick={handleSubmit}>Ajouter</Button>
                <Button variant="outlined" size="small" onClick={handleCancel}>Annuler</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddEmployeeDialog;
