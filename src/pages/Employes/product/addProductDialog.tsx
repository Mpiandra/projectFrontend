import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl,  InputLabel, ListSubheader, MenuItem, Select, SelectChangeEvent, Stack, TextField } from "@mui/material";
import { CategoryJoinProductType, ProductJoinProductType, ProductTypeJoinProductTypeAttribute, AllProductData, ProductAttribute, ProductJoinProductAttribute, Attribute, ProductStockPosted, PointOfSale } from "../../../Hooks/types";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import InputField from "../../../Components/Common/Input";
import axiosInstance from "../../../axiosInstance";
import { transformCategoryArray } from "../../../Hooks/useGroupData";
import { useSnackbar } from "notistack";
import { AxiosResponse } from "axios";

interface AddProductProps {
    open: boolean;
    categoryDataList: CategoryJoinProductType[];
    handleClose: () => void;
    productDataList: AllProductData[];
    setProductDataList: Dispatch<SetStateAction<AllProductData[]>>;
}

const AddProductDialog: React.FC<AddProductProps> = ({ open, categoryDataList, handleClose, productDataList }) => {
    const [selectedProductType, setSelectedProductType] = useState<ProductTypeJoinProductTypeAttribute | null>(null)
    const [selectedProductTypeId, setSelectedProductTypeId] = useState<number | "">("");

    const [productName, setProductName] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    const { enqueueSnackbar } = useSnackbar();

    const resetForm = () => {
        setSelectedProductType(null);
        setSelectedProductTypeId("");
        setProductName("");
        setPrice("");
    }

    const handleCancel = () => {
        resetForm();
        handleClose();
    }

    useEffect(() => {
        if(categoryDataList){
            console.log("cateogryDataList",categoryDataList);
            
        }
    }, [categoryDataList])

    const [productAttributes, setProductAttributes] = useState<Attribute[]>([]);


    const handleChange = (event: SelectChangeEvent<number>) => {
        const value = event.target.value as number;
        setSelectedProductTypeId(value);
        const newObj = categoryDataList
        .reduce((acc, category) => acc.concat(category.productTypes), [] as ProductTypeJoinProductTypeAttribute[])
        .find((productType) => productType.idProductType === value) || null;
        
        
        setSelectedProductType(newObj);
    }

    const menuItems = categoryDataList.flatMap((category) => [
        <ListSubheader key={`header-${category.idCategory}`}>{category.categoryName}</ListSubheader>,
        ...category.productTypes.map((productType) => (
            <MenuItem key={productType.idProductType} value={productType.idProductType}>
                {productType.productTypeName}
            </MenuItem>
        )),
    ]);

    const handleAddProduct = async() => {

        try{
            if(productName !== "" && price !== ""){
                let productAttributesResponse: AxiosResponse<ProductAttribute[]> | null = null;

                const list = transformCategoryArray(categoryDataList);

                const pType = list.filter((productType) => {
                    if(productType.idProductType === selectedProductType?.idProductType){
                        return true;
                    }
                })
                
                console.log("pType : ", pType)

                const newProduct: ProductJoinProductType = {
                    productName: productName,
                    price: price,
                    productType: pType[0]
                }
            
                const formData = new FormData();
                formData.append("product", JSON.stringify(newProduct));
                if(imageFile){
                    formData.append("imageFile", imageFile)
                }
                
                const productResponse = await axiosInstance.post("/product", formData);
                console.log("productResponse : ",productResponse);
        
                productAttributes.map((productAttribute) => {
                    productAttribute.idParent = productResponse.data.idProduct;
                })
                
                console.log(productAttributes);
                try{
                    const addedproduct: ProductJoinProductAttribute = productResponse.data;
                    productAttributesResponse =  await axiosInstance.post("/attributes", productAttributes)
                    console.log("productAttributesResponse : ", productAttributesResponse)

                    const getPointOfSales = await axiosInstance.get("/pointOfSales")
                    const newPStockList : ProductStockPosted[] = [];
                    getPointOfSales.data.map((pos: PointOfSale) => {
                        const newPStock: ProductStockPosted = {
                            quantityStock: 0,
                            product: addedproduct,
                            pointOfSale: pos
                        }

                        newPStockList.push(newPStock);
                    })

                    newPStockList.push({
                        quantityStock: 0,
                        product: addedproduct,
                        pointOfSale: null
                    })

                    const addStockResponse = await axiosInstance.post("/productStocks", newPStockList);
                    console.log("addStockResponse : ", addStockResponse);
                    

                } catch(error){
                    await axiosInstance.delete('/product', productResponse.data);
                    enqueueSnackbar(`Echec de l'ajout du produit : ${error}`, {variant: "error"})
                }
                

                const pr : ProductJoinProductAttribute = {

                    idProduct: productResponse.data.idProduct,
                    price: productResponse.data.price,
                    productName: productResponse.data.productName,
                    imageUrl: productResponse.data.imageUrl,
                    attributes: []
                }

                productAttributesResponse?.data.map((attribute : ProductAttribute) => {
                    pr.attributes.push(attribute);
                })

                
                productDataList.map((category) => {
                    category.productTypes.map((productType ) => {
                        if(productType.idProductType === productResponse.data.productType.idProductType){
                                productType.products.push(pr);
                        }
                    })
                    
                })

                console.log("productDataList",productDataList);
                

                
                enqueueSnackbar("Le produit a été ajouté avec succès", {variant: "success"});
                resetForm();
                handleClose();
    
            } else {
                enqueueSnackbar("Veuillez remplir tous les champs, s'il vous plait.", {variant: "warning"});
            }
        } catch(error){
            enqueueSnackbar(`Echec de l'ajout du produit : ${error}`, {variant: "error"});
        }

        
    }

    const handleChangeInput = (index: number, attributeName: string, value: string, attributeType: string) => {
        productAttributes[index] = {
            attributeName: attributeName,
            attributeValue: value,
            attributeType: attributeType,
            parent: "product"
        };
        
        setProductAttributes(productAttributes);
    }

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.value && e.target.files && e.target.files.length > 0){
            setImageFile(e.target.files[0]);
            console.log(e.target.files[0]);
            
        }
    }

    return (
        <>
        <Dialog open={open} maxWidth="lg" fullWidth onClose={handleClose}>
            <DialogTitle>Ajouter un produit</DialogTitle>
            <DialogContent>
                <FormControl fullWidth id="my-form">
                    <Stack direction={"column"}
                            spacing={2}
                    >
                        <InputLabel htmlFor="group-select">Type de produit</InputLabel>
                        <Select
                            id="group-select"
                            label="Type de produit"
                            value={selectedProductTypeId || ""}
                            onChange={handleChange}
                            required
                        >
                            {menuItems}
                        </Select>
                        <InputField type="text" 
                                    name="productName"
                                    label="Nom du produit"
                                    value={productName}
                                    onChange={setProductName} /> 

                        <TextField type="file"
                                    label="Image"
                                    onChange={handleChangeImage}
                                    required
                        />

                        <InputField type="number" 
                                    name="productName"
                                    label="Prix"
                                    value={price} 
                                    onChange={setPrice}/>

                        {selectedProductType?.attributes.map((attribute, index) => {
                            return (
                                <InputField key={attribute.attributeId} 
                                index={index}
                                onChange={(value: string) => handleChangeInput(index, attribute.attributeName, value, attribute.attributeType)}
                                            type={attribute.attributeType} 
                                            label={attribute.attributeName} 
                                required/>

                            )
                        })}

                    </Stack>
                    
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleAddProduct}>Ajouter</Button>
                <Button variant="outlined" onClick={handleCancel}>Annuler</Button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default AddProductDialog;
