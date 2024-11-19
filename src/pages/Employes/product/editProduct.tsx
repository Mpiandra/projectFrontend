import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, ListSubheader, MenuItem, Select, SelectChangeEvent, Stack, TextField } from "@mui/material"
import { CategoryJoinProductType, ProductJoinProductAttribute, ProductTypeJoinProductTypeAttribute } from "../../../Hooks/types";
import { useEffect, useState } from "react";
import InputField from "../../../Components/Common/Input";

interface EditProductDialogProps {
    open: boolean;
    handleClose: () => void;
    selectedProduct: ProductJoinProductAttribute | undefined;
    categoryDataList: CategoryJoinProductType[];
}

const EditProductDialog: React.FC<EditProductDialogProps> = ({open, handleClose, selectedProduct, categoryDataList}) => {

    const [selectedProductType, setSelectedProductType] = useState<ProductTypeJoinProductTypeAttribute | null>(null)
    const [selectedProductTypeId, setSelectedProductTypeId] = useState<number | "">("");

    const [productName, setProductName] = useState<string>("");
    const [price, setPrice] = useState<number | null>(null);
    const [imageFile, setImageFile] = useState<File>()

     useEffect(() => {
        if(selectedProduct){
            setProductName(selectedProduct.productName);
            setPrice(selectedProduct.price);
        }
        console.log(selectedProduct);
        
     }, [selectedProduct])

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

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.value && e.target.files && e.target.files.length > 0){
            setImageFile(e.target.files[0]);
            console.log(e.target.files[0]);
            
        }
    }


    return (
        <Dialog
                open={open}
                onClose={handleClose}
        >
            <DialogTitle>Modifier le produit {selectedProduct?.productName}</DialogTitle>
            <DialogContent>
                <Stack direction="column"
                        spacing={2}>
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
                                        label="Nom du produit"
                                        value={productName}
                                        onChange={setProductName} />

                            <TextField type="file"
                                        label="Image"
                                        variant="outlined"
                                        onChange={handleChangeImage} />
                            
                            <InputField type="number"
                                        label="Prix"
                                        value={price?.toString()}
                                        onChange={(e) => setPrice(e ? Number(e) : 0)} />
                            
                            

                </Stack>
            </DialogContent>

            <DialogActions>
                <Button variant="outlined">Envoyer</Button>
                <Button variant="outlined" onClick={handleClose}>Annuler</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditProductDialog;