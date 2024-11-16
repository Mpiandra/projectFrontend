import { Button } from "@mui/material";
import MenuEmployee from "../../../Components/Employes/menuEmployee.tsx";
import { AddSharp } from "@mui/icons-material";
import { useEffect, useState } from "react";
import AddProductDialog from "./addProductDialog.tsx";
import { Category } from "../../../Hooks/types.ts";
import axiosInstance from "../../../axiosInstance.ts";
import { groupData } from "../../../Hooks/useGroupData.ts";

const ProductsList : React.FC = () => {
    const [openAddProductDialog, setOpenAddProductDialog] = useState(false);
    const [categoryDataList, setCategoryDataList] = useState<Category[]>([])
    //const [productDataList, setProductDataList] = useState<Product[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/categoryData');
                const data = response.data;
                
                const groupedData = groupData({data});

                // Mettez à jour l'état avec les données groupées
                setCategoryDataList(groupedData);

            } catch (error) {
                console.error('error : ' + error);
            }
        };
        fetchData();
    }, [])

    const handleOpenAddProduct = () => {
        setOpenAddProductDialog(true);
    }

    const handleCloseAddProduct = () => {
        setOpenAddProductDialog(false);
    }

    return (
        <div>
            <MenuEmployee />
            <AddProductDialog open={openAddProductDialog} categoryDataList={categoryDataList} handleClose={handleCloseAddProduct}/>
            <Button variant="outlined" size="small" startIcon={<AddSharp />} onClick={handleOpenAddProduct}>Produit</Button>
            
        </div>
    )
}
export default ProductsList