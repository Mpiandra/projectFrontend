import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { Employee, PointOfSale } from "../../../Hooks/types";
import InputField from "../../../Components/Common/Input";
import { useSnackbar } from "notistack";
import { AxiosResponse } from "axios";

interface AddEmployeeProps {
    open: boolean;
    handleClose: () => void;
}

interface TranslatedPermissions {
    [key: string]: string;
}

const translatedPermissions: TranslatedPermissions = {
    canModifyProduct: "Peut modifier produit",
    canAddProduct: "Peut ajouter produit",
    canDeleteProduct: "Peut supprimer produit",
    canAddCategory: "Peut ajouter catégorie",
    canDeleteCategory: "Peut supprimer catégorie",
    canEditCategory: "Peut modifier catégorie",
    canAddProductType: "Peut ajouter type de produit",
    canDeleteProductType: "Peut supprimer type de produit",
    canEditProduct: "Peut modifier produit",
    canAddEmployee: "Peut ajouter employé",
    canAddPointOfSale: "Peut ajouter point de vente",
    canDeleteEmployee: "Peut supprimer employé",
    canDeletePointOfSale: "Peut supprimer point de vente",
    canEditEmployee: "Peut modifier employé",
    canEditPointOfSale: "Peut modifier point de vente"
};

const AddEmployeeDialog: React.FC<AddEmployeeProps> = ({ open, handleClose }) => {
    const [pointOfSaleList, setPointOfSaleList] = useState<PointOfSale[]>([]);

    const [checkState, setCheckState] = useState<Record<string, boolean>>({});

    const [selectedPointOfSaleId, setSelectedPointOfSaleId] = useState<number | "">("");
    const [selectedPos, setSelectedPos] = useState<PointOfSale>();

    const [nameEmployee, setNameEmployee] = useState<string>("");
    const [mailEmployee, setMailEmployee] = useState<string>("");

    const { enqueueSnackbar } = useSnackbar();

    const resetForm = () => {
        setSelectedPointOfSaleId("");
        setNameEmployee("");
        setMailEmployee("");
        // setCheckState(actions.reduce((acc: Record<string, boolean>, curr: string) => {
        //     acc[curr] = false;
        //     return acc;
        // }, {}))
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [getPosResponse, getActionResponse] = await Promise.all([
                    axiosInstance.get('/pointOfSales'),
                    axiosInstance.get('/actionEmployees'),
                ]);

                setPointOfSaleList(getPosResponse.data);

                const actions = getActionResponse.data.slice(1, -1).map((data: any) => data[0]);

                console.log(actions);
                

                const initialSelectState = actions.reduce((acc: Record<string, boolean>, curr: string) => {
                    acc[curr] = false;
                    return acc;
                }, {});
                setCheckState(initialSelectState);
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

            if(nameEmployee !== "" && mailEmployee !== "" && selectedPos!== null && selectedPos !== undefined ){
                    const newEmployee:Employee = {
                        nameEmployee: nameEmployee,
                        mailEmployee: mailEmployee,
                        password:"hhhhh",
                        pointOfSale: selectedPos
                    }

                    console.log("newEMployee : ", newEmployee);
                    
                    addEmployeeResponse = await axiosInstance.post('/employee', newEmployee);
                    console.log(addEmployeeResponse);

            } else if(nameEmployee !== "" && mailEmployee !== "" && selectedPos === null ){
                    console.log("pos is null");
                    
                    const newEmployee:Employee = {
                        nameEmployee: nameEmployee,
                        mailEmployee: mailEmployee,
                        password: "hhhhh",
                    }
                    addEmployeeResponse = await axiosInstance.post('/employee', newEmployee);
                    console.log(addEmployeeResponse);
                
            } else {
                enqueueSnackbar("Veuillez remplir tous les champs s'il vous plait", { variant: "warning"});
            }
            
            const employeeActions = {
                employee: addEmployeeResponse?.data,
                ...checkState
                
            }
            
            try{
                await axiosInstance.post('/actions', employeeActions);
                enqueueSnackbar("L'employé a été ajouté avec succès", {variant: "success"})
                resetForm();
                handleClose();
            } catch(error){
                await axiosInstance.delete(`/employee/${addEmployeeResponse?.data.idEmployee}`);
                enqueueSnackbar(`Echec de l'ajout de l'employé : ${error}`, {variant: 'error'} );
            }
            
            
       }catch(error){
            enqueueSnackbar(`Echec de l'ajout de l'employé : ${error}`, {variant: 'error'} );
            resetForm();
            handleClose();
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
