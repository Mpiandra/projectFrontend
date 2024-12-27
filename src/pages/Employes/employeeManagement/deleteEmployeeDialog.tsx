import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import { Employee } from "../../../Hooks/types";
import axiosInstance from "../../../axiosInstance";
import { useSnackbar } from "notistack";
import { colors } from "../../../Colors";

interface DeleteEmployeeProps {
    open: boolean;
    handleClose: () => void;
    selectedEmployee: Employee | undefined;
    employeeList: Employee[];
    setEmployeeList: Dispatch<SetStateAction<Employee[]>>;
}

const DeleteEmployeeDilog: React.FC<DeleteEmployeeProps> = ({open, handleClose, selectedEmployee, employeeList, setEmployeeList}) => {

    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async() => {
        try{
            await axiosInstance.delete(`/employee/${selectedEmployee?.idEmployee}`);

            const filteredEmployeeList = employeeList.filter((employee) => {
                if(employee.idEmployee !== selectedEmployee?.idEmployee){
                    return true;
                }
            })
            console.log(filteredEmployeeList);
            

            setEmployeeList(filteredEmployeeList);

            enqueueSnackbar("Employé supprimé avec succès", {variant: "success"});

            handleClose();
        }catch(error){
            enqueueSnackbar(`Erreur lors de la suppression de l'employé : ${error}`, {variant: "error"});
        }
    }

    return (
        <Dialog open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        borderRadius: "20px"
                    }
                }}>
                <DialogTitle><Typography align="center" variant="h4" sx={{color: colors.neutral}}>Supprimer l'employé {selectedEmployee?.nameEmployee} ?</Typography></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Voulez-vous vraiment supprimer cet employé ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleSubmit} sx={{color: colors.textDefault, background: colors.primary, borderRadius: "20px"}}>Valider</Button>
                    <Button variant="outlined" size="small" onClick={handleClose} sx={{borderRadius: "20px"}}>Annuler</Button>
                </DialogActions>
        </Dialog>
    )
}

export default DeleteEmployeeDilog;