import React from "react";
import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Divider,
    Fab,
    IconButton,
    Paper,
    Stack,
    Tab,
    Tabs,
    Typography
} from "@mui/material";
import { Add, DeleteSharp, EditSharp } from "@mui/icons-material";
import { useEffect, useState } from "react";
import AddProductDialog from "./addProductDialog.tsx";
import { AllProductData, CategoryJoinProductType, ProductJoinProductAttribute } from "../../../Hooks/types.ts";
import axiosInstance from "../../../axiosInstance.ts";
import { groupData, transformToAllProductData } from "../../../Hooks/useGroupData.ts";
import EditProductDialog from "./editProduct.tsx";
import DeleteProductDialog from "./deleteProductDialog.tsx";
import { SnackbarProvider } from "notistack";
import Grid from "@mui/material/Grid2";
import { colors } from "../../../Colors/index.ts";

const ProductsList: React.FC = () => {
    const [openAddProductDialog, setOpenAddProductDialog] = useState(false);
    const [openEditProductDialog, setOpenEditProductDialog] = useState(false);
    const [openDeleteProductDialog, setOpenDeleteProductDialog] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState<ProductJoinProductAttribute>();

    const [categoryDataList, setCategoryDataList] = useState<CategoryJoinProductType[]>([]);
    const [productDataList, setProductDataList] = useState<AllProductData[]>([]);

    // State pour gérer les onglets par catégorie
    const [tabValues, setTabValues] = useState<{ [key: number]: number }>({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoryResponse, productResponse] = await Promise.all([
                    axiosInstance.get('/categoryData'),
                    axiosInstance.get('/productData')
                ]);

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

    const handleChangeTab = (categoryId: number, newValue: number) => {
        setTabValues((prev) => ({ ...prev, [categoryId]: newValue }));
    };

    const handleOpenAddProduct = () => {
        setOpenAddProductDialog(true);
    };

    const handleCloseAddProduct = () => {
        setOpenAddProductDialog(false);
    };

    const handleOpenEditProduct = (product: ProductJoinProductAttribute) => {
        setSelectedProduct(product);
        setOpenEditProductDialog(true);
    };

    const handleCloseEditProdut = () => {
        setOpenEditProductDialog(false);
    };

    const handleOpenDeleteProduct = (product: ProductJoinProductAttribute) => {
        setSelectedProduct(product);
        setOpenDeleteProductDialog(true);
    };

    const handleCloseDeleteProduct = () => {
        setOpenDeleteProductDialog(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <SnackbarProvider maxSnack={4}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right"
            }}>
            <AddProductDialog open={openAddProductDialog}
                categoryDataList={categoryDataList}
                handleClose={handleCloseAddProduct}
                productDataList={productDataList}
                setProductDataList={setProductDataList} />

            <EditProductDialog open={openEditProductDialog}
                handleClose={handleCloseEditProdut}
                selectedProduct={selectedProduct}
                categoryDataList={categoryDataList}
                productDataList={productDataList}
                setProductDataList={setProductDataList}
            />
            <DeleteProductDialog open={openDeleteProductDialog}
                handleClose={handleCloseDeleteProduct}
                selectedProduct={selectedProduct}
                productDataList={productDataList}
                setProductDataList={setProductDataList} />

            <Grid container spacing={1}>
                <Fab onClick={handleOpenAddProduct} sx={{ display: "flex", position: "fixed", margin: 2, color: colors.neutral }}>
                    <Add />
                </Fab>
                <Grid size={12}>
                    <Stack spacing={1}>
                        {productDataList.map((data, index) => {
                            const categoryTabValue = tabValues[data.idCategory] || 0; // Par défaut, sélectionne le premier onglet

                            return (
                                <Paper
                                    elevation={5}
                                    key={data.idCategory}
                                    sx={{
                                        padding: "10px",
                                        borderRadius: "50",
                                        background: colors.background
                                    }}
                                >
                                    <Typography variant="h2" align={"center"} sx={{
                                        color: colors.neutral
                                    }}>
                                        {data.categoryName}
                                    </Typography>
                                    <Tabs
                                        value={categoryTabValue}
                                        onChange={(event, newValue) => handleChangeTab(data.idCategory, newValue)}
                                        TabIndicatorProps={{
                                            style: {
                                                backgroundColor: colors.neutral,
                                                height: "4px",
                                            },
                                        }}
                                    >
                                        {data.productTypes.map((productType) => (
                                            <Tab
                                                sx={{
                                                    color: colors.neutral,
                                                    fontSize: "20px",
                                                    "&.Mui-selected": {
                                                        color: colors.primary,
                                                        fontWeight: "bold",
                                                    },
                                                }}
                                                key={productType.idProductType}
                                                label={productType.productTypeName}
                                            />
                                        ))}
                                    </Tabs>

                                    {data.productTypes.map((productType, ptIndex) => (
                                        <div
                                            role="tabpanel"
                                            hidden={categoryTabValue !== ptIndex}
                                            id={`simple-tabpanel-${ptIndex}`}
                                            aria-labelledby={`simple-tab-${ptIndex}`}
                                            key={productType.idProductType}
                                        >
                                            {categoryTabValue === ptIndex && (
                                                <Box sx={{ p: 3 }}>
                                                    <div key={ptIndex}>
                                                        <Stack direction="row" spacing={2}>
                                                            {productType.products.map((product) => (
                                                                product.idProduct && (
                                                                    <Card key={product.idProduct}
                                                                        sx={{
                                                                            width: 300,
                                                                            borderRadius: "25px",
                                                                        }}
                                                                        elevation={3}>
                                                                        <CardHeader
                                                                            sx={{
                                                                                textAlign: "center",
                                                                                minHeight: "70px",
                                                                                background: "#1F0318",
                                                                                color: colors.textDefault
                                                                            }}
                                                                            title={product.productName} />
                                                                        <Divider />
                                                                        <CardMedia
                                                                            component="img"
                                                                            image={`http://localhost:9000${product.imageUrl}`}
                                                                            alt={product.productName}
                                                                        />
                                                                        <Divider />
                                                                        <CardContent>
                                                                            {product.attributes.map((attribute) => (
                                                                                <p key={attribute.attributeId}>
                                                                                    {attribute.attributeName} : {attribute.attributeValue}
                                                                                </p>
                                                                            ))}
                                                                        </CardContent>
                                                                        <CardActions sx={{
                                                                            justifyContent: "space-around",
                                                                            padding: "10px"
                                                                        }}>
                                                                            {product.price} Ar
                                                                            <div>
                                                                                <IconButton
                                                                                    onClick={() => handleOpenEditProduct(product)}><EditSharp />
                                                                                </IconButton>
                                                                                <IconButton
                                                                                    color="error"
                                                                                    onClick={() => handleOpenDeleteProduct(product)}><DeleteSharp />
                                                                                </IconButton>
                                                                            </div>
                                                                        </CardActions>
                                                                    </Card>
                                                                )
                                                            ))}</Stack>
                                                    </div>
                                                </Box>
                                            )}
                                        </div>
                                    ))}
                                </Paper>
                            );
                        })}
                    </Stack>
                </Grid>
            </Grid>
        </SnackbarProvider>
    );
};

export default ProductsList;
