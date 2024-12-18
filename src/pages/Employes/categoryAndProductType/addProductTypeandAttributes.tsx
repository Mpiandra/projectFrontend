import React, {Dispatch, SetStateAction, useState} from "react";
import {Button, Dialog, DialogActions, DialogTitle, FormControl, Stack, Typography} from "@mui/material";
import InputField from "../../../Components/Common/Input.tsx";
import axiosInstance from "../../../axiosInstance.ts";
import SelectList from "../../../Components/Common/select.tsx";
import { CategoryJoinProductType } from "../../../Hooks/types.ts";
import { useSnackbar } from "notistack";
import { colors } from "../../../Colors/index.ts";

interface AddProductTypeAndAttributesProps {
    open: boolean;
    handleClose: () => void;
    idCategory: number | undefined;
    categoryName: string | undefined;
    setCategoryDataList: Dispatch<SetStateAction<CategoryJoinProductType[]>>;
    categoryDataList: CategoryJoinProductType[];
}

const AddProductTypeandAttributes : React.FC<AddProductTypeAndAttributesProps> = ({open, handleClose, idCategory, categoryName, setCategoryDataList, categoryDataList}) => {
    const [productTypeName, setProductTypeName] : [string | undefined, Dispatch<SetStateAction<string | undefined>>]= useState();

    const { enqueueSnackbar } = useSnackbar()

    const types = [
        {"text" : "Texte", "value" : "text"},
        {"text" : "Nombre", "value" : "number"},
        {"text" : "Booleen", "value" : "boolean"},
        {"text" : "Date", "value" : "date"}
    ]

    const [productTypeAttributes, setProductTypeAttributes] = useState<{
        attributeName: string,
        attributeType: string,
        parent: string,
        idParent?: number
    }[]>([]);

    const handleAddAttribute = () => {
        productTypeAttributes.push({
            attributeName: "",
            attributeType: "",
            parent: "productType"
        });

        console.log('cat', productTypeAttributes)
        setProductTypeAttributes([...productTypeAttributes]);
    }

    const resetForm = () => {
        setProductTypeName(undefined);
        setProductTypeAttributes([]);
    };

    const handleCancel = () => {
        resetForm();
        handleClose();
    }

    const handleChangeInput = (index: number, champ: string, value: string) => {
        // @ts-ignore
        productTypeAttributes[index][champ] = value;
        setProductTypeAttributes([...productTypeAttributes]);
    }

   const handleSubmit = async () => {
      try{
          if(productTypeName){
                const newProductType = await axiosInstance.post('/productType', {productTypeName: productTypeName, category : {idCategory, categoryName }});
                const newProductTypeData = newProductType.data;
                try{
                    const updatedProductTypeAttributes = productTypeAttributes
                        .filter(attribute => !(attribute.attributeName === "" && attribute.attributeType === ""))
                        .map(attribute => ({
                            ...attribute,
                            idParent: newProductTypeData.idProductType,
                    }));
                    console.log(updatedProductTypeAttributes)
                    const newProductTypeAttribute = await axiosInstance.post('/attributes', updatedProductTypeAttributes);
                    console.log(newProductTypeAttribute);

                    const filteredCategoryDataList = categoryDataList.filter((item) => {
                        if(item.idCategory !== idCategory){
                            return true;
                        }else{
                            item.productTypes.push(newProductType.data)
                            item.productTypes.map((productType) => {
                                if(productType.idProductType === newProductType.data.idProductType){
                                    productType.attributes=newProductTypeAttribute.data;
                                }
                            })
                                return true;
                        }
                    })
        
                    setCategoryDataList(filteredCategoryDataList);
                    resetForm();
                    enqueueSnackbar("Le type de produit a été ajouté avec succès", {variant: "success"});
                    handleClose();
                        
                }catch(error){
                    axiosInstance.delete(`/productType/${newProductTypeData.idProductType}`);
                    enqueueSnackbar(`Echec de l'ajout du type de produit : ${error}`, {variant: "error"});
                }
                
          } else {
            enqueueSnackbar("Veuillez remplir tous les champs, s'il vous plait", {variant: "warning"});
          }

      } catch (error) {
            enqueueSnackbar(`Echec de l'ajout du type de produit : ${error}`, {variant: "error"})
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
                }}
        >
            <DialogTitle>
                <Typography align="center" variant="h4" sx={{color: colors.neutral}}>
                Ajouter un type de produit à la catégorie {categoryName}
                </Typography>
            </DialogTitle>
            <Stack
                direction="column"
                spacing={2}
                margin={2}
            >
                <InputField type={"text"}
                       name={"productTypeName"}
                       label={"Type de produit"}
                       id="outlined-basic"
                       value={productTypeName ?? ""}
                       onChange={setProductTypeName}
                       required
                />
                <Stack
                    direction = "column"
                    spacing={2}
                >
                    {productTypeAttributes.map((item: { attributeName: string, attributeType: string }, index) => {
                        return (
                            <React.Fragment key={index}>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{justifyContent: "space-between",
                                        width: "100%"
                                    }}>
                                    <FormControl fullWidth>
                                    <InputField type="text"
                                           onChange={(e) => handleChangeInput(index, 'attributeName', e)}
                                           name={index + "-name"}
                                           id="outlined-basic"
                                           label="Nom de l'attribut"
                                    />
                                    </FormControl>
                                    <FormControl fullWidth>
                                    <SelectList values={types}
                                                value={item.attributeType}
                                                onChange={(e) => {
                                                    productTypeAttributes[index]["attributeType"] = e.target.value;
                                                    setProductTypeAttributes([...productTypeAttributes]);
                                                    console.log("e", productTypeAttributes)
                                                }}
                                                label="Type de l'attribut"
                                    />
                                    </FormControl>
                                </Stack>
                            </React.Fragment>
                        )
                    })}
                    <Button variant="text" size="small" onClick={handleAddAttribute}>Ajouter un attribut</Button>
                </Stack>
                <DialogActions>
                    <Button variant={"outlined"} onClick={handleSubmit} sx={{color: colors.textDefault, background: colors.primary, borderRadius: "20px"}}>Envoyer</Button>
                    <Button variant={"outlined"} onClick={handleCancel} sx={{borderRadius: "20px"}}>Annuler</Button>
                </DialogActions>
                
            </Stack>
        </Dialog>
    )
}

export default AddProductTypeandAttributes;