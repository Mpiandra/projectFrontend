import React, {Dispatch, SetStateAction, useState} from "react";
import {Alert, Button, Snackbar, SnackbarCloseReason, Stack} from "@mui/material";
import Input from "../../Components/Common/Input.tsx";
import axiosInstance from "../../axiosInstance.ts";
import SelectList from "../../Components/Common/select.tsx";
import {useNavigate, useParams} from "react-router-dom";

const AddProductTypeandAttributes : React.FC = () => {
    const [productTypeName, setProductTypeName] : [string | undefined, Dispatch<SetStateAction<string | undefined>>]= useState();
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);

    const {idCategory, categoryName} = useParams();

    const navigate = useNavigate();

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

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowAlertError(false);
        setShowAlertSuccess(false);
    };

    const handleCancelClick = () => {
        setShowAlertSuccess(!showAlertSuccess);
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
          setShowAlertSuccess(!showAlertSuccess);
          navigate('/categoryList')

      } catch (error) {
          setShowAlertError(!showAlertError);
            console.error("error :" + error)
      }
    }
    return (
        <Stack
            direction="column"
            spacing={2}
        >
             <Snackbar open={showAlertError} autoHideDuration={4000} onClose={handleClose}>
                <Alert severity={"error"} onClose={handleClose}>Echec de l'ajout du type de produit et des attributs</Alert>
            </Snackbar>
            <Snackbar open={showAlertSuccess} autoHideDuration={4000} onClose={handleClose}>
                <Alert severity={"success"} onClose={handleClose}>Le type de produit et les attributs sont ajoutés avec succès</Alert>
            </Snackbar>
            <Input type={"text"}
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
                            <Input type="text"
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
                <Button variant="outlined" size="small" onClick={handleAddAttribute}>Ajouter un attribut</Button>
            </Stack>
        <Button variant={"outlined"} size={"small"} onClick={handleSubmit}>Envoyer</Button>
            <Button variant={"outlined"} size={"small"} onClick={handleCancelClick}>Annuler</Button>
        </Stack>
    )
}

export default AddProductTypeandAttributes;