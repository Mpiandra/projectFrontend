import React, { useEffect, useState } from "react";
import { Button,  Paper,  Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { AddSharp} from "@mui/icons-material";
import AddSaleDialog from "./addSale";
import axiosInstance from "../../../axiosInstance";
import { SaleGetted } from "../../../Hooks/types";
import { transformToSaleGetted } from "../../../Hooks/useGroupData";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const SaleList: React.FC = () => {

    const [openAddSale, setOpenAddSale] = useState(false);
    const [saleData, setSaleData] = useState<SaleGetted[]>([])
    const [selectedDate, setSelectedDate] = useState<string>();
    const [minDate, setMinDate] = useState<number>();
    const [filteredSaleData, setFilteredSaleData] = useState<SaleGetted[]>();

    const today = dayjs().format("YYYY-MM-DD");



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
        const fetchData = async() => {
            const getSaleData = await axiosInstance.get("/allSaleData")
            console.log("getSaleData : ", getSaleData);
            setSaleData(transformToSaleGetted(getSaleData.data))
            setSelectedDate(today)
        }

        fetchData();
        
    }, [])

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

        <Button variant="outlined" size="small" startIcon={<AddSharp />} onClick={handleOpenAddSale}>Vente</Button>
        <Typography>Voir les ventes du : </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker disableFuture={true}
                         onChange={(value) => handleDatechange(value)}
                         minDate={dayjs(minDate)}/>
        </LocalizationProvider>

        
        <Stack direction={"column"} spacing={2}>
            {filteredSaleData?.map((sale) => {
                return (
                    <Paper elevation={5}>
                    <Table key={sale.idSale}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Produit</TableCell>
                            <TableCell>Prix unitaire</TableCell>
                            <TableCell>Quantité vendue</TableCell>
                            <TableCell>Prix total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sale.saleRows.map((row) => {
                            return (
                                 <TableRow key={row.idProduct}>
                                    <TableCell>{row.productName}</TableCell>
                                    <TableCell>{row.price}</TableCell>
                                    <TableCell>{row.quantitySale}</TableCell>
                                    <TableCell>{row.priceSale}</TableCell>
                                </TableRow>
                                
                            )
                        })}
                        <TableRow>
                                    <TableCell>Total</TableCell>
                                    <TableCell colSpan={3}>{sale.totalPrice}</TableCell>
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