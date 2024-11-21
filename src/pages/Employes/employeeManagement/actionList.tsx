import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import MenuEmployee from "../../../Components/Employes/menuEmployee";
import { AddSharp } from "@mui/icons-material";
import AddActionDialog from "./addActionDialog";
import { useEffect, useState } from "react";
import { SnackbarProvider } from "notistack";
import axiosInstance from "../../../axiosInstance";

const ActionList = () => {
    const [openAddAction, setOpenAddAction] = useState(false);

    const [actionList, setActionList] = useState<string[]>([])

    useEffect(() => {
       const fetchData = async () => {
            const getActionsResponse = await axiosInstance.get('actionEmployees');
            const actions = getActionsResponse.data.slice(2).map((data) => data[0])
            setActionList(actions)
            console.log(actionList)
       }
       fetchData();
    }, [])
    
    const handleOpenAddAction = () => {
        setOpenAddAction(true);
    }

    const handleCloseAddAction = () => {
        setOpenAddAction(false);
    }

    return (
        <div>
            <SnackbarProvider maxSnack={3}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}>
                <MenuEmployee />
                <Button variant="outlined" size="small" startIcon={<AddSharp />} onClick={handleOpenAddAction}>Action</Button>
                <AddActionDialog open={openAddAction}
                                handleClose={handleCloseAddAction} 
                                actionList={actionList}/>
                <TableContainer component={Paper} sx={{margin: 2, width: 600}}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{bgcolor: "gray"}}>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {actionList.map((action, index) => {
                                

                                return (
                                    <TableRow key={index}>
                                        <TableCell align="center">{action}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer> 

             </SnackbarProvider>
        </div>
    )
}

export default ActionList;