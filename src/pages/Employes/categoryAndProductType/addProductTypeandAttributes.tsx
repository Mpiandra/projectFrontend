import React, {Dispatch, SetStateAction, useState} from "react";
import {Button, Dialog, DialogActions, DialogTitle, Stack} from "@mui/material";
import InputField from "../../../Components/Common/Input.tsx";
import axiosInstance from "../../../axiosInstance.ts";
import SelectList from "../../../Components/Common/select.tsx";
import { Category } from "../../../Hooks/types.ts";

interface AddProductTypeAndAttributesProps {
    open: boolean;
    handleClose: () => void;
    idCategory: number | undefined;
    categoryName: string | undefined;
    setCategoryDataList: Dispatch<SetStateAction<Category[]>>;
    categoryDataList: Category[];
}

const AddProductTypeandAttributes : React.FC<AddProductTypeAndAttributesProps> = ({open, handleClose, idCategory, categoryName, setCategoryDataList, categoryDataList}) => {
    const [productTypeName, setProductTypeName] : [string | undefined, Dispatch<SetStateAction<string | undefined>>]= useState();

    const types = [
        {"text" : "Texte", "value" : "text"},
        {"text" : "Nombre", "value" : "number"},
        {"text" : "Booleen", "value" : "boolean"},
        {"text" : "Date", "value" : "date"}
    ]

    const [productTypeAttributes, setProductTypeAttributes] = useState<{
        attributeName: string,
        attributeType: string,
        productType?: {
            idProductType: number,
            productTypeName: string,
            category: {
                idCategory: number,
                categoryName: string
            }
        }
    }[]>([]);

    const handleAddAttribute = () => {
        productTypeAttributes.push({
            attributeName: "",
            attributeType: ""
        });

        console.log('cat', productTypeAttributes)
        setProductTypeAttributes([...productTypeAttributes]);
    }

    const handleCancelClick = () => {
        handleClose();
    }

    const handleChangeInput = (index: number, champ: string, value: string) => {
        // @ts-ignore
        productTypeAttributes[index][champ] = value;
        setProductTypeAttributes([...productTypeAttributes]);
    }

   const handleSubmit = async () => {
      try{
          const newProductType = await axiosInstance.post('/productType', {productTypeName: productTypeName, category : {idCategory, categoryName }});
          productTypeAttributes.map((attribute) => (
              attribute.productType = newProductType.data
          ));
          console.log(productTypeAttributes)
          const newProductTypeAttribute = await axiosInstance.post('/productTypeAttributes', productTypeAttributes);
          console.log(newProductTypeAttribute);
          handleClose();

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

      } catch (error) {
            console.error("error :" + error)
      }
    }
    return (
        <Dialog open={open}
                onClose={handleClose}
                maxWidth={'lg'}
                fullWidth
        >
            <DialogTitle>
                Ajouter un type de produit et ses attributs
            </DialogTitle>
            <Stack
                direction="column"
                spacing={2}
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
                                    spacing={6}>
                                    <InputField type="text"
                                           onChange={(e) => handleChangeInput(index, 'attributeName', e)}
                                           name={index + "-name"}
                                           id="outlined-basic"
                                           label="Nom de l'attribut"
                                    />
                                    <SelectList values={types}
                                                value={item.attributeType}
                                                onChange={(e) => {
                                                    productTypeAttributes[index]["attributeType"] = e.target.value;
                                                    setProductTypeAttributes([...productTypeAttributes]);
                                                    console.log("e", productTypeAttributes)
                                                }}
                                                label="Type de l'attribut"
                                    />
                                </Stack>
                            </React.Fragment>
                        )
                    })}
                    <Button variant="text" size="small" onClick={handleAddAttribute}>Ajouter un attribut</Button>
                </Stack>
                <DialogActions>
                    <Button variant={"outlined"} size={"small"} onClick={handleSubmit}>Envoyer</Button>
                    <Button variant={"outlined"} size={"small"} onClick={handleCancelClick}>Annuler</Button>
                </DialogActions>
                
            </Stack>
        </Dialog>
    )
}

export default AddProductTypeandAttributes;