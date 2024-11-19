import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Stack } from "@mui/material";
import MenuEmployee from "../../../Components/Employes/menuEmployee.tsx";
import { AddSharp, DeleteSharp, EditSharp } from "@mui/icons-material";
import { useEffect, useState } from "react";
import AddProductDialog from "./addProductDialog.tsx";
import { AllProductData, CategoryJoinProductType, ProductJoinProductAttribute } from "../../../Hooks/types.ts";
import axiosInstance from "../../../axiosInstance.ts";
import { groupData, transformToAllProductData } from "../../../Hooks/useGroupData.ts";
import EditProductDialog from "./editProduct.tsx";

const ProductsList: React.FC = () => {
    const [openAddProductDialog, setOpenAddProductDialog] = useState(false);
    const [openEditProductDialog, setOpenEditProductDialog] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState<ProductJoinProductAttribute>();

    const [categoryDataList, setCategoryDataList] = useState<CategoryJoinProductType[]>([]);
    const [productDataList, setProductDataList] = useState<AllProductData[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoryResponse, productResponse] = await Promise.all([
                    axiosInstance.get('/categoryData'),
                    axiosInstance.get('/productData')
                ]);
                 console.log(productResponse.data);
                 

                setCategoryDataList(groupData({ data: categoryResponse.data }));
                setProductDataList(transformToAllProductData(productResponse.data));

            } catch (err) {
                console.error(err);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        console.log(productDataList);
        
    }, [productDataList])

    const handleOpenAddProduct = () => {
        setOpenAddProductDialog(true);
    };

    const handleCloseAddProduct = () => {
        setOpenAddProductDialog(false);
    };

    const handleOpenEditProduct = (product: ProductJoinProductAttribute) => {
        setSelectedProduct(product);
        setOpenEditProductDialog(true);
    }

    const handleCloseEditProdut = () => {
        setOpenEditProductDialog(false);
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    

    return (
        <div>
            <MenuEmployee />
            <AddProductDialog open={openAddProductDialog}
                              categoryDataList={categoryDataList}
                              handleClose={handleCloseAddProduct} 
                              productDataList={productDataList} 
                              setProductDataList={setProductDataList} />

            <EditProductDialog open={openEditProductDialog} 
                                handleClose={handleCloseEditProdut}
                                selectedProduct={selectedProduct}
                                categoryDataList={categoryDataList}
            />

            <Button variant="outlined" size="small" startIcon={<AddSharp />} onClick={handleOpenAddProduct}>Produit</Button>

            {productDataList.map((data, index) => (
                <div key={index}>
                    <h2>{data.categoryName}</h2>
                    {data.productTypes.map((productType, ptIndex) => {
                        
                        return (
                            <div key={ptIndex}>
                                <h4>{productType.productTypeName}</h4>
                                <Stack direction="row" spacing={2}>
                                {
                                    productType.products.map((product) => {
                                        return (
                                            product.idProduct && (
                                                    <Card key={product.idProduct}
                                                        sx={{ maxWidth: 345 }}>
                                                        <CardHeader title={product.productName} />
                                                        <CardMedia component="img"
                                                                height="194"
                                                                image={`http://localhost:9000${product.imageUrl}`}
                                                                alt={product.productName}
                                                        />
                                                        <CardContent>
                                                            <p>Prix : {product.price}</p>
                                                            {product.attributes.map((attribute) => {
                                                                return (
                                                                    <p key={attribute.idAttribute}>{attribute.attributeName} : {attribute.attributeValue}</p>
                                                                )
                                                            })}
                                                        </CardContent>
                                                        <CardActions>
                                                            <IconButton onClick={() => handleOpenEditProduct(product)}><EditSharp /></IconButton>
                                                            <IconButton><DeleteSharp /></IconButton>
                                                        </CardActions>
                                                </Card>
                                            )
                                        )
                                    })
                                }</Stack>
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    );
};

export default ProductsList;
