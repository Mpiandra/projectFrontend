import React, { useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import MenuEmployee from "../../../Components/Employes/menuEmployee";
import { AddSharp } from "@mui/icons-material";
import { useState } from "react";
import AddToStockDialog from "./addToStockDialog";
import { CategoryWithStock, Employee } from "../../../Hooks/types";
import axiosInstance from "../../../axiosInstance";
import { groupStockProducts } from "../../../Hooks/useGroupData";

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
            <MenuEmployee />
            <AddToStockDialog open={openAddToStock}
                                handleClose={handleCloseAddToStock}
                                productStockData={productStockData} />

            <h2>Stock principal</h2>
            <Button variant="outlined" size="small" startIcon={<AddSharp />} onClick={handleOpenAddToStock}>Stock</Button>
            {productStockData.map((category) => {
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
                                                <TableCell>Produit</TableCell>
                                                <TableCell>Quantité en stock</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {productType.products.map((product) => {
                                                return (
                                                    <TableRow key={product.idProduct}>
                                                        <TableCell>{product.productName}</TableCell>
                                                        <TableCell>{product.quantityStock}</TableCell>
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
        </div>
    )
}

export default ProductStockList;