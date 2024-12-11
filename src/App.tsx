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
import TransferList from "./pages/Employes/transfer/transferList.tsx";
import ProductStockList from "./pages/Employes/productStock/productStockList.tsx";
import SaleList from "./pages/Employes/sale/saleList.tsx";
import Account from "./pages/Employes/account/seeAccount.tsx";

function App() {

  return (
    <>
    <SnackbarProvider maxSnack={5}
                      anchorOrigin={
                        {
                          vertical: "top",
                          horizontal: "right"
                        }
                      }>
      <Router>
              <Routes>
                  <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<ProductList/>} />
                  <Route path="/employeeHome" element={<ProtectedRoute><ProductsList /></ProtectedRoute>} />
                  <Route path="/categoryList" element={<ProtectedRoute><CategoryList/></ProtectedRoute>} />
                  <Route path="/pointOfSale" element={<ProtectedRoute><PointOfSaleList /></ProtectedRoute>} />
                  <Route path="/employee" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
                  <Route path="/transfers" element={<ProtectedRoute><TransferList/></ProtectedRoute>}/>
                  <Route path="/productStock" element={<ProtectedRoute><ProductStockList /></ProtectedRoute>} />
                  <Route path="/sale" element={<ProtectedRoute><SaleList /></ProtectedRoute>} />
                  <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
              </Routes>
        </Router>
    </SnackbarProvider>
        
    </>

  )
}

export default App
