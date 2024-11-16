import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance.ts";
import {Button, ButtonGroup, Stack} from "@mui/material";
import MenuEmployee from "../../../Components/Employes/menuEmployee.tsx";
import {AddSharp, DeleteSharp, EditSharp} from "@mui/icons-material";
import EditCategoryDialog from "./editCategory.tsx";
import DeleteCategoryDialog from "./deleteCategory.tsx";
import AddCategoryDialog from "./addCategoryDialog.tsx";
import AddProductTypeandAttributes from "./addProductTypeandAttributes.tsx";
import { Category } from "../../../Hooks/types.ts";
import { groupData} from "../../../Hooks/useGroupData.ts";

// Types

const CategoryList: React.FC = () => {

    const [openEditCategoryDialog, setOpenEditCategoryDialog] = useState(false)
    const [openDeleteCategoryDialog, setOpenDeleteCategoryDialog] = useState(false)
    const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);
    const [openAddProductTypeDialog, setOpenAddProductTypeDialog] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    const handleCloseCategoryEdit= () => {
        setOpenEditCategoryDialog(false);
    }

    const handleOpenCategoryEdit = (category : Category) => {
        setSelectedCategory(category);
        setOpenEditCategoryDialog(true);
    }

    const handleCloseCategoryDelete = () => {
        setOpenDeleteCategoryDialog(false);
    }
    
    const handleOpenCategoryDelete = (category : Category) => {
        setSelectedCategory(category);
        setOpenDeleteCategoryDialog(true);
    }

    const handleOpenAddCategory = () => {
        setOpenAddCategoryDialog(true)
    };

    const handleCloseAddCategory = () => {
        setOpenAddCategoryDialog(false)
    }

    const handleOpenAddProductType = (category: Category) => {
        setSelectedCategory(category);
        setOpenAddProductTypeDialog(true);
    }

    const handleCloseAddProductType = () => {
        setOpenAddProductTypeDialog(false);
    }

    const [categoryDataList, setCategoryDataList] = useState<Category[]>([]);

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
    }, []);

    return (
        <div>
            <MenuEmployee />
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

            {categoryDataList.map((category, index) => {
                return (
                    <div key={index}>
                        <Stack
                            direction={"row"}
                            spacing={6}
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
                                    <li key={productType.idProductType}>{productType.productTypeName}</li>
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
        </div>
    );
};

export default CategoryList;
