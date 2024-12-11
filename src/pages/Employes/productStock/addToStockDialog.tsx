import { Dialog, DialogContent, DialogTitle, Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CategoryWithStock, Employee, ProductStockPosted } from "../../../Hooks/types";
import axiosInstance from "../../../axiosInstance";
import Grid from '@mui/material/Grid2';
import { Checkbox } from "@mui/material";
import { useSnackbar } from "notistack";

interface AddToStockProps {
    open: boolean;
    handleClose: () => void;
    productStockData: CategoryWithStock[];
}

const AddToStockDialog: React.FC<AddToStockProps> = ({ open, handleClose, productStockData }) => {
    const [currentEmployee, setCurrentEmployee] = useState<Employee>();
    const [selectedProducts, setSelectedProducts] = useState<{ [idProduct: number]: number }>({});

    const storedEmployee = localStorage.getItem("employee");

    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        if (storedEmployee) {
            setCurrentEmployee(JSON.parse(storedEmployee));
        }
    }, [storedEmployee]);


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

        try{
            const updatedProductStocks = await axiosInstance.put("/addToProductStocks", productStockList);
            console.log("updatedProductStocks: ", updatedProductStocks);

            productStockData.map((category) => {
                category.productTypes.map((productType) => {
                    productType.products.map((product) => {
                        productStockList.map((productStock) => {
                            if(product.idProduct === productStock.product.idProduct){
                                product.quantityStock += productStock.quantityStock;
                            }
                        })
                    })
                })
            })

            enqueueSnackbar("Stock ajouté avec succès", {variant: "success"})
            handleClose();

        }catch(error){
            enqueueSnackbar(`Erreur lors de l'enregistrement du stock : ${error}`, {variant: "error"})
        }
        
        
    };

    return (
        <Dialog open={open} onClose={handleClose} fullScreen>
            <DialogTitle>Enregistrer entrée de produits</DialogTitle>
            <DialogContent>
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
                                                        <TableCell>Quantité</TableCell>
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
                                                            <TableCell>
                                                                <TextField
                                                                    type="number"
                                                                    size="small"
                                                                    disabled={selectedProducts[product.idProduct] === undefined}
                                                                    value={selectedProducts[product.idProduct] || ""}
                                                                    onChange={(e) =>
                                                                        handleQuantityChange(
                                                                            product.idProduct,
                                                                            parseInt(e.target.value) || 0
                                                                        )
                                                                    }
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

export default AddToStockDialog;
