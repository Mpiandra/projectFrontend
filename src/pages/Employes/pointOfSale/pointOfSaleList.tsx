import { ButtonGroup, CircularProgress, Fab, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, DeleteSharp, EditSharp } from "@mui/icons-material";
import { useEffect, useState } from "react";
import AddPosDialog from "./addPosDialog";
import { SnackbarProvider } from "notistack";
import axiosInstance from "../../../axiosInstance";
import { Employee, PointOfSale } from "../../../Hooks/types";
import EditPosDialog from "./editPosDialog";
import DeletePosDialog from "./deletePosDialog";
import { colors } from "../../../Colors";
import { transformToEmployee } from "../../../Hooks/useGroupData";

const PointOfSaleList = () => {

    const [openAddPosDialog, setOpenAddPosDialog] = useState(false);
    const [openEditPosDialog, setOpenEditPosDialog] = useState(false);
    const [openDeletePosDialog, setOpenDeletePosDialog] = useState(false);

    const [selectedPos, setSelectedPos] = useState<PointOfSale>();

    const [pointOfSaleList, setPointOfSaleList] = useState<PointOfSale[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentEmployee, setCurrentEmployee] = useState<Employee>();

    const storedEmployee = localStorage.getItem("employee");

    useEffect(() => {
        if(storedEmployee){
            console.log("st : ", storedEmployee);
            const parsedEmployee = JSON.parse(storedEmployee)
            console.log("parsedEmployee", parsedEmployee);
            setCurrentEmployee(transformToEmployee(parsedEmployee))
        }
    }, [storedEmployee])

    useEffect(() => {
        const fetchData = async () => {
            try{
                const getPosResponse = await axiosInstance.get('/pointOfSales');
                console.log('response get : ', getPosResponse);
                setPointOfSaleList(getPosResponse.data);
                setLoading(false);
                
            } catch(error){
                setError("Erreur lors de la récupération des données")
                console.error(error);   
            }
        }

        fetchData();
        
    }, [])

    const handelOpenAddPosDialog = () => {
        setOpenAddPosDialog(true);
    }
    
    const handleCloseAddPosDialog = () => {
        setOpenAddPosDialog(false);
    }

    const handleOpenEditPosDialog = (selectedPos: PointOfSale) => {
        setSelectedPos(selectedPos);
        setOpenEditPosDialog(true);
    }

    const handleCloseEditPosDialog = () => {
        setOpenEditPosDialog(false);
    }

    const handleOpenDeletePosDialog = (pos: PointOfSale) => {
        setSelectedPos(pos)
        setOpenDeletePosDialog(true);
    }

    const handleCloseDeletePosDialog = () => {
        setOpenDeletePosDialog(false);
    }

    if(loading) return <CircularProgress color="inherit" />
    if(error) return <p>{error}</p>


    return (
        <>
        {console.log("currentEmployee : ", currentEmployee)
        }
            <SnackbarProvider maxSnack={3}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}>
                {currentEmployee?.permissions.canAddPointOfSale && 
                    <Fab onClick={handelOpenAddPosDialog} sx={{ display: "flex", position: "fixed", margin: 2, color: colors.neutral,background: colors.tertiary, bottom: 16, right: 16 }}>
                    <Add />
                </Fab>
                }
                <AddPosDialog open={openAddPosDialog}
                                handleClose={handleCloseAddPosDialog} 
                                pointOfSaleList={pointOfSaleList}/>

                <EditPosDialog open={openEditPosDialog}
                                handleClose={handleCloseEditPosDialog} 
                                selectedPos={selectedPos}
                                pointOfSaleList={pointOfSaleList}/>
                
                <DeletePosDialog open={openDeletePosDialog}
                                 handleClose={handleCloseDeletePosDialog}
                                 selectedPos={selectedPos}
                                 pointOfSaleList={pointOfSaleList}
                                 setPointOfSaleList={setPointOfSaleList} />

                <TableContainer sx={{background: colors.background}} component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{background: colors.primary}}>
                                <TableCell align="center"><Typography variant="h6" sx={{color: colors.textDefault}}>Nom du point de vente</Typography></TableCell>
                                <TableCell align="center"><Typography variant="h6" sx={{color: colors.textDefault}}>Adresse</Typography></TableCell>
                                <TableCell align="center"><Typography variant="h6" sx={{color: colors.textDefault}}>Options</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pointOfSaleList.map((pos) => {
                                return (
                                    <TableRow key={pos.idPointOfSale}>
                                        <TableCell align="center">{pos.pointOfSaleName}</TableCell>
                                        <TableCell align="center">{pos.address}</TableCell>
                                        <TableCell align="center">
                                            <ButtonGroup variant="text">
                                                {currentEmployee?.permissions.canEditPointOfSale && 
                                                    <IconButton sx={{color: colors.primary}} onClick={() => handleOpenEditPosDialog(pos)}><EditSharp/></IconButton>
                                                }
                                                {
                                                    currentEmployee?.permissions.canDeletePointOfSale &&
                                                    <IconButton sx={{color: colors.primary}} onClick={() => handleOpenDeletePosDialog(pos)}><DeleteSharp/></IconButton>
                                                }
                                            </ButtonGroup>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </SnackbarProvider>
        </>
    )
}

export default PointOfSaleList;




