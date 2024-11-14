import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import {Button, ButtonGroup, Stack} from "@mui/material";
import MenuEmployee from "../../Components/Employes/menuEmployee.tsx";
import {AddSharp, DeleteSharp, EditSharp} from "@mui/icons-material";
import EditCategoryDialog from "./editCategory.tsx";
import DeleteCategoryDialog from "./deleteCategory.tsx";
import AddCategoryDialog from "./addCategoryDialog.tsx";
import AddProductTypeandAttributes from "./addProductTypeandAttributes.tsx";

// Types
type Attribute = {
    attributeId: number;
    attributeName: string;
    attributeType: string;
};

type ProductType = {
    idProductType: number;
    productTypeName: string;
    attributes: Attribute[];
};

type Category = {
    idCategory: number;
    categoryName: string;
    productTypes: ProductType[];
};

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
    // Initialiser l'état avec un tableau vide de type Category[]
    const [categoryDataList, setCategoryDataList] = useState<Category[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/categoryData');
                console.log(response);
                const data = response.data;

                // Groupement des données
                const groupedData: Category[] = data.reduce((acc: Category[], item: any) => {
                    // Cherche ou crée une catégorie
                    let category = acc.find(c => c.idCategory === item.idCategory);
                    if (!category) {
                        category = {
                            idCategory: item.idCategory,
                            categoryName: item.categoryName,
                            productTypes: [],
                        };
                        acc.push(category);
                    }

                    // Vérifie si idProductType n'est pas null
                    if (item.idProductType !== null) {
                        let productType = category.productTypes.find(pt => pt.idProductType === item.idProductType);
                        if (!productType) {
                            // Corriger ici : utilisez item.idProductType au lieu de item.productType
                            productType = {
                                idProductType: item.idProductType, // Correction ici
                                productTypeName: item.productTypeName,
                                attributes: [],
                            };
                            category.productTypes.push(productType);
                        }

                        // Ajout des attributs si attributeId est valide
                        if (item.attributeId !== null) {
                            productType.attributes.push({
                                attributeId: item.attributeId,
                                attributeName: item.attributeName,
                                attributeType: item.attributeType,
                            });
                        }
                    }

                    return acc;

                }, []);

                // Mettez à jour l'état avec les données groupées
                setCategoryDataList(groupedData);

                console.log(groupedData);
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
