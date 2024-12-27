import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material"
import { AllProductData, ProductJoinProductAttribute } from "../../../Hooks/types";
import axiosInstance from "../../../axiosInstance";
import { Dispatch, SetStateAction } from "react";
import { useSnackbar } from "notistack";
import { colors } from "../../../Colors";

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

            productDataList.forEach(category => {
                category.productTypes.forEach(productType => {
                productType.products = productType.products.filter(product => product.idProduct !== selectedProduct?.idProduct);
                });
            });

            await axiosInstance.delete(`/attributes/${selectedProduct?.idProduct}`, {params: {parent: "product"}})

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
                PaperProps={{
                    sx: {
                        borderRadius: "20px"
                    }
                }}>
            <DialogTitle><Typography align="center" variant="h4" sx={{color: colors.neutral}}>Supprimer le produit {selectedProduct?.productName}</Typography></DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Voulez-vous vraiment supprimer ce produit ?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" size="small" onClick={handleDeleteProduct} sx={{color: colors.textDefault, background: colors.primary, borderRadius: "20px"}}>Valider</Button>
                <Button variant="outlined" size="small" onClick={handleClose} sx={{borderRadius: "20px"}}>Annuler</Button>
            </DialogActions>

        </Dialog>
    )
}

export default DeleteProductDialog;