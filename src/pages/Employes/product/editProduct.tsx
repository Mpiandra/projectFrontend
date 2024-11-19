import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material"
import { AllProductData, CategoryJoinProductType, ProductAttributeJoinProduct, ProductJoinProductAttribute, ProductJoinProductType   } from "../../../Hooks/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import InputField from "../../../Components/Common/Input";
import axiosInstance from "../../../axiosInstance";

interface EditProductDialogProps {
    open: boolean;
    handleClose: () => void;
    selectedProduct: ProductJoinProductAttribute | undefined;
    categoryDataList: CategoryJoinProductType[];
    productDataList: AllProductData[];
    setProductDataList: Dispatch<SetStateAction<AllProductData[]>>;

}

const EditProductDialog: React.FC<EditProductDialogProps> = ({open, handleClose, selectedProduct, productDataList}) => {

    const [productName, setProductName] = useState<string>(selectedProduct?.productName || "");
    const [price, setPrice] = useState<string>("");
    const [imageFile, setImageFile] = useState<File>();

    const [newProductAttributes, setNewProductAttributes] = useState<ProductAttributeJoinProduct[]>([]);

     useEffect(() => {
        if(selectedProduct){
            setProductName(selectedProduct.productName);
            setPrice(selectedProduct.price.toString());

            const dynamicAttributes : ProductAttributeJoinProduct[] = [];
            selectedProduct.attributes.map((attribute) => {
                const attr = {
                    idAttribute: attribute.idAttribute,
                    attributeName : attribute.attributeName,
                    attributeValue: attribute.attributeValue
                }
                dynamicAttributes.push(attr);
                
            })
            setNewProductAttributes(dynamicAttributes);
        }
        console.log(selectedProduct);
        
     }, [selectedProduct])



    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.value && e.target.files && e.target.files.length > 0){
            setImageFile(e.target.files[0]);
            console.log(e.target.files[0]);
            
        }
    }

    const handleChangeInput = (index: number, idAttribute: number, attributeName: string, value: string) => {
        const updateAttributes = [...newProductAttributes];
        updateAttributes[index] = {
            idAttribute: idAttribute,
            attributeName: attributeName,
            attributeValue: value
        };
        
        setNewProductAttributes(updateAttributes);
    }

    const handleEditProduct = async() => {
        const newProduct : ProductJoinProductType= {
            productName : productName,
            price: price
        }

        try{
            const formData = new FormData();
            formData.append("product", JSON.stringify(newProduct))
            if(imageFile){
                formData.append("imageFile", imageFile)
            }
            const updatedProductResponse = await axiosInstance.put(`/product/${selectedProduct?.idProduct}`, formData);
            
            await axiosInstance.put('productAttributes', newProductAttributes);

            productDataList.map((category) => {
                category.productTypes.map((productType) => {
                    productType.products.map((product) => {
                        if(product.idProduct === selectedProduct?.idProduct){
                            product.imageUrl = updatedProductResponse.data.imageUrl;
                            product.price = updatedProductResponse.data.price;
                            product.productName = updatedProductResponse.data.productName;
                            product.attributes = newProductAttributes
                        }
                    })
                })
            })
            handleClose();
        }catch(error){
            console.error('error : ', error);
        }
    }


    return (
        <Dialog
                open={open}
                onClose={handleClose}
                maxWidth={'lg'}
                fullWidth
        >
            <DialogTitle>Modifier le produit {selectedProduct?.productName}</DialogTitle>
            <DialogContent>
                <Stack direction="column"
                        spacing={2}>
                            <InputField type="text"
                                        label="Nom du produit"
                                        value={productName}
                                        onChange={setProductName} />

                            <TextField type="file"
                                        label="Image"
                                        variant="outlined"
                                        onChange={handleChangeImage} />
                            
                            <InputField type="number"
                                        label="Prix"
                                        value={price}
                                        onChange={(e) => setPrice(e)} />
                            
                                        
                        
                            {newProductAttributes.map((attribute, index) => {
                                return (
                                    <InputField key={index} type="text"
                                                label={attribute.attributeName}
                                                value={attribute.attributeValue}
                                                onChange={(value: string) => handleChangeInput(index, attribute.idAttribute, attribute.attributeName, value)} />
                                )
                            })}

                </Stack>
            </DialogContent>

            <DialogActions>
                <Button variant="outlined" onClick={handleEditProduct}>Envoyer</Button>
                <Button variant="outlined" onClick={handleClose}>Annuler</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditProductDialog;