import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl,  InputLabel, ListSubheader, MenuItem, Select, SelectChangeEvent, Stack, TextField } from "@mui/material";
import { Category, Product, ProductAttribute, ProductType } from "../../../Hooks/types";
import React, { useState } from "react";
import InputField from "../../../Components/Common/Input";
import axiosInstance from "../../../axiosInstance";
import { transformCategoryArray } from "../../../Hooks/useGroupData";

interface AddProductProps {
    open: boolean;
    categoryDataList: Category[];
    handleClose: () => void;
}

const AddProductDialog: React.FC<AddProductProps> = ({ open, categoryDataList, handleClose }) => {
    const [selectedProductType, setSelectedProductType] = useState<ProductType | null>(null)
    const [selectedProductTypeId, setSelectedProductTypeId] = useState<number | "">("");

    const [productName, setProductName] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [productAttributes, setProductAttributes] = useState<ProductAttribute[]>([]);


    const handleChange = (event: SelectChangeEvent<number>) => {
        const value = event.target.value as number;
        setSelectedProductTypeId(value);
        const newObj = categoryDataList
        .reduce((acc, category) => acc.concat(category.productTypes), [] as ProductType[])
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

        const newProduct: Product = {
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
            
            for (const pair of formData.entries()) {
                if (pair[1] instanceof File) {
                    console.log(`Clé : ${pair[0]}`);
                    console.log(`Nom du fichier : ${pair[1].name}`);
                    console.log(`Taille du fichier : ${pair[1].size} octets`);
                    console.log(`Type MIME : ${pair[1].type}`);
                } else {
                    console.log(`Clé : ${pair[0]}, Valeur : ${pair[1]}`);
                }
            }
            
            
    
            const response = await axiosInstance.post("/product", formData);
    
            productAttributes.map((productAttribute) => {
                productAttribute.product = response.data
            })
            
            await axiosInstance.post("/productAttributes", productAttributes)
    
        } catch(error){
            console.error(error);
        }

       
        handleClose();
        
    }

    const handleChangeInput = (index: number, attributeName: string, value: string) => {
        productAttributes[index] = {
            attributeName: attributeName,
            attributeValue: value
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
        <h1>{selectedProductType?.productTypeName ?? ""}</h1>
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

                        <InputField type="text" 
                                    name="productName"
                                    label="Prix"
                                    value={price} 
                                    onChange={setPrice}/>

                        {selectedProductType?.attributes.map((attribute, index) => {
                            return (
                                <InputField key={attribute.attributeId} 
                                index={index}
                                onChange={(value: string) => handleChangeInput(index, attribute.attributeName, value)}
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
