import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Employee, Permissions, PointOfSale } from "../../../Hooks/types";
import axiosInstance from "../../../axiosInstance";
import { useSnackbar } from "notistack";
import InputField from "../../../Components/Common/Input";

interface EditEmployeeProps {
  open: boolean;
  handleClose: () => void;
  selectedEmployee: Employee | undefined;
  employeeList: Employee[];
}

interface TranslatedPermissions {
  [key: string]: string;
}

const translatedPermissions: TranslatedPermissions = {
  canAddCategory: "Peut ajouter catégorie",
  canDeleteCategory: "Peut supprimer catégorie",
  canEditCategory: "Peut modifier catégorie",
  canAddAppConfiguration: "Peut ajouter configuration de l'application",
  canEditAppConfiguration: "Peut modifier configuration de l'application",
  canAddProduct: "Peut ajouter produit",
  canDeleteProduct: "Peut supprimer produit",
  canEditProduct: "Peut modifier produit",
  canAddProductType: "Peut ajouter type de produit",
  canDeleteProductType: "Peut supprimer type de produit",
  canAddEmployee: "Peut ajouter employé",
  canDeleteEmployee: "Peut supprimer employé",
  canEditEmployee: "Peut modifier employé",
  canAddPointOfSale: "Peut ajouter point de vente",
  canDeletePointOfSale: "Peut supprimer point de vente",
  canEditPointOfSale: "Peut modifier point de vente",
  canAddLoss: "Peut ajouter perte",
  canDeleteLoss: "Peut supprimer perte",
  canEditLoss: "Peut modifier perte",
  canAddOrder: "Peut ajouter commande",
  canDeleteOrder: "Peut supprimer commande",
  canEditOrder: "Peut modifier commande",
  canAddSale: "Peut ajouter vente",
  canDeleteSale: "Peut supprimer vente",
  canEditSale: "Peut modifier vente",
  canAddTransfer: "Peut ajouter transfert",
  canDeleteTransfer: "Peut supprimer transfert",
  canEditTransfer: "Peut modifier transfert",
  canEditProductStock: "Peut modifier stock de produit",
  canEditCommandStatus: "Peut modifier statut de commande",
  canConfirmCommand: "Peut confirmer commande"
};

const EditEmployeeDialog: React.FC<EditEmployeeProps> = ({ open, handleClose, selectedEmployee, employeeList }) => {
  const defaultPermissions: Permissions = {
    canAddCategory: false,
    canDeleteCategory: false,
    canEditCategory: false,
    canAddAppConfiguration: false,
    canEditAppConfiguration: false,
    canAddProduct: false,
    canDeleteProduct: false,
    canEditProduct: false,
    canAddProductType: false,
    canDeleteProductType: false,
    canAddEmployee: false,
    canDeleteEmployee: false,
    canEditEmployee: false,
    canAddPointOfSale: false,
    canDeletePointOfSale: false,
    canEditPointOfSale: false,
    canAddLoss: false,
    canDeleteLoss: false,
    canEditLoss: false,
    canAddOrder: false,
    canDeleteOrder: false,
    canEditOrder: false,
    canAddSale: false,
    canDeleteSale: false,
    canEditSale: false,
    canAddTransfer: false,
    canDeleteTransfer: false,
    canEditTransfer: false,
    canEditProductStock: false,
    canEditCommandStatus: false,
    canConfirmCommand: false,
  };

  const [pointOfSaleList, setPointOfSaleList] = useState<PointOfSale[]>([]);
  const [selectedPointOfSaleId, setSelectedPointOfSaleId] = useState<number | undefined | "">("");
  const [selectedPos, setSelectedPos] = useState<PointOfSale | undefined>(undefined);
  const [nameEmployee, setNameEmployee] = useState<string>("");
  const [mailEmployee, setMailEmployee] = useState<string>("");
  const [checkState, setCheckState] = useState<Permissions>(defaultPermissions);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    console.log("selectedPos: ", selectedPos);
    
}, [selectedPos])


  useEffect(() => {
    console.log("SelectedEmployee : ", selectedEmployee);
    
    const fetchData = async () => {
      try {
        const getPointOfSalesResponse = await axiosInstance.get("/pointOfSales");
        setPointOfSaleList(getPointOfSalesResponse.data);

        if (open && selectedEmployee) {
          setNameEmployee(selectedEmployee.nameEmployee ?? "");
          setMailEmployee(selectedEmployee.mailEmployee ?? "");
          setCheckState(selectedEmployee.permissions || defaultPermissions);

          // Set selected POS for default
          setSelectedPointOfSaleId(selectedEmployee.pointOfSale?.idPointOfSale ?? "");
          setSelectedPos(selectedEmployee.pointOfSale);
        }
      } catch (error) {
        enqueueSnackbar(`Erreur de récupération des données ${error}`, { variant: "error" });
      }
    };

    fetchData();
  }, [open, selectedEmployee]);

  const selectHandleChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value as number;
    console.log("posId: ", value);
    
    setSelectedPointOfSaleId(value);
    setSelectedPos(pointOfSaleList.find((pos) => pos.idPointOfSale === value));
  };

  const handleCheckboxChange = (action: keyof Permissions) => {
    setCheckState((prevState) => ({
      ...prevState,
      [action]: !prevState[action],
    }));
  };

  const handleSubmit = async () => {
    try {
        
      if (nameEmployee !== "" && mailEmployee !== "" && selectedPos) {
        //cmambotra n objet newEmployee
        const newDataEmployee = {
            idEmployee: selectedEmployee?.idEmployee,
            nameEmployee: nameEmployee,
            mailEmployee: mailEmployee,
            pointOfSale: selectedPos,
            password:selectedEmployee?.password,
            ...checkState
        };

        //mi-envoyer ny requête
        await axiosInstance.put(`/employee/${selectedEmployee?.idEmployee}`, newDataEmployee);
        
        //mi-afficher liste employee
        enqueueSnackbar("Modification de l'employé avec succès", { variant: "success" });

        //manao update ny list à afficher
        employeeList.map((employee) => {
            if(employee.idEmployee === selectedEmployee?.idEmployee){
                employee.mailEmployee = mailEmployee;
                employee.nameEmployee = nameEmployee;
                employee.pointOfSale = selectedPos;
                employee.password = selectedEmployee?.password;
                employee.permissions = checkState;
            }
        })

        //mi-fermer ny fenêtre
        handleClose();

      } else if (nameEmployee !== "" && mailEmployee !== "" && !selectedPos ){
        //rah tsis pos
        console.log("pos is null");
        
        //construit ny nouvel employé
        const newDataEmployee = {
            idEmployee: selectedEmployee?.idEmployee,
            nameEmployee: nameEmployee,
            mailEmployee: mailEmployee,
            pointOfSale: null,
            password:selectedEmployee?.password,
            ...checkState
          };
  
          //mi-envoyer ny requête
          await axiosInstance.put(`/employee/${selectedEmployee?.idEmployee}`, newDataEmployee);
          
          //mi-afficher ny notification 
          enqueueSnackbar("Modification de l'employé avec succès", { variant: "success" });

          //mi-update ny liste à afficher
          employeeList.map((employee) => {
            if(employee.idEmployee === selectedEmployee?.idEmployee){
                employee.mailEmployee = mailEmployee;
                employee.nameEmployee = nameEmployee;
                employee.pointOfSale = selectedPos;
                employee.password = selectedEmployee?.password;
                employee.permissions = checkState;
            }
        })

          handleClose();
      }else {
        enqueueSnackbar("Veuillez remplir tous les champs, s'il vous plaît", { variant: "warning" });
      }
    } catch (error) {
      enqueueSnackbar(`Echec de la modification de l'employé : ${error}`, { variant: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle><Typography>Modifier l'employé</Typography></DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <Stack direction="column" spacing={2}>
            <InputLabel id="selectLabel">Point de vente</InputLabel>
            <Select
              labelId="selectLabel"
              label="Point de vente"
              id="selectPos"
              value={selectedPointOfSaleId}
              onChange={selectHandleChange}
            >
              <MenuItem value={""}>Aucun</MenuItem>
              {pointOfSaleList.map((pos) => (
                <MenuItem value={pos.idPointOfSale} key={pos.idPointOfSale}>
                  {pos.pointOfSaleName}
                </MenuItem>
              ))}
            </Select>
            <InputField type="text" label="Nom" value={nameEmployee} onChange={setNameEmployee} />
            <InputField type="text" label="Mail" value={mailEmployee} onChange={setMailEmployee} />
            <FormLabel component="legend">Assigner les responsabilités</FormLabel>
            <FormGroup>
              {Object.keys(checkState).map((action) => (
                <FormControlLabel
                  key={action}
                  control={
                    <Checkbox
                      checked={checkState[action as keyof Permissions]}
                      onChange={() => handleCheckboxChange(action as keyof Permissions)}
                      name={action}
                    />
                  }
                  label={translatedPermissions[action]}
                />
              ))}
            </FormGroup>
          </Stack>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" size="small" onClick={handleSubmit}>Modifier</Button>
        <Button variant="outlined" size="small" onClick={handleClose}>Annuler</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEmployeeDialog;
