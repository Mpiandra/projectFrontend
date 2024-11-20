import { Button, ButtonGroup, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import MenuEmployee from "../../../Components/Employes/menuEmployee";
import { AddSharp, DeleteSharp, EditSharp } from "@mui/icons-material";
import { useEffect, useState } from "react";
import AddPosDialog from "./addPosDialog";
import { SnackbarProvider } from "notistack";
import axiosInstance from "../../../axiosInstance";
import { PointOfSale } from "../../../Hooks/types";
import EditPosDialog from "./editPosDialog";
import DeletePosDialog from "./deletePosDialog";

const PointOfSaleList = () => {

    const [openAddPosDialog, setOpenAddPosDialog] = useState(false);
    const [openEditPosDialog, setOpenEditPosDialog] = useState(false);
    const [openDeletePosDialog, setOpenDeletePosDialog] = useState(false);

    const [selectedPos, setSelectedPos] = useState<PointOfSale>();

    const [pointOfSaleList, setPointOfSaleList] = useState<PointOfSale[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            <SnackbarProvider maxSnack={3}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}>
                <MenuEmployee />
                <Button variant="outlined" size="small" startIcon={<AddSharp />} onClick={handelOpenAddPosDialog}>Point de vente</Button>

                <AddPosDialog open={openAddPosDialog}
                                handleClose={handleCloseAddPosDialog} />

                <EditPosDialog open={openEditPosDialog}
                                handleClose={handleCloseEditPosDialog} 
                                selectedPos={selectedPos}
                                pointOfSaleList={pointOfSaleList}/>
                
                <DeletePosDialog open={openDeletePosDialog}
                                 handleClose={handleCloseDeletePosDialog}
                                 selectedPos={selectedPos}
                                 pointOfSaleList={pointOfSaleList}
                                 setPointOfSaleList={setPointOfSaleList} />

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Nom du point de vente</TableCell>
                                <TableCell align="center">Adresse</TableCell>
                                <TableCell align="center">Options</TableCell>
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
                                                <IconButton onClick={() => handleOpenEditPosDialog(pos)}><EditSharp/></IconButton>
                                                <IconButton onClick={() => handleOpenDeletePosDialog(pos)}><DeleteSharp/></IconButton>
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