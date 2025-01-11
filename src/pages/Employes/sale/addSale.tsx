import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2"
import { CategoryWithStock, Employee, ProductStock, ProductStockPosted, Sale, SaleGetted, SaleRow } from "../../../Hooks/types";
import axiosInstance from "../../../axiosInstance";
import { groupStockProducts } from "../../../Hooks/useGroupData";
import { Checkbox } from "@mui/material";
import { useSnackbar } from "notistack";
import { colors } from "../../../Colors";

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
        if(open){
            console.log("filteredSleDataAdd: ", filteredSaleData);
            
        }
    }, [open])
    useEffect(() => {
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
    
            console.log("currentEMployee: ", currentEmployee);
            
            const addSaleResponse = await axiosInstance.post('/sale', newSale)
    
            saleRows.map((row) => {
                row.sale = addSaleResponse.data
            })
    
            const addSaleRowsResponse = await axiosInstance.post('/saleRows', saleRows)
            
    
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

            const saleRowsPosted: SaleRow = addSaleRowsResponse.data
            
            const generateFacture = await axiosInstance.post('/generatePdf', saleRowsPosted,{params: {
                nameEmployee: currentEmployee?.name,
                saleDate: newSale.saleDate,
                totalPrice: newSale.totalPrice
            }, responseType: "blob",
                withCredentials: true});

                const url = window.URL.createObjectURL(new Blob([generateFacture.data], { type: "application/pdf" }));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "facture.pdf");
                document.body.appendChild(link);
                link.click();

            console.log("saleRowPosted : ", saleRowsPosted);
            


            const idSale = addSaleResponse.data.idSale;
            const idPointOfSale = addSaleResponse.data.pointOfSale.idPointOfSale;
            const saleDate = addSaleResponse.data.saleDate;
            const priceTotal = addSaleResponse.data.totalPrice;

            const transformedSaleRows = saleRows.map((row, index) => ({
                idSaleRow: index + 1, // Génération d'un ID pour chaque ligne
                idProduct: row.product.idProduct,
                imageUrl: row.product.imageUrl,
                price: row.product.price,
                priceSale: row.priceSale,
                productName: row.product.productName,
                quantitySale: row.quantitySale
            }));
            

            const newSaleData = {
                idSale,
                idPointOfSale,
                saleDate,
                totalPrice : priceTotal,
                saleRows: transformedSaleRows
            }

            console.log("filteredSaleData : ", filteredSaleData);
            console.log("newSaleData: ", newSaleData);
            
            

            filteredSaleData?.push(newSaleData);

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
            <DialogTitle><Typography align="center" variant="h4" sx={{color: colors.neutral}}>Enregistrer une vente</Typography></DialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid size={saleRows.length > 0 ? 8 : 12}>
                        <Stack spacing={4}>
                        {productStockData?.map((category) => {
                            return (
                                <Paper elevation={3} key={category.idCategory} sx={{background: colors.background, padding: 2}}>
                                    <Typography variant="h5" sx={{color: colors.secondary}} align="center">{category.categoryName}</Typography>
                                    {category.productTypes.map((productType) => {
                                        return (
                                            <React.Fragment key={productType.idProductType}>
                                                <Typography variant="h6">{productType.productTypeName}</Typography>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow sx={{background: colors.primary}}>
                                                            <TableCell><Typography sx={{color: colors.background}}>Selection</Typography></TableCell>
                                                            <TableCell><Typography sx={{color: colors.background}}>Produit</Typography></TableCell>
                                                            <TableCell><Typography sx={{color: colors.background}}>Prix unitaire</Typography></TableCell>
                                                            <TableCell><Typography sx={{color: colors.background}}>Quantité en stock</Typography></TableCell>
                                                            <TableCell><Typography sx={{color: colors.background}}>Quatité vendue</Typography></TableCell>
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
                                </Paper>
                            )
                        })}
                        </Stack>
                    </Grid>
                    {saleRows.length > 0 &&
                        <Grid size={4} sx={{
                            position: "sticky",
                            top: 0,
                            alignSelf: "flex-start",
                            backgroundColor: "white", // Pour que le fond soit visible au-dessus des autres éléments
                            zIndex: 10, // Assure que la grille fixe reste au-dessus
                            padding: "10px", // Optionnel : Ajoute un peu d'espace
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Optionnel : Ajoute une ombre pour la visibilité
                            background: colors.primary
            }}>
                <Typography variant="h5" align="center" sx={{color: colors.textDefault}}>Vente</Typography>
                <Table>
                    <TableHead>
                        <TableRow sx={{background: colors.background}}>
                            <TableCell><Typography align="center" sx={{color: colors.primary}}>Produit</Typography></TableCell>
                            <TableCell><Typography align="center" sx={{color: colors.primary}}>Quantité</Typography></TableCell>
                            <TableCell><Typography align="center" sx={{color: colors.primary}}>Prix total</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {saleRows.map((row, index) => {
                    return (
                        <TableRow key={index}>
                            <TableCell><Typography align="center" sx={{color: colors.textDefault}}>{row.product.productName}</Typography></TableCell>
                            <TableCell><Typography align="center" sx={{color: colors.textDefault}}>{row.quantitySale}</Typography></TableCell>
                            <TableCell><Typography align="center" sx={{color: colors.textDefault}}>{row.priceSale}</Typography></TableCell>
                        </TableRow>
                    )
                })}
                <TableRow>
                    <TableCell><Typography align="center" sx={{color: colors.textDefault}}>Prix total</Typography></TableCell>
                    <TableCell sx={{textAlign: "center"}} colSpan={2}><Typography sx={{color: colors.textDefault}}>{totalPrice}</Typography></TableCell>
                </TableRow>
                    </TableBody>
                </Table>
            </Grid>
                    }
                    
                </Grid> 
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleSubmit} sx={{color: colors.textDefault, background: colors.primary, borderRadius: "20px"}}>Enregistrer</Button>
                <Button variant="outlined" onClick={handleCancel} sx={{borderRadius: "20px"}} >Annuler</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddSaleDialog;