import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Button, Divider, Fab, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Add} from '@mui/icons-material';
import AddTransferDialog from './addTransfer';
import axiosInstance from '../../../axiosInstance';
import { formatDate, transformToEmployee, transformTransferData } from '../../../Hooks/useGroupData';
import { Employee, TransferGetted } from '../../../Hooks/types';
import Grid from '@mui/material/Grid2';
import ConfirmTransferDialog from './confirmTransferDialog';
import { colors } from '../../../Colors';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TransferList = () => {
  const [value, setValue] = React.useState(0);

  const [allTransferData, setAllTransferData] = React.useState<TransferGetted[]>([]);
  const [inProgressTransferIn, setInProgressTransferIn] = React.useState<TransferGetted[]>([]);
  const [inProgressTransferOut, setInProgressTransferOut] = React.useState<TransferGetted[]>([]);
  const [completedTransferIn, setCompletedTransferIn] = React.useState<TransferGetted[]>([]);
  const [completedTransferOut, setCompletedTransferOut] = React.useState<TransferGetted[]>([]);
 


  const [currentEmployee, setCurrentEmployee] = React.useState<Employee>();

  const[openAddTransfer, setOpenAddTransfer] = React.useState(false);
  const [openConfirmTransfer, setOpenConfirmTransfer] = React.useState(false);
  const [selectedTransfer, setSelectedTransfer] = React.useState<TransferGetted>();


  const storedEmployee = localStorage.getItem("employee");

  React.useEffect(() => {
    const fetchData = async() => {
      const getTransferData = await axiosInstance.get("/transferData");
      console.log(transformTransferData(getTransferData.data));
      setAllTransferData(transformTransferData(getTransferData.data));
    }
    fetchData();
  }, [])

  React.useEffect(() => {
    if(storedEmployee){
        console.log("st : ", storedEmployee);
        const parsedEmployee = JSON.parse(storedEmployee)
        console.log("parsedEmployee", parsedEmployee);
        setCurrentEmployee(transformToEmployee(parsedEmployee))
    }
}, [storedEmployee])

  React.useEffect(() => {


      setInProgressTransferIn(allTransferData.filter((transferData) => {
        if(transferData.transferStatus === "En cours" && transferData.pointOfSaleDestination.idPointOfSale === currentEmployee?.pointOfSale?.idPointOfSale){
          return true;
        }
      }))

      setInProgressTransferOut(allTransferData.filter((transferData) => {
        if(transferData.transferStatus === "En cours" && transferData.pointOfSaleSource?.idPointOfSale === currentEmployee?.pointOfSale?.idPointOfSale){
          return true;
        }
      }))

      setCompletedTransferIn(allTransferData.filter((transferData) => {
        if(transferData.transferStatus === "Complété" && transferData.pointOfSaleDestination.idPointOfSale === currentEmployee?.pointOfSale?.idPointOfSale){
          return true;
        }
      }))

      setCompletedTransferOut(allTransferData.filter((transferData) => {
        if(transferData.transferStatus === "Complété" && transferData.pointOfSaleSource?.idPointOfSale === currentEmployee?.pointOfSale?.idPointOfSale){
          return true;
        }
      }))

  }, [allTransferData])


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleOpenAddTransfer = () => {
    setOpenAddTransfer(true);
  }

  const handleCloseAddTransfer = () => {
    setOpenAddTransfer(false);
  }

  const handleOpenConfirmTransfer = (selectedTransfer: TransferGetted) => {
    setSelectedTransfer(selectedTransfer);
    setOpenConfirmTransfer(true);
  }

  const handleCloseConfirmTransfer = () => {
    setOpenConfirmTransfer(false)
  }
  



  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>

        <AddTransferDialog open={openAddTransfer}
                            handleClose={handleCloseAddTransfer} 
                            allTransferData={inProgressTransferOut}/>

        <ConfirmTransferDialog open={openConfirmTransfer}
                                handleClose={handleCloseConfirmTransfer}
                                selectedTransfer={selectedTransfer}
                                completedTransferIn={completedTransferIn}
                                inProgressTransferIn={inProgressTransferIn} 
                                setInProgressTransferIn={setInProgressTransferIn}/>

        {currentEmployee?.permissions.canAddTransfer && 
          <Fab onClick={handleOpenAddTransfer} sx={{ display: "flex", position: "fixed", margin: 2, color: colors.neutral,background: colors.tertiary, bottom: 16, right: 16 }}>
          <Add />
      </Fab>
        }
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Transferts en cours" {...a11yProps(0)} />
          <Tab label="Transferts complétés" {...a11yProps(1)} />
        </Tabs>
      </Box>


      {/* //En cours */}
      <CustomTabPanel value={value} index={0}>
      <Grid container direction={"row"} spacing={1}>

            {/* //Entrant */}
            <Grid size={5}>
                  <Typography variant='h5' align='center'>Entrant</Typography>
                    <Stack spacing={3}>
                        {inProgressTransferIn.length>0 ? 
                        inProgressTransferIn.map((transfer, index) => {
                          return (
                            <React.Fragment key={index}>
                              <Paper elevation={5}>
                                <Typography>Date : {formatDate(transfer.transferDate)}</Typography>
                                <Typography>Point de vente déstination : {transfer.pointOfSaleDestination.pointOfSaleName}</Typography>
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Produit</TableCell>
                                      <TableCell>Quantité</TableCell>
                                      <TableCell>Prix</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {transfer.transferRows.map((transferRow, indexRow) => {
                                        return (
                                          <TableRow key={`${transferRow.idTransferRow}-${indexRow}-${index}`}>
                                            <TableCell>{transferRow.product.productName}</TableCell>
                                            <TableCell>{transferRow.quantityProductTransfer}</TableCell>
                                            <TableCell>{transferRow.product.price * transferRow.quantityProductTransfer}</TableCell>
                                          </TableRow>
                                        )
                                    })}
                                  </TableBody>
                                </Table>
                                <Button variant='outlined' size='small' onClick={() => handleOpenConfirmTransfer(transfer)}>Confirmer</Button>
                              </Paper>
                            </React.Fragment>
                          )
                        })
                        
                        : <Typography align='center'>Pas de transfert enregistré</Typography>}
                    </Stack>
                </Grid>

            <Divider orientation='vertical' flexItem />

            {/* //Sortant */}
            <Grid size={6}>
            <Typography variant='h5' align='center'>Sortant</Typography>
              <Stack spacing={3}>
                  {inProgressTransferOut.length>0 ? 
                  inProgressTransferOut.map((transfer, index) => {
                    return (
                      <React.Fragment key={index}>
                                <Paper elevation={5}>
                                <Typography>Date : {formatDate(transfer.transferDate)}</Typography>
                                <Typography>Point de vente déstination : {transfer.pointOfSaleDestination.pointOfSaleName}</Typography>
                                    <Table>
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>Produit</TableCell>
                                          <TableCell>Quantité</TableCell>
                                          <TableCell>Prix</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {transfer.transferRows.map((transferRow, indexRow) => {
                                            return (
                                              <TableRow key={`${transferRow.idTransferRow}-${indexRow}-${index}`}>
                                                <TableCell>{transferRow.product.productName}</TableCell>
                                                <TableCell>{transferRow.quantityProductTransfer}</TableCell>
                                                <TableCell>{transferRow.product.price * transferRow.quantityProductTransfer}</TableCell>
                                              </TableRow>
                                            )
                                        })}
                                      </TableBody>
                                    </Table>
                                </Paper>
                        
                      </React.Fragment>
                    )
                  })
                  
                  : <Typography align='center'>Pas de transfert enregistré</Typography>}
              </Stack>
            </Grid>
        </Grid>
      </CustomTabPanel>


      {/* //Complété */}
      <CustomTabPanel value={value} index={1}>
      <Grid container direction={"row"} spacing={1}>

              {/* //Entrant */}
            <Grid size={5}>
                  <Typography variant='h5' align='center'>Entrant</Typography>
                    <Stack spacing={3}>
                        {completedTransferIn.length>0 ? 
                        completedTransferIn.map((transfer, index) => {
                          return (
                            <React.Fragment key={index}>
                              <Paper elevation={5}>
                              <Typography>Date : {formatDate(transfer.transferDate)}</Typography>
                              <Typography>Point de vente déstination : {transfer.pointOfSaleDestination.pointOfSaleName}</Typography>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Produit</TableCell>
                                    <TableCell>Quantité</TableCell>
                                    <TableCell>Prix</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {transfer.transferRows.map((transferRow, indexRow) => {
                                      return (
                                        <TableRow key={`${transferRow.idTransferRow}-${indexRow}-${index}`}>
                                          <TableCell>{transferRow.product.productName}</TableCell>
                                          <TableCell>{transferRow.quantityProductTransfer}</TableCell>
                                          <TableCell>{transferRow.product.price * transferRow.quantityProductTransfer}</TableCell>
                                        </TableRow>
                                      )
                                  })}
                                </TableBody>
                              </Table>
                              </Paper>
                            </React.Fragment>
                          )
                        })
                        
                        : <Typography align='center'>Pas de transfert enregistré</Typography>}
                    </Stack>
                </Grid>


            <Divider orientation='vertical' flexItem />

            {/* //Sortant */}
            <Grid size={6}>
            <Typography variant='h5' align='center'>Sortant</Typography>
              <Stack spacing={3}>
                  {completedTransferOut.length>0 ? 
                  completedTransferOut.map((transfer, index) => {
                    return (
                      <React.Fragment key={index}>
                        <Paper elevation={5}>
                          <Typography>Date : {formatDate(transfer.transferDate)}</Typography>
                          <Typography>Point de vente déstination : {transfer.pointOfSaleDestination.pointOfSaleName}</Typography>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Produit</TableCell>
                                <TableCell>Quantité</TableCell>
                                <TableCell>Prix</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {transfer.transferRows.map((transferRow, indexRow) => {
                                  return (
                                    <TableRow key={`${transferRow.idTransferRow}-${indexRow}-${index}`}>
                                      <TableCell>{transferRow.product.productName}</TableCell>
                                      <TableCell>{transferRow.quantityProductTransfer}</TableCell>
                                      <TableCell>{transferRow.product.price * transferRow.quantityProductTransfer}</TableCell>
                                    </TableRow>
                                  )
                              })}
                            </TableBody>
                          </Table>
                        </Paper>
                      </React.Fragment>
                    )
                  })
                  
                  : <Typography align='center'>Pas de transfert enregistré</Typography>}
              </Stack>
            </Grid>
        </Grid>
      </CustomTabPanel>
    </Box>
  );
}

export default TransferList;
