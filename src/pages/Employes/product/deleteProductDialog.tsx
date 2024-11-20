import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { AllProductData, ProductJoinProductAttribute } from "../../../Hooks/types";
import axiosInstance from "../../../axiosInstance";
import { Dispatch, SetStateAction } from "react";

interface DeleteProductDialogProps {
    open: boolean;
    handleClose: () => void;
    selectedProduct: ProductJoinProductAttribute | undefined;
    productDataList: AllProductData[];
    setProductDataList: Dispatch<SetStateAction<AllProductData[]>>;
}

const DeleteProductDialog : React.FC<DeleteProductDialogProps> = ({open, handleClose, selectedProduct, productDataList}) => {

    const handleDeleteProduct = async () => {
        await axiosInstance.delete('/product',  {data : selectedProduct});
        await axiosInstance.delete('/productAttributes', {data: selectedProduct?.attributes})

        productDataList.forEach(category => {
            // For each category, iterate through its productTypes
            category.productTypes.forEach(productType => {
              // Filter out the product with the matching idProduct
              productType.products = productType.products.filter(product => product.idProduct !== selectedProduct?.idProduct);
            });
          });
        

        // setProductDataList(filteredProductDataList);
        handleClose();

    }
    return (
        <Dialog open={open}
                onClose={handleClose}
                maxWidth={'lg'}
                fullWidth>
            <DialogTitle>Supprimer le produit {selectedProduct?.productName}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Voulez-vous vraiment supprimer ce produit ?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" size="small" onClick={handleDeleteProduct}>Valider</Button>
                <Button variant="outlined" size="small" onClick={handleClose}>Annuler</Button>
            </DialogActions>

        </Dialog>
    )
}

export default DeleteProductDialog;