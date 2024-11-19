import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl,  InputLabel, ListSubheader, MenuItem, Select, SelectChangeEvent, Stack, TextField } from "@mui/material";
import { CategoryJoinProductType, ProductJoinProductType, ProductAttributeJoinProduct, ProductTypeJoinProductTypeAttribute, AllProductData, ProductTypeAttribute } from "../../../Hooks/types";
import React, { Dispatch, SetStateAction, useState } from "react";
import InputField from "../../../Components/Common/Input";
import axiosInstance from "../../../axiosInstance";
import { transformCategoryArray, transformToAllProductData } from "../../../Hooks/useGroupData";

interface AddProductProps {
    open: boolean;
    categoryDataList: CategoryJoinProductType[];
    handleClose: () => void;
    productDataList: AllProductData[];
    setProductDataList: Dispatch<SetStateAction<AllProductData[]>>
}

const AddProductDialog: React.FC<AddProductProps> = ({ open, categoryDataList, handleClose, productDataList, setProductDataList }) => {
    const [selectedProductType, setSelectedProductType] = useState<ProductTypeJoinProductTypeAttribute | null>(null)
    const [selectedProductTypeId, setSelectedProductTypeId] = useState<number | "">("");

    const [productName, setProductName] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);


    const [productAttributes, setProductAttributes] = useState<ProductAttributeJoinProduct[]>([]);


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
        console.log(selectedProductType);
        
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


        try{
            const formData = new FormData();
            formData.append("product", JSON.stringify(newProduct));
            if(imageFile){
                formData.append("imageFile", imageFile)
            }
            
            const productResponse = await axiosInstance.post("/product", formData);
            console.log("productResponse : ",productResponse);
    
            productAttributes.map((productAttribute) => {
                productAttribute.product = productResponse.data
            })
            
            const productAttributesResponse =  await axiosInstance.post("/productAttributes", productAttributes)
            console.log("productAttributesResponse : ", productAttributesResponse)

            console.log(productResponse.data.productType.category.idCategory);

            
            const list = [];

            productAttributesResponse.data.map((attribute) => {
                const pr = {
                    idCategory: productResponse.data.productType.category.idCategory,
                    categoryName: productResponse.data.productType.category.categoryName,
                    idproductType: productResponse.data.productType.idProductType,
                    productTypeName: productResponse.data.productType.productTypeName,
                    idProduct: productResponse.data.idProduct,
                    price: productResponse.data.price,
                    productName: productResponse.data.productName,
                    imageUrl: productResponse.data.imageUrl,
                    idAttribute: attribute.idAttribute,
                    attributeName: attribute.attributeName,
                    attributeValue: attribute.attributeValue

                }

                list.push(pr);
            })
            
            const newPr = transformToAllProductData(list);
            
            setProductDataList([...productDataList, ...newPr]);
    
        } catch(error){
            console.error(error);
        }

       
        handleClose();
        
    }

    const handleChangeInput = (index: number, attributeName: string, value: string, productTypeAttribute: ProductTypeAttribute) => {
        productAttributes[index] = {
            attributeName: attributeName,
            attributeValue: value,
            productTypeAttribute: productTypeAttribute
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
                                onChange={(value: string) => handleChangeInput(index, attribute.attributeName, value, attribute)}
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
                <Button variant="outlined" onClick={handleClose}>Annuler</Button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default AddProductDialog;
