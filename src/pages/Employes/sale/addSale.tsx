import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2"
import { CategoryWithStock, Employee, ProductStock, ProductStockPosted, Sale, SaleGetted, SaleRow } from "../../../Hooks/types";
import axiosInstance from "../../../axiosInstance";
import { groupStockProducts } from "../../../Hooks/useGroupData";
import { Checkbox } from "@mui/material";
import { useSnackbar } from "notistack";

interface AddSaleProps{
    open: boolean;
    handleClose: () => void;
    filteredSaleData: SaleGetted[] | undefined;
}

const AddSaleDialog: React.FC<AddSaleProps> = ({open, handleClose, filteredSaleData}) => {
    const [currentEmployee, setCurrentEmployee] = useState<Employee>();

    const [productStockData, setProductStockData] = useState<CategoryWithStock[]>();
    const [selectedProducts, setSelectedProducts] = useState<{ [idProduct: number]: number }>({});
    const [saleRows, setSaleRows] = useState<SaleRow[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>();

    const {enqueueSnackbar} = useSnackbar();
    const storedEmployee = localStorage.getItem("employee");

    const resetForm = () => {
        setSelectedProducts({});
        setSaleRows([])
    }

    const handleCancel = () => {
        resetForm();
        handleClose();
    }

    useEffect(() => {
        if(storedEmployee){
            setCurrentEmployee(JSON.parse(storedEmployee));
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

    const handleCheckboxChange = (productId: number) => {
        setSelectedProducts((prev) => {
            const newSelection = { ...prev };
            if (newSelection[productId] !== undefined) {
                delete newSelection[productId];
                setSaleRows(saleRows.filter((row) => {
                    if(row.product.idProduct !== productId){
                        return true;
                    }
                }))
            } else {
                newSelection[productId] = 0; 
            }
            return newSelection;
        });
    };

    useEffect(() => {
        // Calculer le total des prix
        const total = saleRows.reduce((sum, row) => sum + row.priceSale, 0);
        setTotalPrice(total);
    }, [saleRows]); 

    const handleQuantityChange = (productId: number, quantity: number, product: ProductStock, price: number) => {
        setSelectedProducts((prev) => ({
            ...prev,
            [productId]: quantity,
        }));
    
        setSaleRows((prevSaleRows) => {
            const existingRow = prevSaleRows.find((row) => row.product.idProduct === productId);
    
            if (existingRow) {
                return prevSaleRows.map((row) =>
                    row.product.idProduct === productId
                        ? { ...row, quantitySale: quantity, priceSale: quantity * price }
                        : row
                );
            } else {
                return [
                    ...prevSaleRows,
                    {
                        product,
                        quantitySale: quantity,
                        priceSale: quantity * price,
                    },
                ];
            }
        });

    };

    
    const handleSubmit = async() => {
        try{
            const newSale: Sale = {
                saleDate: new Date().toLocaleString(),
                pointOfSale: currentEmployee?.pointOfSale,
                totalPrice: totalPrice
            }
    
            const addSaleResponse = await axiosInstance.post('/sale', newSale)
    
            saleRows.map((row) => {
                row.sale = addSaleResponse.data
            })
    
            await axiosInstance.post('/saleRows', saleRows)
    
            const productStockRow: ProductStockPosted[] = []
    
            saleRows.map((row) => {
                const newStockRow: ProductStockPosted = {
                    idStock: productStockData?.flatMap((category) => category.productTypes.flatMap((productType) => productType.products))
                    .find((product) => product.idProduct === row.product.idProduct)?.idStock,
    
                    quantityStock: row.quantitySale,
    
                    pointOfSale: currentEmployee?.pointOfSale,
    
                    product: row.product
    
                }

    
                productStockRow.push(newStockRow)
            })
    
            await axiosInstance.put('/substractProductStocks', productStockRow)

            const newSaleData = {
                ...addSaleResponse.data,
                saleRows: saleRows
            }

            filteredSaleData.push(newSaleData);

            enqueueSnackbar("Vente enregistrée avec succès", {variant: "success"})
            resetForm();
            handleCancel();
        }catch(error){
            enqueueSnackbar(`Erreur lors de l'ajout de la vente : ${error}`, {variant: "error"})
        }

        

        
        
    }

    

    return (
        <Dialog open={open}
                onClose={handleClose} fullScreen>
            <DialogTitle>Ajouter une vente</DialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid size={saleRows.length > 0 ? 8 : 12}>
                        {productStockData?.map((category) => {
                            return (
                                <React.Fragment key={category.idCategory}>
                                    <Typography>{category.categoryName}</Typography>
                                    {category.productTypes.map((productType) => {
                                        return (
                                            <React.Fragment key={productType.idProductType}>
                                                <Typography>{productType.productTypeName}</Typography>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Selection</TableCell>
                                                            <TableCell>Produit</TableCell>
                                                            <TableCell>Prix unitaire</TableCell>
                                                            <TableCell>Quantité en stock</TableCell>
                                                            <TableCell>Quatité vendue</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                    {productType.products.map((product) => {
                                                    return (
                                                        <TableRow key={product.idProduct}>
                                                            <TableCell>
                                                            <Checkbox
                                                                    checked={selectedProducts[product.idProduct] !== undefined}
                                                                    onChange={() => handleCheckboxChange(product.idProduct)}
                                                                />
                                                                </TableCell>
                                                            <TableCell>{product.productName}</TableCell>
                                                            <TableCell>{product.price}</TableCell>
                                                            <TableCell>{product.quantityStock}</TableCell>
                                                            <TableCell>
                                                            <TextField
                                                                    type="number"
                                                                    size="small"
                                                                    disabled={selectedProducts[product.idProduct] === undefined}
                                                                    value={selectedProducts[product.idProduct] || ""}
                                                                    onChange={(e) => {
                                                                        const inputValue = parseInt(e.target.value) || 0;
                                                                        const maxValue = product.quantityStock;

                                                                        const validValue = inputValue > maxValue ? maxValue : inputValue;

                                                                        handleQuantityChange(product.idProduct, validValue, product, product.price);
                                                                    }}
                                                                    inputProps={{
                                                                        min: 0,
                                                                        max: product.quantityStock,
                                                                    }}
                                                                />

                                                            </TableCell>
                                                        </TableRow>
                                                        

                                                    )
                                                })}
                                                    </TableBody>
                                                </Table>
                                                
                                            </React.Fragment>
                                        )
                                    })}
                                </React.Fragment>
                            )
                        })}
                    </Grid>
                    <Grid size={4}>
                        <Typography>Vente</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Produit</TableCell>
                                    <TableCell>Quantité</TableCell>
                                    <TableCell>Prix total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {saleRows.map((row) => {
                            return (
                                <TableRow key={row.idSaleRow}>
                                    <TableCell>{row.product.productName}</TableCell>
                                    <TableCell>{row.quantitySale}</TableCell>
                                    <TableCell>{row.priceSale}</TableCell>
                                </TableRow>
                            )
                        })}
                        <TableRow>
                            <TableCell>Prix total</TableCell>
                            <TableCell colSpan={2}>{totalPrice}</TableCell>
                        </TableRow>
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" size="small" onClick={handleSubmit}>Ajouter</Button>
                <Button variant="outlined" size="small" onClick={handleCancel}>Annuler</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddSaleDialog;