import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { AllProductData, ProductJoinProductAttribute } from "../../../Hooks/types";
import axiosInstance from "../../../axiosInstance";
import { Dispatch, SetStateAction } from "react";
import { useSnackbar } from "notistack";

interface DeleteProductDialogProps {
    open: boolean;
    handleClose: () => void;
    selectedProduct: ProductJoinProductAttribute | undefined;
    productDataList: AllProductData[];
    setProductDataList: Dispatch<SetStateAction<AllProductData[]>>;
}

const DeleteProductDialog : React.FC<DeleteProductDialogProps> = ({open, handleClose, selectedProduct, productDataList}) => {

    const { enqueueSnackbar } = useSnackbar();

    const handleDeleteProduct = async () => {
        try {
            await axiosInstance.delete('/product',  {data : selectedProduct});
            await axiosInstance.delete('/productAttributes', {data: selectedProduct?.attributes})

            productDataList.forEach(category => {
                category.productTypes.forEach(productType => {
                productType.products = productType.products.filter(product => product.idProduct !== selectedProduct?.idProduct);
                });
            });
            enqueueSnackbar("Le produit a été supprimé avec succès.", {variant: "success"});
            handleClose();
        } catch(error){
            enqueueSnackbar(`Echec de la suppression du produit ${error}`, {variant: "error"})
        }

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