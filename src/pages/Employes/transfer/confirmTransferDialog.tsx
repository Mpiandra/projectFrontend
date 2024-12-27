import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CategoryWithStock, Employee, ProductStockPosted, Transfer, TransferGetted } from "../../../Hooks/types";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import axiosInstance from "../../../axiosInstance";
import { groupStockProducts } from "../../../Hooks/useGroupData";
import { useSnackbar } from "notistack";

interface ConfirmTransferProps {
    open: boolean;
    handleClose: () => void;
    selectedTransfer: TransferGetted | undefined;
    completedTransferIn: TransferGetted[];
    inProgressTransferIn: TransferGetted[];
    setInProgressTransferIn: Dispatch<SetStateAction<TransferGetted[]>>;
}

const ConfirmTransferDialog : React.FC<ConfirmTransferProps> = ({open, handleClose, selectedTransfer, completedTransferIn, inProgressTransferIn, setInProgressTransferIn}) => {
    const [productStockData, setProductStockData] = useState<CategoryWithStock[]>([]);
    const [currentEmployee, setCurrentEmployee] = useState<Employee>();

    const storedEmployee = localStorage.getItem("employee");
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        if(storedEmployee){
            setCurrentEmployee(JSON.parse(storedEmployee))
        }
    }, [storedEmployee])

    useEffect(() => {
        const fetchData = async() => {
            if(currentEmployee){
                console.log("CurrentEmployee: ", currentEmployee);
                if(currentEmployee.pointOfSale){
                    const getProductStockData = await axiosInstance.get(`/stockProductData/${currentEmployee.pointOfSale?.idPointOfSale}`);
                    setProductStockData(groupStockProducts(getProductStockData.data));
                } else {
                    const getProductStockData = await axiosInstance.get('/principalStockData');
                    setProductStockData(groupStockProducts(getProductStockData.data))

                    console.log("stokData",groupStockProducts(getProductStockData.data));
                    
                }
                
            }
            
        }

        fetchData();
    }, [currentEmployee])
    

    const handleSubmit = async() => {
        try{
            if(selectedTransfer){
                await axiosInstance.put(`/transferStatus/${selectedTransfer.idTransfer}`)
              
    
                const productStockRows: ProductStockPosted[] = []
            
                selectedTransfer?.transferRows.flatMap((row) => {
                const quantityStock = row.quantityProductTransfer;
                const product = row.product;
                const idStock = productStockData.flatMap((category) => category.productTypes.flatMap((productType) => productType.products))
                .find((product) => product.idProduct === row.product.idProduct)?.idStock;
                
                const pointOfSale = currentEmployee?.pointOfSale;
    
                const productStock : ProductStockPosted = {
                    quantityStock,
                    product,
                    idStock,
                    pointOfSale
                }
    
                productStockRows.push(productStock);
            })
    
                console.log("productStockRows : ", productStockRows);
                const updateStock = await axiosInstance.put("/addToProductStocks", productStockRows);
                console.log("updateStock:", updateStock);

                selectedTransfer.transferStatus = "Complété"
    
    
                completedTransferIn.push(selectedTransfer)

                const filteredInProgressTransferIn = inProgressTransferIn.filter((transfer) => {
                    if(transfer.idTransfer !== selectedTransfer.idTransfer){
                        return true;
                    }
                })

                setInProgressTransferIn(filteredInProgressTransferIn);
                enqueueSnackbar("Confirmation du transfert réussie", {variant: "success"});
                handleClose();
            }
        } catch(error){
            enqueueSnackbar(`Erreur lors de la confirmation du transfert : ${error}`, {variant: "error"})
        }

    }
    return (
        <Dialog open={open}
                onClose={handleClose}
        >
            <DialogTitle>Confirmer l'arrivée d'un transfert</DialogTitle>
            <DialogContent>
                <DialogContentText>Voulez-vous vraiment confirmer ce transfert ?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" size="small" onClick={handleSubmit}>Valider</Button>
                <Button variant="outlined" size="small" onClick={handleClose}>Annuler</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmTransferDialog;