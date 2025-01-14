import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance.ts";
import {ButtonGroup, Fab, IconButton, Paper, Stack, TableBody, Table, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {Add, AddSharp, DeleteSharp, EditSharp} from "@mui/icons-material";
import EditCategoryDialog from "./editCategory.tsx";
import DeleteCategoryDialog from "./deleteCategory.tsx";
import AddCategoryDialog from "./addCategoryDialog.tsx";
import AddProductTypeandAttributes from "./addProductTypeandAttributes.tsx";
import { CategoryJoinProductType, ProductTypeJoinProductTypeAttribute } from "../../../Hooks/types.ts";
import { groupData} from "../../../Hooks/useGroupData.ts";
import { SnackbarProvider } from "notistack";
import DeleteProductType from "./deleteProductType.tsx";
import { colors } from "../../../Colors/index.ts";
import '@fontsource/roboto/300.css';

// Types

const CategoryList: React.FC = () => {

    const [openEditCategoryDialog, setOpenEditCategoryDialog] = useState(false)
    const [openDeleteCategoryDialog, setOpenDeleteCategoryDialog] = useState(false)
    const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);
    const [openAddProductTypeDialog, setOpenAddProductTypeDialog] = useState(false);
    const [openDeleteProductTypeDialog, setOpenDeleteProductTypeDialog] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<CategoryJoinProductType | null>(null)
    const [selectedProductType, setSelectedProductType] = useState<ProductTypeJoinProductTypeAttribute | null>(null)

    const handleCloseCategoryEdit= () => {
        setOpenEditCategoryDialog(false);
    }

    const handleOpenCategoryEdit = (category : CategoryJoinProductType) => {
        setSelectedCategory(category);
        setOpenEditCategoryDialog(true);
    }

    const handleOpenDeleteProductType = (productType: ProductTypeJoinProductTypeAttribute) => {
        setSelectedProductType(productType);
        setOpenDeleteProductTypeDialog(true);
    }

    const handleCloseDeleteProductType = () => {
        setOpenDeleteProductTypeDialog(false);
    }

    const handleCloseCategoryDelete = () => {
        setOpenDeleteCategoryDialog(false);
    }
    
    const handleOpenCategoryDelete = (category : CategoryJoinProductType) => {
        setSelectedCategory(category);
        setOpenDeleteCategoryDialog(true);
    }

    const handleOpenAddCategory = () => {
        setOpenAddCategoryDialog(true)
    };

    const handleCloseAddCategory = () => {
        setOpenAddCategoryDialog(false)
    }

    const handleOpenAddProductType = (category: CategoryJoinProductType) => {
        setSelectedCategory(category);
        setOpenAddProductTypeDialog(true);
    }

    const handleCloseAddProductType = () => {
        setOpenAddProductTypeDialog(false);
    }

    const [categoryDataList, setCategoryDataList] = useState<CategoryJoinProductType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/categoryData');
                console.log(response)
                const data = response.data;
                
                console.log(data)
                const groupedData = groupData({data});
                console.log(groupedData);

                // Mettez à jour l'état avec les données groupées
                setCategoryDataList(groupedData);

            } catch (error) {
                console.error('error : ' + error);
            }
        };
        fetchData();
    }, []);

    return (
        <SnackbarProvider>  
            <Fab onClick={handleOpenAddCategory} sx={{ display: "flex", position: "fixed", margin: 2, color: colors.neutral,background: colors.tertiary, bottom: 16, right: 16 }}>
                    <Add />
                </Fab>
            <EditCategoryDialog open={openEditCategoryDialog}
                                handleClose={handleCloseCategoryEdit}
                                idCategory={selectedCategory?.idCategory}
                                oldCategoryName={selectedCategory?.categoryName}
                                setCategoryDataList={setCategoryDataList}
                                categoryDataList={categoryDataList} />

            <DeleteCategoryDialog open={openDeleteCategoryDialog}
            categoryDataList={categoryDataList}
            setCategoryDataList={setCategoryDataList}
                                  handleClose={handleCloseCategoryDelete}
                                  idCategory={selectedCategory?.idCategory}
                                  categoryName={selectedCategory?.categoryName} />
            <AddCategoryDialog open={openAddCategoryDialog}
                                categoryDataList={categoryDataList}
                                setCategoryDataList={setCategoryDataList}
                               handleClose={handleCloseAddCategory}
            />
            <AddProductTypeandAttributes open={openAddProductTypeDialog}
                                         handleClose={handleCloseAddProductType}
                                         idCategory={selectedCategory?.idCategory}
                                         categoryName={selectedCategory?.categoryName}
                                         categoryDataList={categoryDataList}
                                         setCategoryDataList={setCategoryDataList}
            />
            <DeleteProductType open={openDeleteProductTypeDialog}
                                handleClose={handleCloseDeleteProductType}
                                idProductType={selectedProductType?.idProductType}
                                categoryDataList={categoryDataList}
                                setCategoryDataList={setCategoryDataList} />

            <Stack spacing={5}>
            {categoryDataList.map((category, index) => {
                return (
                    <div key={index}>
                        <Stack
                            direction={"row"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                        >
                            <Typography variant="h4" align="center" sx={{color: colors.primary}}>{category.categoryName}</Typography>
                            <ButtonGroup variant={"text"}>
                                <IconButton onClick={() => handleOpenCategoryEdit(category)}>{<EditSharp />}</IconButton>
                                <IconButton onClick={() => handleOpenCategoryDelete(category)}>{<DeleteSharp />}</IconButton>
                                <IconButton onClick={() => handleOpenAddProductType(category)}><AddSharp /></IconButton>
                            </ButtonGroup>
                        </Stack>
                        {category.productTypes.length > 0 ? 
                        <TableContainer component={Paper} sx={{background: colors.background}}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{background: colors.primary}}>
                                    <TableCell><Typography variant="h6" sx={{color: colors.textDefault}}>Type de produit</Typography></TableCell>
                                    <TableCell><Typography variant="h6" sx={{color: colors.textDefault}}>Attribut</Typography></TableCell>
                                    <TableCell><Typography variant="h6" sx={{color: colors.textDefault}}>Options</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {category.productTypes.map((productType) => {
                                    return productType.attributes.map((attribute, attributeIndex) => {
                                        return (
                                            <TableRow key={`${productType.idProductType}-${attributeIndex}`}>
                                                {attributeIndex === 0 && (
                                                    <TableCell rowSpan={productType.attributes.length}>
                                                        {productType.productTypeName}
                                                    </TableCell>
                                                )}
                                                <TableCell>{attribute.attributeName}</TableCell>
                                                {attributeIndex===0 && (
                                                    <TableCell rowSpan={productType.attributes.length} sx={{justifyContent:"center"}}>
                                                        <IconButton onClick={() => handleOpenDeleteProductType(productType)}><DeleteSharp /></IconButton>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        );
                                    });
                                })}
                            </TableBody>

                        </Table>
                    </TableContainer> : null}  
                    </div>

                )
            })}
            </Stack>
        </SnackbarProvider>
    );
};  

export default CategoryList;
