import React, { useState } from "react";
import MenuEmployee from "../../../Components/Employes/menuEmployee";
import { Button } from "@mui/material";
import { AddSharp } from "@mui/icons-material";
import AddEmployeeDialog from "./addEmployeeDialog";
import { SnackbarProvider } from "notistack";

const EmployeeList: React.FC = () => {

    const [openAddEmployee, setOpenAddEmployee] = useState(false)

    const handleOpenAddEmployee = () => {
        setOpenAddEmployee(true);
    }
    
    const handleCloseAddEmployee = () => {
        setOpenAddEmployee(false)
    }

    return (
        <SnackbarProvider maxSnack={3}
                            anchorOrigin={{
                                horizontal: "right",
                                vertical: "top"
                            }}>
            <MenuEmployee/>
            <Button variant="outlined" size="small" startIcon={<AddSharp />} onClick={handleOpenAddEmployee}>Ajouter</Button>

            <AddEmployeeDialog open={openAddEmployee}
                                handleClose={handleCloseAddEmployee} />

        </SnackbarProvider>
    )
}

export default EmployeeList;