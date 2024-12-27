import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material"
import { AllProductData, Attribute, CategoryJoinProductType, ProductJoinProductAttribute, ProductJoinProductType   } from "../../../Hooks/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import InputField from "../../../Components/Common/Input";
import axiosInstance from "../../../axiosInstance";
import { useSnackbar } from "notistack";
import { colors } from "../../../Colors";

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

    const [newProductAttributes, setNewProductAttributes] = useState<Attribute[]>([]);

    const {enqueueSnackbar} = useSnackbar();

     useEffect(() => {
        if(selectedProduct){
            setProductName(selectedProduct.productName);
            setPrice(selectedProduct.price.toString());
            console.log(selectedProduct)

            const dynamicAttributes : Attribute[] = [];
            selectedProduct.attributes.map((attribute) => {
                console.log("attributeID : ", attribute.attributeId)
                const attr = {
                    attributeId: attribute.attributeId,
                    attributeName : attribute.attributeName,
                    attributeValue: attribute.attributeValue,
                    attributeType: attribute.attributeType,
                    parent : attribute.parent,
                    idParent: attribute.idParent
                }
                dynamicAttributes.push(attr);
                
            })
            console.log(dynamicAttributes);
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

    const handleChangeInput = (index: number, idAttribute: number | undefined, attributeName: string, value: string, attributeType: string) => {
        const updateAttributes = [...newProductAttributes];
        updateAttributes[index] = {
            attributeId: idAttribute,
            attributeName: attributeName,
            attributeValue: value,
            attributeType: attributeType,
            parent: "product"
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
            
            console.log(newProductAttributes);
            await axiosInstance.put('/attributes', newProductAttributes);

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
            enqueueSnackbar("Le produit est modifié avec succès", {variant: "success"});
            handleClose();
        }catch(error){
            enqueueSnackbar(`Echec de la modification du produit : ${error}`);
            console.error('error : ', error);
        }
    }


    return (
        <Dialog
                open={open}
                onClose={handleClose}
                maxWidth={'lg'}
                PaperProps={{
                    sx: {
                        borderRadius: "20px"
                    }
                }}
        >
            <DialogTitle><Typography align="center" variant="h4" sx={{color: colors.neutral}}>Modifier le produit {selectedProduct?.productName}</Typography></DialogTitle>
            <DialogContent>
                <Stack direction="column"
                        spacing={2}
                        margin={2}>
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
                                                onChange={(value: string) => handleChangeInput(index, attribute.attributeId, attribute.attributeName, value, attribute.attributeType)} />
                                )
                            })}

                </Stack>
            </DialogContent>

            <DialogActions>
                <Button variant="outlined" onClick={handleEditProduct} sx={{color: colors.textDefault, background: colors.primary, borderRadius: "20px"}}>Envoyer</Button>
                <Button variant="outlined" onClick={handleClose} sx={{borderRadius: "20px"}}>Annuler</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditProductDialog;