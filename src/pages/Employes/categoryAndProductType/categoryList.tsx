import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance.ts";
import {Button, ButtonGroup, IconButton, Stack} from "@mui/material";
import {AddSharp, DeleteSharp, EditSharp} from "@mui/icons-material";
import EditCategoryDialog from "./editCategory.tsx";
import DeleteCategoryDialog from "./deleteCategory.tsx";
import AddCategoryDialog from "./addCategoryDialog.tsx";
import AddProductTypeandAttributes from "./addProductTypeandAttributes.tsx";
import { CategoryJoinProductType, ProductTypeJoinProductTypeAttribute } from "../../../Hooks/types.ts";
import { groupData} from "../../../Hooks/useGroupData.ts";
import { SnackbarProvider } from "notistack";
import DeleteProductType from "./deleteProductType.tsx";

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
            <Button variant="outlined" size="small" onClick={handleOpenAddCategory} startIcon={<AddSharp />}>Catégorie</Button>
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

            {categoryDataList.map((category, index) => {
                return (
                    <div key={index}>
                        <Stack
                            direction={"row"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                        >
                            <h2>{category.categoryName}</h2>
                            <ButtonGroup variant={"text"}>
                                <Button startIcon={<EditSharp />} size={"small"} onClick={() => handleOpenCategoryEdit(category)}>Modifier</Button>
                                <Button startIcon={<DeleteSharp />} size={"small"} onClick={() => handleOpenCategoryDelete(category)}>Supprimer</Button>
                            </ButtonGroup>
                            <Button variant={"outlined"} size={"small"} startIcon={<AddSharp />} onClick={() => handleOpenAddProductType(category)}>Type</Button>
                        </Stack>
                        {category.productTypes.map((productType, index) => {
                            return(
                                <ul key={index}>
                                    <li key={productType.idProductType}>
                                        <Stack direction={"row"}
                                                justifyContent={"space-between"}
                                                alignItems={"center"}>
                                                    {productType.productTypeName}
                                                    <IconButton onClick={() => handleOpenDeleteProductType(productType)}><DeleteSharp/></IconButton>
                                        </Stack>
                                    </li>
                                    {productType.attributes.map((attribute, index) => {
                                        return(
                                            <ul key={index}>
                                                <li key={attribute.attributeId}>{attribute.attributeName}</li>
                                            </ul>
                                        )
                                    })}
                                </ul>
                            )
                        })}
                    </div>

                )
            })}
        </SnackbarProvider>
    );
};  

export default CategoryList;
