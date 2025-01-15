import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Register from "./pages/Employes/register.tsx";
import Login from "./pages/Employes/login.tsx";
import ProductList from "./pages/Customer/productList.tsx";
import ProtectedRoute from "./protectedRoute.tsx";
import ProductsList from "./pages/Employes/product/productsList.tsx";
import CategoryList from "./pages/Employes/categoryAndProductType/categoryList.tsx";
import PointOfSaleList from "./pages/Employes/pointOfSale/pointOfSaleList.tsx";
import EmployeeList from "./pages/Employes/employeeManagement/employeeList.tsx";
import { SnackbarProvider } from "notistack";
import AppLayout from "./Components/layout/layout.tsx";
import {createTheme, ThemeProvider} from "@mui/material";
import TransferList from "./pages/Employes/transfer/transferList.tsx";
import SaleList from "./pages/Employes/sale/saleList.tsx";
import ProductStockList from "./pages/Employes/productStock/productStockList.tsx";
import Account from "./pages/Employes/account/seeAccount.tsx";

function App() {

    const theme = createTheme({
        palette: {
            primary:{
                main:"#627264"
            },
            secondary:{
                main:"#a1cda8"
            },
            background:{
                default:"#c5e7e2"
            }
        }
    });

  return (
    <>
    <ThemeProvider theme={theme}>
            <Router>
                <SnackbarProvider maxSnack={5}
                                  anchorOrigin={
                                    {
                                      vertical: "top",
                                      horizontal: "right"
                                    }
                                  }>
                    <AppLayout>
                          <Routes>
                              <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
                              <Route path="/login" element={<Login />} />
                              <Route path="/" element={<ProductList/>} />
                              <Route path="/produits" element={<ProductsList />} />
                              <Route path="/categories" element={<CategoryList/>} />
                              <Route path="/pointOfSale" element={<PointOfSaleList />} />
                              <Route path="/employee" element={<EmployeeList />} />
                              <Route path="/transfer" element={<TransferList />} />
                              <Route path="/sale" element={<SaleList />} />
                              <Route path="/productStock" element={<ProductStockList />} />
                              <Route path="/account" element={<Account />} />
                          </Routes>
                    </AppLayout>
                </SnackbarProvider>
            </Router>
    </ThemeProvider>
    </>

  )
}

export default App
