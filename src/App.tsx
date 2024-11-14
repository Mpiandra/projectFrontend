import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Register from "./pages/Employes/register.tsx";
import Login from "./pages/Employes/login.tsx";
import ProductList from "./pages/Customer/productList.tsx";
import ProtectedRoute from "./protectedRoute.tsx";
import ProductsList from "./pages/Employes/productsList.tsx";
import AddProductTypeandAttributes from "./pages/Employes/addProductTypeandAttributes.tsx";
import CategoryList from "./pages/Employes/categoryList.tsx";

function App() {

  return (
    <>
        <Router>
            <Routes>
                <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProductList/>} />
                <Route path="/employeeHome" element={<ProtectedRoute><ProductsList /></ProtectedRoute>} />
                <Route path="/categoryList" element={<ProtectedRoute><CategoryList/></ProtectedRoute>} />
                <Route path="/categoryList/:idCategory/:categoryName/addProductTypeAndAttribute" element={<ProtectedRoute><AddProductTypeandAttributes/></ProtectedRoute>} />
            </Routes>
        </Router>
    </>

  )
}

export default App
