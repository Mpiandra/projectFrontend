import { Dialog, DialogContent, DialogTitle, Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AllProductData, CategoryWithStock, Employee, PointOfSale, ProductStockPosted, Transfer, TransferGetted, TransferRow } from "../../../Hooks/types";
import axiosInstance from "../../../axiosInstance";
import { groupStockProducts, transformToAllProductData } from "../../../Hooks/useGroupData";
import Grid from '@mui/material/Grid2';
import { Checkbox } from "@mui/material";
import { enqueueSnackbar } from "notistack";

interface AddTransferProps {
    open: boolean;
    handleClose: () => void;
    allTransferData: TransferGetted[];
}

const AddTransferDialog: React.FC<AddTransferProps> = ({ open, handleClose, allTransferData }) => {
    const [productStockData, setProductStockData] = useState<CategoryWithStock[]>([]);
    const [productDataList, setProductDataList] = useState<AllProductData[]>([]);
    const [currentEmployee, setCurrentEmployee] = useState<Employee>();
    const [selectedProducts, setSelectedProducts] = useState<{ [idProduct: number]: number }>({});

    
    const [selectedPointOfSaleId, setSelectedPointOfSaleId] = useState<number | "">("");
    const [selectedPos, setSelectedPos] = useState<PointOfSale>();
    const [pointOfSaleList, setPointOfSaleList] = useState<PointOfSale[]>([]);


    const storedEmployee = localStorage.getItem("employee");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [getPosResponse, getProductData] = await Promise.all([
                    axiosInstance.get('/pointOfSales'),
                    axiosInstance.get('/productData')
                ]);
                setProductDataList(transformToAllProductData(getProductData.data));

                setPointOfSaleList(getPosResponse.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (storedEmployee) {
            setCurrentEmployee(JSON.parse(storedEmployee));
        }
    }, [storedEmployee]);

    const selectHandleChange = (event: SelectChangeEvent<number>) => {
        const value = event.target.value as number;
        setSelectedPointOfSaleId(value);
        setSelectedPos(pointOfSaleList.find((pos) => pos.idPointOfSale === value || null));
    };

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

    const handleCheckboxChange = (productId: number) => {
        setSelectedProducts((prev) => {
            const newSelection = { ...prev };
            if (newSelection[productId] !== undefined) {
                delete newSelection[productId];
            } else {
                newSelection[productId] = 1; 
            }
            return newSelection;
        });
    };

    const handleQuantityChange = (productId: number, quantity: number) => {
        setSelectedProducts((prev) => ({
            ...prev,
            [productId]: quantity,
        }));
    };

    const handleSubmit = async() => {
        if (!currentEmployee) {
            console.error("Current employee or point of sale is undefined.");
            return;
        }

        if(!selectedPos){
            enqueueSnackbar("Veuillez sélectionner un point de vente de déstination et le statut du transfert, s'il vous plaît", {variant: "warning"});
    
        } else {
            const newTransfer : Transfer = {
                transferDate: new Date().toLocaleString(),
                transferStatus: "En cours",
                pointOfSaleSource: currentEmployee.pointOfSale,
                pointOfSaleDestination: selectedPos
            }

            try{
                console.log("selectePos", selectedPos);
                
                const addTransferResponse = await axiosInstance.post("/transfer", newTransfer);

                console.log("addTransferResponse", addTransferResponse);
                

                const newTransferRows: TransferRow[] = []
                
                Object.keys(selectedProducts).map((productId) => {
                    const quantityProductTransfer = selectedProducts[parseInt(productId)]

                    const product = productDataList
                    .flatMap((category) => category.productTypes.flatMap((type) => type.products))
                    .find((product) => product.idProduct === parseInt(productId));

                    const transfer = addTransferResponse.data;

                    const transferRow = {
                        quantityProductTransfer,
                        product,
                        transfer
                    }

                    newTransferRows.push(transferRow);
                })

                const addTransferRowsResponse = await axiosInstance.post('/transferRows', newTransferRows);

                console.log("addTransferRowsResponse", addTransferRowsResponse);

                const transferRowResponse : TransferRow[] = addTransferRowsResponse.data;

                transferRowResponse.map((transferRow) => {
                    delete transferRow.transfer
                })


                const newTransferData : TransferGetted = {
                    ...addTransferResponse.data,
                    transferRows: transferRowResponse
                }

                allTransferData.push(newTransferData);

                console.log("newTransferData", newTransferData);
                console.log("allTransferData", allTransferData);
                
                


                if(newTransfer.transferStatus === "En cours"){
                    const productStockList: ProductStockPosted[] = Object.keys(selectedProducts).map((productId) => {
                        const quantityStock = selectedProducts[parseInt(productId)];
                        const product = productStockData
                            .flatMap((category) => category.productTypes.flatMap((type) => type.products))
                            .find((product) => product.idProduct === parseInt(productId));
                        
                        const idStock = productStockData
                            .flatMap((category) => category.productTypes.flatMap((type) => type.products))
                            .find((product) => product.idProduct === parseInt(productId))?.idStock;
            
                        if (!product) {
                            throw new Error(`Product with id ${productId} not found.`);
                        }
            
                        return {
                            idStock,
                            quantityStock,
                            product,
                            pointOfSale: currentEmployee.pointOfSale,
                        };
                    });
            
                    console.log("ProductStockList to save:", productStockList);
            
                    const updatedProductStocks = await axiosInstance.put("/substractProductStocks", productStockList);
                    console.log("updatedProductStocks: ", updatedProductStocks);

                  

                }
                
                
                enqueueSnackbar("Transfer enregistré avec succès", {variant: "success"});
                handleClose();
            } catch(error){
                enqueueSnackbar(`Erreur lors de l'ajout du transfert : ${error}`, {variant: "error"})
            }

        }

        
        
        
    };

    return (
        <Dialog open={open} onClose={handleClose} fullScreen>
            <DialogTitle>Ajouter un transfert</DialogTitle>
            <DialogContent>
                    <Grid container spacing={1} sx={{margin: 1}}>
                    
                            <Grid size={6} justifyContent={"center"}>
                            <FormControl fullWidth>
                                <InputLabel id="selectLabel">Point de vente de déstination</InputLabel>
                                <Select
                                    labelId="selectLabel"
                                    label="Point de vente"
                                    id="selectPos"
                                    value={selectedPointOfSaleId}
                                    onChange={selectHandleChange}
                                >
                                {pointOfSaleList?.map((pos) => (
                                    <MenuItem value={pos.idPointOfSale} key={pos.idPointOfSale}>
                                        {pos.pointOfSaleName}
                                    </MenuItem>
                                ))}
                                </Select>
                                </FormControl >
                            </Grid>
                    
                    
                    </Grid>
                
                        <Grid container spacing={1}>
                    <Grid size={12}>
                        {productStockData.map((category) => (
                            <React.Fragment key={category.categoryName}>
                                <Typography variant="h6">{category.categoryName}</Typography>
                                {category.productTypes.map((productType) => (
                                    <React.Fragment key={productType.productTypeName}>
                                        <Typography variant="subtitle1">{productType.productTypeName}</Typography>
                                        {productType.products.length > 0 && productType.products[0].idProduct!== null ?(
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Selection</TableCell>
                                                        <TableCell>Produit</TableCell>
                                                        <TableCell>Quantité en stock</TableCell>
                                                        <TableCell>Quantité à transférer</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {productType.products.map((product) => (
                                                        <TableRow key={product.idProduct}>
                                                            <TableCell>
                                                                <Checkbox
                                                                    checked={selectedProducts[product.idProduct] !== undefined}
                                                                    onChange={() => handleCheckboxChange(product.idProduct)}
                                                                />
                                                            </TableCell>
                                                            <TableCell>{product.productName}</TableCell>
                                                            <TableCell>{product.quantityStock}</TableCell>
                                                            <TableCell>
                                                                <TextField
                                                                    type="number"
                                                                    size="small"
                                                                    disabled={selectedProducts[product.idProduct] === undefined}
                                                                    value={selectedProducts[product.idProduct] || ""}
                                                                    onChange={(e) =>
                                                                    {
                                                                        const inputValue = parseInt(e.target.value) || 0;
                                                                        const maxValue = product.quantityStock;

                                                                        const validValue = inputValue > maxValue ? maxValue : inputValue;
                                                                        handleQuantityChange(
                                                                            product.idProduct,
                                                                            validValue
                                                                        )
                                                                    }
                                                                    }
                                                                    inputProps={{ 
                                                                        min: 0,
                                                                        max: product.quantityStock
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        ) : null}
                                    </React.Fragment>
                                ))}
                            </React.Fragment>
                        ))}
                    </Grid>
                    <Divider />
                    <Grid size={4}>
                        <Button variant="outlined" size="small" onClick={handleSubmit}>Enregistrer</Button>
                        <Button variant="outlined" size="small" onClick={handleClose}>Annuler</Button>
                    </Grid>
                </Grid>
                
                
            </DialogContent>
        </Dialog>
    );
};

export default AddTransferDialog;
