import React, { useEffect, useState } from "react";
import { Button, Card, CardActions, CardContent, CardHeader, IconButton, Stack, Typography } from "@mui/material";
import { AddSharp, DeleteSharp, EditSharp } from "@mui/icons-material";
import AddEmployeeDialog from "./addEmployeeDialog";
import { SnackbarProvider } from "notistack";
import { Employee } from "../../../Hooks/types";
import axiosInstance from "../../../axiosInstance";
import EditEmployeeDialog from "./editEmployeeDialog";
import { transformToEmployeeList } from "../../../Hooks/useGroupData";
import DeleteEmployeeDilog from "./deleteEmployeeDialog";

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


const EmployeeList: React.FC = () => {

    const [openAddEmployee, setOpenAddEmployee] = useState(false);
    const [openEditEmployee, setOpenEditEmployee] = useState(false);
    const [openDeleteEmployee, setOpenDeleteEmployee] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState<Employee>();

    const [employeeList, setEmployeeList] = useState<Employee[]>([]);

    useEffect(() => {
        const fetchDataEmployee = async () => {
            try {
                const getEmployeeResponse = await axiosInstance.get('/employees');
                setEmployeeList(transformToEmployeeList(getEmployeeResponse.data));
            } catch (error) {
                console.error(error);
            }
        };

        fetchDataEmployee();
        
    }, []);

    const handleOpenAddEmployee = () => {
        setOpenAddEmployee(true);
    };

    const handleCloseAddEmployee = () => {
        setOpenAddEmployee(false);
    };

    const handleOpenEditEmployee = (selectedEmployee: Employee) => {
        setSelectedEmployee(selectedEmployee);
        setOpenEditEmployee(true);
    }

    const handleCloseEditEmployee = () => {
        setOpenEditEmployee(false);
    }

    const handleOpenDeleteEmployee = (selectedEmployee: Employee) => {
        setSelectedEmployee(selectedEmployee);
        setOpenDeleteEmployee(true);
    }

    const handleCloseDeleteEmployee = () => {
        setOpenDeleteEmployee(false);
    }

    const formatPermissions = (permissions: any) => {
        return Object.entries(permissions)
            .filter(([key, value]) => key.startsWith("can") && value === true)
            .map(([key]) => translatedPermissions[key] || key);
    };

    return (
        <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: "right", vertical: "top" }}>
            <Button variant="outlined" size="small" startIcon={<AddSharp />} onClick={handleOpenAddEmployee}>
                Ajouter
            </Button>

            <AddEmployeeDialog open={openAddEmployee} 
                                handleClose={handleCloseAddEmployee} 
                                employeeList={employeeList}/>

            <EditEmployeeDialog open={openEditEmployee}
                                handleClose={handleCloseEditEmployee} 
                                selectedEmployee={selectedEmployee}
                                employeeList={employeeList}/>

            <DeleteEmployeeDilog open={openDeleteEmployee}
                                    handleClose={handleCloseDeleteEmployee}
                                    selectedEmployee={selectedEmployee}
                                    employeeList={employeeList}
                                    setEmployeeList={setEmployeeList} />

            <div>
                {employeeList.map((employee) => (

                    <Stack direction={"column"} spacing={3}>
                        <Card key={employee.idEmployee} elevation={5}>
                            <CardHeader
                                        title={<Typography align="center" variant="h4">{employee.nameEmployee}</Typography>}
                                        subheader={<Typography align="center" variant="h6">{employee.mailEmployee}</Typography>}
                                        
                            />
                            <CardContent><Typography >Point de vente : {employee.pointOfSale?.pointOfSaleName || "Aucun"}</Typography></CardContent>
                            <CardContent><Typography>Permissions :</Typography>
                                    <ul>
                                        {formatPermissions(employee.permissions).map((permission, index) => (
                                        <li key={index}>{permission}</li>
                                    ))}
                                    </ul>
                                </CardContent>
                            <CardActions>
                                <IconButton onClick={() => handleOpenEditEmployee(employee)}><EditSharp /></IconButton>
                                <IconButton onClick={() => handleOpenDeleteEmployee(employee)}><DeleteSharp /></IconButton>
                            </CardActions>
                        </Card>
                    </Stack>

                    
                ))}
            </div>
        </SnackbarProvider>
    );
};

export default EmployeeList;
