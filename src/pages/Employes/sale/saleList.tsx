import React, { useEffect, useState } from "react";
import {  Fab,  Paper,  Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Add} from "@mui/icons-material";
import AddSaleDialog from "./addSale";
import axiosInstance from "../../../axiosInstance";
import { Employee, SaleGetted } from "../../../Hooks/types";
import { transformToSaleGetted } from "../../../Hooks/useGroupData";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { colors } from "../../../Colors";
import Grid from '@mui/material/Grid2';

const SaleList: React.FC = () => {

    const [openAddSale, setOpenAddSale] = useState(false);
    const [saleData, setSaleData] = useState<SaleGetted[]>([])
    const [selectedDate, setSelectedDate] = useState<string>();
    const [minDate, setMinDate] = useState<number>();
    const [filteredSaleData, setFilteredSaleData] = useState<SaleGetted[]>();
    const [totalSale, setTotalSale] = useState<number>();
    const [currentEmployee, setCurrentEmployee] = useState<Employee>();

    const today = dayjs().format("YYYY-MM-DD");

    const storedEmployee = localStorage.getItem("employee");

    React.useEffect(() => {
        if(storedEmployee){
          setCurrentEmployee(JSON.parse(storedEmployee));
        }
      }, [storedEmployee])



    const handleOpenAddSale = () => {
        setOpenAddSale(true)
    }

    const handleCloseAddSale = () => {
        setOpenAddSale(false);
    }

    const getStartOfDay = (timestamp: number): number => {
        const date = new Date(timestamp);
        date.setHours(0, 0, 0, 0); // Réinitialiser l'heure à minuit
        return date.getTime();
      };

      useEffect(() => {
        setTotalSale(filteredSaleData?.reduce((sum, sale) => sum + sale.totalPrice, 0));
        
      }, [filteredSaleData])

      useEffect(() => {
        console.log("Total sum updated:", totalSale);
    }, [totalSale]);
    
      

    useEffect(() => {

        const fetchData = async() => {
            const getSaleData = await axiosInstance.get(`/allSaleData/${currentEmployee?.pointOfSale?.idPointOfSale}`)
            console.log("getSaleData : ", getSaleData);
            setSaleData(transformToSaleGetted(getSaleData.data))
            setSelectedDate(today)
        }

        fetchData();
        
    }, [currentEmployee])

    useEffect(() => {
        setMinDate(saleData.reduce(
            (minDate, sale) => Math.min(minDate, getStartOfDay(sale.saleDate)),
            Infinity // Valeur par défaut si le tableau est vide
          ))
    }, [saleData])

    useEffect(() => {
        if(selectedDate){
            console.log("selectedDate :", selectedDate);
            setFilteredSaleData(saleData.filter((sale) => {
                const saleDate = dayjs(sale.saleDate).format("YYYY-MM-DD");
    
                return saleDate === selectedDate;
            }))
            console.log("filteredSaleData : ", filteredSaleData);
        }

    }, [selectedDate])


    const handleDatechange = (newValue: any) => {
        if(newValue){
            setSelectedDate(dayjs(newValue).format("YYYY-MM-DD"));
        }else {
            setSelectedDate("");
        }
    }

    return <div>
        <AddSaleDialog open={openAddSale}
                        handleClose={handleCloseAddSale}
                        filteredSaleData={filteredSaleData} />

        <Fab onClick={handleOpenAddSale} sx={{ display: "flex", position: "fixed", margin: 2, color: colors.neutral,background: colors.tertiary, bottom: 16, right: 16 }}>
                    <Add />
                </Fab>
        <Grid container 
                sx={{
                        position: "sticky",
                        top: 70,
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        zIndex: 10, 
                        padding: "10px", 
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"}}>
            <Grid size={8} >
                <Stack direction={"row"} spacing={2}>
                    <Typography variant="h5" sx={{color: colors.neutral}}>Voir les ventes du : </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker disableFuture={true}
                                    onChange={(value) => handleDatechange(value)}
                                    minDate={dayjs(minDate)}/>
                    </LocalizationProvider>
                </Stack>

            </Grid>
            <Grid size={4}>
                <Typography variant="h5" sx={{color: colors.neutral}}>Vente du jour : {totalSale}</Typography>
            </Grid>

        </Grid>
        
        <Stack direction={"column"} spacing={2} margin={2}>
            {filteredSaleData?.map((sale, index) => {
                return (
                    <Paper elevation={5} key={index} sx={{background: colors.background}}>
                    <Table key={sale.idSale}>
                    <TableHead>
                        <TableRow sx={{background: colors.secondary}}>
                            <TableCell><Typography variant="h6" sx={{color: colors.textDefault}}>Produit</Typography></TableCell>
                            <TableCell><Typography variant="h6" sx={{color: colors.textDefault}}>Prix unitaire</Typography></TableCell>
                            <TableCell><Typography variant="h6" sx={{color: colors.textDefault}}>Quantité vendue</Typography></TableCell>
                            <TableCell><Typography variant="h6" sx={{color: colors.textDefault}}>Prix total</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sale.saleRows.map((row) => {
                            return (
                                 <TableRow key={row.idProduct}>
                                    <TableCell>{row.productName} </TableCell>
                                    <TableCell>{row.price}</TableCell>
                                    <TableCell>{row.quantitySale}</TableCell>
                                    <TableCell>{row.priceSale}</TableCell>
                                </TableRow>
                                
                            )
                        })}
                        <TableRow>
                                    <TableCell>Total</TableCell>
                                    <TableCell colSpan={3} sx={{textAlign: "center"}}>{sale.totalPrice}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                </Paper>
                )
            })}
        </Stack>
        
    </div>
}

export default SaleList;