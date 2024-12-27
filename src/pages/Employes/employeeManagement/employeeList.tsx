import React, { useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Fab, IconButton, Paper, Stack, Typography } from "@mui/material";
import { Add, DeleteSharp, EditSharp } from "@mui/icons-material";
import AddEmployeeDialog from "./addEmployeeDialog";
import { SnackbarProvider } from "notistack";
import { Employee } from "../../../Hooks/types";
import axiosInstance from "../../../axiosInstance";
import EditEmployeeDialog from "./editEmployeeDialog";
import { transformToEmployeeList } from "../../../Hooks/useGroupData";
import DeleteEmployeeDilog from "./deleteEmployeeDialog";
import { colors } from "../../../Colors";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";

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
            <Fab onClick={handleOpenAddEmployee} sx={{ display: "flex", position: "fixed", margin: 2, color: colors.neutral,background: colors.tertiary, bottom: 16, right: 16 }}>
                    <Add />
                </Fab>

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
            <Stack direction={"column"} spacing={3}>
                {employeeList.map((employee) => (

                   
                        <Paper elevation={3}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ArrowDropDownIcon/>}
                                    aria-controls="panel2-content"
                                    id="panel2-header"
                                    sx={{backgroundColor: colors.secondary}}
                                >
                                    <Stack direction={"row"}
                                        justifyContent={"space-between"}
                                        alignItems={"center"}
                                        sx={{ width: "100%"}}>
                                        <Stack direction={"column"} spacing={1}>
                                            <Typography variant="h5">{employee.nameEmployee}</Typography>
                                            <Typography variant="h6">{employee.mailEmployee}</Typography>
                                        </Stack>
                                        <Stack direction={"row"} spacing={1}>
                                            <IconButton onClick={(event) => {
                                                event.stopPropagation(); handleOpenEditEmployee(employee)
                                            }}><EditSharp sx={{color: colors.background}}/></IconButton>
                                            <IconButton onClick={(event) => {
                                                event.stopPropagation();
                                                handleOpenDeleteEmployee(employee);
                                            }}><DeleteSharp sx={{color: colors.background}} /></IconButton>
                                        </Stack>
                                    </Stack>
                                    
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Stack direction={"column"} spacing={1}>
                                        <Typography>Point de vente : {employee.pointOfSale ? employee.pointOfSale.pointOfSaleName : 'Aucun'}</Typography>
                                        <Typography>Permissions : </Typography>
                                        
                                        {formatPermissions(employee.permissions).map((permission, index) => (
                                        <Typography key={index}> - {permission}</Typography>
                                    ))}
                                    </Stack>
                                    
                                </AccordionDetails>
                            </Accordion>

                        </Paper>
                   

                    
                ))}
                 </Stack>
            </div>
        </SnackbarProvider>
    );
};

export default EmployeeList;
