import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import InputField from "../../../Components/Common/Input";
import { useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { useSnackbar } from "notistack";
import { PointOfSale, ProductStockPosted } from "../../../Hooks/types";

interface AddPosDialogProps {
    open: boolean;
    handleClose: () => void;
    pointOfSaleList: PointOfSale[];
}

const AddPosDialog: React.FC<AddPosDialogProps> = ({open, handleClose, pointOfSaleList}) => {
    const [posName, setPosName] = useState<string>("")
    const [address, setAddress] = useState<string>("");

    const { enqueueSnackbar } = useSnackbar();

    const newPos = {
        pointOfSaleName: posName,
        address: address
    }

    const resetForm = () => {
        setPosName("");
        setAddress("");
    }

    const handleCloseReset = () => {
        resetForm();
        handleClose();
    }

    const handleSubmit = async() => {
        try{
            if(posName !== "" && address !== ""){
                const addPosResponse = await axiosInstance.post('pointOfSale', newPos);
                console.log(addPosResponse);

                const getPos = await axiosInstance.get("/pointOfSales")
                
                const posList: PointOfSale[] = getPos.data;

                const stocksResponse = await axiosInstance.get(`/productStocks/${posList[0].idPointOfSale}`)

                const stockList: ProductStockPosted[] = stocksResponse.data;

                stockList.map((stock: ProductStockPosted) => {
                    delete stock.idStock;
                    stock.quantityStock = 0
                    stock.pointOfSale=addPosResponse.data
                })

                console.log(stockList);
                

                const addStock = await axiosInstance.post("/productStocks", stockList);
                console.log((addStock));
                



                const posToAdd: PointOfSale = {
                    idPointOfSale: addPosResponse.data.idPoitOfsale,
                    pointOfSaleName: addPosResponse.data.pointOfSaleName,
                    address: addPosResponse.data.address
                }

                pointOfSaleList.push(posToAdd);
                
                enqueueSnackbar('Le point de vente a été ajouté avec succès', { variant: 'success' })
                resetForm();
                handleClose();
            } else {
                enqueueSnackbar('Veuillez remplir tous les champs, s\'il vous plait', {variant: 'warning'})
            }
        }catch(error) {
           enqueueSnackbar(`Echec de l'ajout du point de vente : ${error}`, {variant: 'error'})
        }
        
        
    }

    return (
        <Dialog open = {open}
                onClose={handleClose}
                maxWidth={'lg'}
                fullWidth>
                    <DialogTitle>Ajouter un nouveau point de vente</DialogTitle>
                    <DialogContent>
                        <Stack direction={"column"}
                                spacing={2} >
                            <InputField type="text"
                                    label="Nom du point de vente"
                                    value={posName}
                                    onChange={setPosName} 
                                    required/>

                            <InputField type="text"
                                    label="Adresse"
                                    value={address}
                                    onChange={setAddress} 
                                    required/>

                        </Stack>

                    </DialogContent>
                    
                    <DialogActions>
                        <Button variant="outlined" size="small" onClick={handleSubmit }>Ajouter</Button>
                        <Button variant="outlined" size="small" onClick={handleCloseReset}>Annuler</Button>
                    </DialogActions>

        </Dialog>
    )
}

export default AddPosDialog;