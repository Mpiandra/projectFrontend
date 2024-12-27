import React, { useEffect } from "react";
import { Button, Divider, Fab, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Add, AddSharp } from "@mui/icons-material";
import { useState } from "react";
import AddToStockDialog from "./addToStockDialog";
import { CategoryWithStock, Employee } from "../../../Hooks/types";
import axiosInstance from "../../../axiosInstance";
import { groupStockProducts } from "../../../Hooks/useGroupData";
import { colors } from "../../../Colors";

const ProductStockList = () => {

    const [productStockData, setProductStockData] = useState<CategoryWithStock[]>([]);
    const [currentEmployee, setCurrentEmployee] = useState<Employee>();

    const [openAddToStock, setOpenAddToStock] = useState(false);

    const storedEmployee = localStorage.getItem("employee")

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

    const handleOpenAddToStock = () => {
        setOpenAddToStock(true);
    }

    const handleCloseAddToStock = () => {
        setOpenAddToStock(false);
    }

    return (
        <div>
            <AddToStockDialog open={openAddToStock}
                                handleClose={handleCloseAddToStock}
                                productStockData={productStockData} />

            <Fab onClick={handleOpenAddToStock} sx={{ display: "flex", position: "fixed", margin: 2, color: colors.neutral,background: colors.tertiary, bottom: 16, right: 16 }}>
                    <Add />
                </Fab>
            <Stack spacing={2} margin={2}>
            {productStockData.map((category) => {
                return (
                    <React.Fragment key={category.idCategory}>
                        
                        <Paper elevation={5} sx={{background: colors.background}}>
                        <Typography variant={"h4"} align="center" sx={{color: colors.secondary}}>{category.categoryName}</Typography>
                            {category.productTypes.map((productType) => {
                                return (
                                    <React.Fragment key={productType.idProductType}>
                                        <Typography variant="h5" color={colors.neutral}>{productType.productTypeName}</Typography>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{background: colors.secondary}}>
                                                    <TableCell align="center"><Typography variant="h6" sx={{color: colors.textDefault}}>Produit</Typography></TableCell>
                                                    <TableCell align="center"><Typography variant="h6" sx={{color: colors.textDefault}}>Quantité en stock</Typography></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {productType.products.map((product) => {
                                                    return (
                                                        <TableRow key={product.idProduct}>
                                                            <TableCell align="center">{product.productName}</TableCell>
                                                            <TableCell align="center">{product.quantityStock}</TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                        <Divider />
                                        
                                    </React.Fragment>
                                )
                            })}
                        </Paper>
                    </React.Fragment>
                    
                )
            })}
            </Stack>
            
        </div>
    )
}

export default ProductStockList;