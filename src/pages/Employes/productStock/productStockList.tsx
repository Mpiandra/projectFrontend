import React, { useEffect } from "react";
import { Button, Divider, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { AddSharp } from "@mui/icons-material";
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

            <Typography variant="h3" align="center">Stock</Typography>
            <Button variant="outlined" size="small" startIcon={<AddSharp />} onClick={handleOpenAddToStock}>Stock</Button>
            {productStockData.map((category) => {
                return (
                    <React.Fragment key={category.idCategory}>
                        <Typography variant={"h4"} align="center" sx={{color: colors.neutral}}>{category.categoryName}</Typography>
                        <Paper elevation={5}>
                            {category.productTypes.map((productType) => {
                                return (
                                    <React.Fragment key={productType.idProductType}>
                                        <Typography variant="h5" align="center">{productType.productTypeName}</Typography>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center">Produit</TableCell>
                                                    <TableCell align="center">Quantité en stock</TableCell>
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
        </div>
    )
}

export default ProductStockList;